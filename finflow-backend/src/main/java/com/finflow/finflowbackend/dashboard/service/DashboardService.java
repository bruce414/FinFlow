package com.finflow.finflowbackend.dashboard.service;

import com.finflow.finflowbackend.account.Account;
import com.finflow.finflowbackend.account.AccountRepository;
import com.finflow.finflowbackend.common.enums.TransactionDirection;
import com.finflow.finflowbackend.common.enums.UserStatus;
import com.finflow.finflowbackend.common.mapper.MoneyResponseMapper;
import com.finflow.finflowbackend.dashboard.dto.*;
import com.finflow.finflowbackend.exception.ResourceNotFoundException;
import com.finflow.finflowbackend.security.CurrentUserService;
import com.finflow.finflowbackend.transaction.Transaction;
import com.finflow.finflowbackend.transaction.TransactionRepository;
import com.finflow.finflowbackend.category.Category;
import com.finflow.finflowbackend.user.User;
import com.finflow.finflowbackend.user.UserRepository;
import com.finflow.finflowbackend.valueobjects.Money;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Stream;

@Service
public class DashboardService {

    private static final int RECENT_TRANSACTIONS_LIMIT = 15;

    private final CurrentUserService currentUserService;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final MoneyResponseMapper moneyResponseMapper;

    public DashboardService(
            CurrentUserService currentUserService,
            AccountRepository accountRepository,
            TransactionRepository transactionRepository,
            UserRepository userRepository,
            MoneyResponseMapper moneyResponseMapper) {
        this.currentUserService = currentUserService;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.moneyResponseMapper = moneyResponseMapper;
    }

    /**
     * Builds the full dashboard for the authenticated user: total balance, account list, and recent transactions.
     */
    public DashboardResponse buildDashboard(Authentication authentication) {
        UUID userId = currentUserService.requireUserId(authentication);
        User user = userRepository.findByUserIdAndStatus(userId, UserStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        List<Account> accountList = accountRepository.findAccountsByUserUserId(userId);
        List<Account> activeAccounts = accountList.stream().filter(Account::isActive).toList();

        Money totalBalance = computeTotalBalanceInBaseCurrency(activeAccounts, user.getBaseCurrencyCode());
        Money spending = computeMonthlySpending(userId, user.getBaseCurrencyCode());
        Money income = computeMonthlyIncome(userId, user.getBaseCurrencyCode());
        List<DashboardSpendingByCategoryItem> spendingByCategory = computeSpendingByCategory(userId, user.getBaseCurrencyCode());

        List<DashboardAccountItem> accountItems = activeAccounts.stream()
                .map(this::toDashboardAccountItem)
                .toList();
        List<DashboardTransactionItem> recentTransactions = fetchRecentTransactions(activeAccounts);

        DashboardTotalBalance totalBalanceDto = new DashboardTotalBalance(
                moneyResponseMapper.toMoneyResponseDto(totalBalance));
        DashboardMonthlySpending monthlySpendingDto = new DashboardMonthlySpending(
                moneyResponseMapper.toMoneyResponseDto(spending));
        DashboardIncome monthlyIncomeDto = new DashboardIncome(
                moneyResponseMapper.toMoneyResponseDto(income));

        return new DashboardResponse(
                Instant.now(),
                user.getBaseCurrencyCode(),
                totalBalanceDto,
                monthlySpendingDto,
                monthlyIncomeDto,
                spendingByCategory,
                accountItems,
                recentTransactions);
    }

    /**
     * Total balance across all active accounts, in the user's base currency only.
     * Accounts in other currencies are skipped for MVP.
     */
    private Money computeTotalBalanceInBaseCurrency(List<Account> accounts, String baseCurrencyCode) {
        Money total = Money.zero(baseCurrencyCode);
        for (Account account : accounts) {
            Money bal = account.getAccountMoney();
            if (!bal.getCurrencyCode().equals(baseCurrencyCode)) {
                continue;
            }
            total = total.add(bal);
        }
        return total;
    }

    private DashboardAccountItem toDashboardAccountItem(Account account) {
        String displayName = account.getAccountDisplayName() != null && !account.getAccountDisplayName().isBlank()
                ? account.getAccountDisplayName()
                : account.getProviderAccountName();
        return new DashboardAccountItem(
                account.getId(),
                displayName,
                moneyResponseMapper.toMoneyResponseDto(account.getAccountMoney()),
                account.getAccountType(),
                account.getInstitutionName());
    }

    private DashboardTransactionItem toDashboardTransactionItem(Transaction t) {
        UUID categoryId = t.getTransactionCategory() != null ? t.getTransactionCategory().getId() : null;
        return new DashboardTransactionItem(
                t.getId(),
                t.getAccount().getId(),
                t.getDirection(),
                moneyResponseMapper.toMoneyResponseDto(t.getTransactionMoney()),
                t.getPostedDate(),
                t.getCounterpartyName(),
                categoryId);
    }

    /**
     * Fetches recent transactions across all given accounts, sorted by posted date descending, limited to {@link #RECENT_TRANSACTIONS_LIMIT}.
     */
    private List<DashboardTransactionItem> fetchRecentTransactions(List<Account> accounts) {
        if (accounts.isEmpty()) {
            return List.of();
        }
        Stream<Transaction> stream = accounts.stream()
                .flatMap(acc -> transactionRepository.findAllByAccount_IdOrderByPostedDateDesc(acc.getId()).stream());
        List<Transaction> sorted = stream
                .sorted(Comparator.comparing(Transaction::getPostedDate).reversed())
                .limit(RECENT_TRANSACTIONS_LIMIT)
                .toList();
        return sorted.stream().map(this::toDashboardTransactionItem).toList();
    }

    /**
     * Spending in the current month grouped by category (OUT transactions, base currency only).
     * Categories are sorted by amount descending. Uncategorized transactions appear as one item with
     * {@code categoryId} and {@code colorHex} null, name "Uncategorized".
     */
    private List<DashboardSpendingByCategoryItem> computeSpendingByCategory(UUID userId, String baseCurrencyCode) {
        List<Account> accounts = accountRepository.findAccountsByUserUserId(userId).stream()
                .filter(Account::isActive)
                .toList();
        YearMonth current = YearMonth.now();
        LocalDate start = current.atDay(1);
        LocalDate end = current.atEndOfMonth();

        Money uncategorizedTotal = Money.zero(baseCurrencyCode);
        Map<UUID, CategorySpendingAccumulator> byCategoryId = new HashMap<>();

        for (Account account : accounts) {
            if (!account.getAccountMoney().getCurrencyCode().equals(baseCurrencyCode)) continue;
            List<Transaction> txs = transactionRepository.findAllByAccount_IdOrderByPostedDateDesc(account.getId());
            for (Transaction t : txs) {
                if (t.getDirection() != TransactionDirection.OUT) continue;
                if (t.getPostedDate().isBefore(start) || t.getPostedDate().isAfter(end)) continue;
                if (!t.getTransactionMoney().getCurrencyCode().equals(baseCurrencyCode)) continue;
                Money amount = t.getTransactionMoney();
                Category category = t.getTransactionCategory();
                if (category == null) {
                    uncategorizedTotal = uncategorizedTotal.add(amount);
                } else {
                    byCategoryId
                            .computeIfAbsent(category.getId(), id -> new CategorySpendingAccumulator(category.getName(), category.getColorHex(), baseCurrencyCode))
                            .add(amount);
                }
            }
        }

        List<DashboardSpendingByCategoryItem> result = new ArrayList<>();
        for (Map.Entry<UUID, CategorySpendingAccumulator> e : byCategoryId.entrySet()) {
            result.add(new DashboardSpendingByCategoryItem(
                    e.getKey(),
                    e.getValue().name,
                    e.getValue().colorHex,
                    moneyResponseMapper.toMoneyResponseDto(e.getValue().total)));
        }
        if (uncategorizedTotal.getAmount().signum() > 0) {
            result.add(new DashboardSpendingByCategoryItem(
                    null,
                    "Uncategorized",
                    null,
                    moneyResponseMapper.toMoneyResponseDto(uncategorizedTotal)));
        }
        result.sort(Comparator.comparing((DashboardSpendingByCategoryItem i) -> i.amount().amount()).reversed());
        return result;
    }

    private static final class CategorySpendingAccumulator {
        final String name;
        final String colorHex;
        Money total;

        CategorySpendingAccumulator(String name, String colorHex, String currencyCode) {
            this.name = name;
            this.colorHex = colorHex;
            this.total = Money.zero(currencyCode);
        }

        void add(Money amount) {
            this.total = this.total.add(amount);
        }
    }

    /**
     * Sum of OUT (spending) transactions in the current month, in base currency.
     * Useful for "this month's spending" when the dashboard DTO is extended.
     */
    public Money computeMonthlySpending(UUID userId, String baseCurrencyCode) {
        List<Account> accounts = accountRepository.findAccountsByUserUserId(userId).stream()
                .filter(Account::isActive)
                .toList();
        YearMonth current = YearMonth.now();
        LocalDate start = current.atDay(1);
        LocalDate end = current.atEndOfMonth();
        Money total = Money.zero(baseCurrencyCode);
        for (Account account : accounts) {
            if (!account.getAccountMoney().getCurrencyCode().equals(baseCurrencyCode)) continue;
            List<Transaction> txs = transactionRepository.findAllByAccount_IdOrderByPostedDateDesc(account.getId());
            for (Transaction t : txs) {
                if (t.getDirection() != TransactionDirection.OUT) continue;
                if (t.getPostedDate().isBefore(start) || t.getPostedDate().isAfter(end)) continue;
                if (!t.getTransactionMoney().getCurrencyCode().equals(baseCurrencyCode)) continue;
                total = total.add(t.getTransactionMoney());
            }
        }
        return total;
    }

    /**
     * Sum of IN (income) transactions in the current month, in base currency.
     * Useful for "this month's income" when the dashboard DTO is extended.
     */
    public Money computeMonthlyIncome(UUID userId, String baseCurrencyCode) {
        List<Account> accounts = accountRepository.findAccountsByUserUserId(userId).stream()
                .filter(Account::isActive)
                .toList();
        YearMonth current = YearMonth.now();
        LocalDate start = current.atDay(1);
        LocalDate end = current.atEndOfMonth();
        Money total = Money.zero(baseCurrencyCode);
        for (Account account : accounts) {
            if (!account.getAccountMoney().getCurrencyCode().equals(baseCurrencyCode)) continue;
            List<Transaction> txs = transactionRepository.findAllByAccount_IdOrderByPostedDateDesc(account.getId());
            for (Transaction t : txs) {
                if (t.getDirection() != TransactionDirection.IN) continue;
                if (t.getPostedDate().isBefore(start) || t.getPostedDate().isAfter(end)) continue;
                if (!t.getTransactionMoney().getCurrencyCode().equals(baseCurrencyCode)) continue;
                total = total.add(t.getTransactionMoney());
            }
        }
        return total;
    }

    /**
     * Number of active accounts for the user. Useful for summary or when extending the dashboard.
     */
    public int getActiveAccountCount(UUID userId) {
        return (int) accountRepository.findAccountsByUserUserId(userId).stream()
                .filter(Account::isActive)
                .count();
    }
}
