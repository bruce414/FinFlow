package com.finflow.finflowbackend.budget.evaluation;

import com.finflow.finflowbackend.account.Account;
import com.finflow.finflowbackend.account.AccountRepository;
import com.finflow.finflowbackend.budget.Budget;
import com.finflow.finflowbackend.budget.repository.BudgetRepository;
import com.finflow.finflowbackend.common.enums.TransactionDirection;
import com.finflow.finflowbackend.transaction.Transaction;
import com.finflow.finflowbackend.transaction.TransactionRepository;
import com.finflow.finflowbackend.valueobjects.Money;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BudgetExceededEvaluationService {

    private final BudgetRepository budgetRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public BudgetExceededEvaluationService(
            BudgetRepository budgetRepository,
            AccountRepository accountRepository,
            TransactionRepository transactionRepository) {
        this.budgetRepository = budgetRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    public List<BudgetExceededAlert> findExceededBudgets(UUID userId, LocalDate today) {
        List<Budget> budgets = budgetRepository.findAllByUser_UserId(userId).stream()
                .filter(Budget::isActive)
                .toList();
        List<Account> accounts = accountRepository.findAccountsByUserUserId(userId).stream()
                .filter(Account::isActive)
                .toList();

        List<BudgetExceededAlert> out = new ArrayList<>();
        for (Budget budget : budgets) {
            Optional<BudgetPeriodWindowCalculator.PeriodWindow> windowOpt =
                    BudgetPeriodWindowCalculator.effectiveWindow(today, budget.getPeriodType(), budget.getStartDate());
            if (windowOpt.isEmpty()) {
                continue;
            }
            BudgetPeriodWindowCalculator.PeriodWindow window = windowOpt.get();
            UUID categoryId = budget.getBudgetCategory().getId();
            String currency = budget.getBudgetMoney().getCurrencyCode();
            Money spent = sumOutSpendingForCategory(accounts, categoryId, currency, window.startInclusive(), window.endInclusive());
            Money limit = budget.getBudgetMoney();
            if (limit.getAmount().signum() <= 0) {
                continue;
            }
            if (spent.getAmount().compareTo(limit.getAmount()) >= 0) {
                out.add(new BudgetExceededAlert(
                        budget.getId(),
                        budget.getBudgetName(),
                        budget.getPeriodType(),
                        window.startInclusive(),
                        window.endInclusive(),
                        limit,
                        spent));
            }
        }
        return out;
    }

    private Money sumOutSpendingForCategory(
            List<Account> accounts,
            UUID categoryId,
            String currency,
            LocalDate startInclusive,
            LocalDate endInclusive) {
        Money total = Money.zero(currency);
        for (Account account : accounts) {
            if (!account.getAccountMoney().getCurrencyCode().equals(currency)) {
                continue;
            }
            List<Transaction> txs = transactionRepository.findAllByAccount_IdOrderByPostedDateDesc(account.getId());
            for (Transaction t : txs) {
                if (t.getDirection() != TransactionDirection.OUT) {
                    continue;
                }
                if (t.getTransactionCategory() == null || !t.getTransactionCategory().getId().equals(categoryId)) {
                    continue;
                }
                if (!t.getTransactionMoney().getCurrencyCode().equals(currency)) {
                    continue;
                }
                LocalDate pd = t.getPostedDate();
                if (pd.isBefore(startInclusive) || pd.isAfter(endInclusive)) {
                    continue;
                }
                Money m = t.getTransactionMoney();
                total = total.add(Money.of(m.getAmount().abs(), m.getCurrencyCode()));
            }
        }
        return total;
    }
}
