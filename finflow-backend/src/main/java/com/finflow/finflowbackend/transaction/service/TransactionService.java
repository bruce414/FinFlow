package com.finflow.finflowbackend.transaction.service;

import com.finflow.finflowbackend.account.Account;
import com.finflow.finflowbackend.account.AccountRepository;
import com.finflow.finflowbackend.common.enums.TransactionDirection;
import com.finflow.finflowbackend.common.enums.TransactionOrigin;
import com.finflow.finflowbackend.common.enums.TransactionType;
import com.finflow.finflowbackend.common.enums.UserStatus;
import com.finflow.finflowbackend.exception.ResourceNotFoundException;
import com.finflow.finflowbackend.category.repository.CategoryRepository;
import com.finflow.finflowbackend.transaction.Transaction;
import com.finflow.finflowbackend.transaction.TransactionRepository;
import com.finflow.finflowbackend.transaction.categorization.TransactionCategoryRuleEngine;
import com.finflow.finflowbackend.transaction.dto.TransactionCreateDto;
import com.finflow.finflowbackend.transaction.dto.TransactionDetailsOutDto;
import com.finflow.finflowbackend.transaction.dto.TransactionSummaryResponseDto;
import com.finflow.finflowbackend.transaction.mapper.TransactionResponseMapper;
import com.finflow.finflowbackend.user.User;
import com.finflow.finflowbackend.user.UserRepository;
import com.finflow.finflowbackend.valueobjects.Money;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final TransactionResponseMapper transactionResponseMapper;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionCategoryRuleEngine transactionCategoryRuleEngine;

    public TransactionService(
            TransactionRepository transactionRepository,
            TransactionResponseMapper transactionResponseMapper,
            UserRepository userRepository,
            AccountRepository accountRepository,
            CategoryRepository categoryRepository,
            TransactionCategoryRuleEngine transactionCategoryRuleEngine
    ) {
        this.transactionRepository = transactionRepository;
        this.transactionResponseMapper = transactionResponseMapper;
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.categoryRepository = categoryRepository;
        this.transactionCategoryRuleEngine = transactionCategoryRuleEngine;
    }

    public TransactionDetailsOutDto createManualTransaction(UUID userId, UUID accountId, TransactionCreateDto transactionCreateDto) {
        User user = userRepository.findByUserIdAndStatus(userId, UserStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + accountId));

        Money money = Money.of(transactionCreateDto.moneyRequest().amount(), transactionCreateDto.moneyRequest().currencyCode());

        TransactionDirection transactionDirection = transactionCreateDto.transactionType() == TransactionType.TRANSFER
                ? null : transactionCreateDto.transactionType() == TransactionType.CREDIT ? TransactionDirection.IN : TransactionDirection.OUT;

        Transaction transaction = Transaction.createTransaction(
                account,
                money,
                transactionCreateDto.postedDate(),
                transactionDirection,
                transactionCreateDto.transactionType(),
                TransactionOrigin.MANUAL,
                transactionCreateDto.counterpartyName(),
                transactionCreateDto.counterpartyType()
        );
        transaction.updateReference(transactionCreateDto.reference());

        String categoryName = transactionCategoryRuleEngine.resolveCategoryName(
                transactionCreateDto.transactionType(),
                transactionDirection,
                transactionCreateDto.counterpartyType(),
                transactionCreateDto.counterpartyName(),
                transactionCreateDto.reference()
        );
        categoryRepository.findActiveByUserIdAndName(userId, categoryName)
                .ifPresent(transaction::assignCategory);

        Transaction savedTransaction = transactionRepository.save(transaction);

        if (transactionDirection == TransactionDirection.IN) {
            account.credit(Money.of(money.getAmount().abs(), money.getCurrencyCode()));
            accountRepository.saveAndFlush(account);
        } else if (transactionDirection == TransactionDirection.OUT) {
            account.debit(Money.of(money.getAmount().abs(), money.getCurrencyCode()));
            accountRepository.saveAndFlush(account);
        }

        return transactionResponseMapper.toTransactionDetailsOutDto(savedTransaction);
    }

    public TransactionDetailsOutDto getTransactionById(UUID userId, UUID accountId, UUID transactionId) {
        User user = userRepository.findByUserIdAndStatus(userId, UserStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + accountId));

        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + transactionId));

        return transactionResponseMapper.toTransactionDetailsOutDto(transaction);
    }

    public List<TransactionSummaryResponseDto> getAllTransactions(UUID userId, UUID accountId) {
        User user = userRepository.findByUserIdAndStatus(userId, UserStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + accountId));

        List<Transaction> transactions = transactionRepository.findAllByAccount_IdOrderByPostedDateDesc(account.getId());
        List<TransactionSummaryResponseDto> transactionSummaryResponseDtoList = new ArrayList<>();
        for (Transaction transaction : transactions) {
            transactionSummaryResponseDtoList.add(transactionResponseMapper.toTransactionSummaryResponseDto(transaction));
        }
        return transactionSummaryResponseDtoList;
    }
}
