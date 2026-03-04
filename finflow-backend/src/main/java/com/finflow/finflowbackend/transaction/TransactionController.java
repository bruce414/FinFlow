package com.finflow.finflowbackend.transaction;

import com.finflow.finflowbackend.security.CurrentUserService;
import com.finflow.finflowbackend.transaction.dto.TransactionCreateDto;
import com.finflow.finflowbackend.transaction.dto.TransactionDetailsOutDto;
import com.finflow.finflowbackend.transaction.dto.TransactionSummaryResponseDto;
import com.finflow.finflowbackend.transaction.service.TransactionService;
import com.finflow.finflowbackend.user.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/me/accounts/{accountId}/transactions")
@Validated
public class TransactionController {

    private final CurrentUserService currentUserService;
    private final TransactionService transactionService;
    private final UserRepository userRepository;

    public TransactionController(CurrentUserService currentUserService, TransactionService transactionService, UserRepository userRepository) {
        this.currentUserService = currentUserService;
        this.transactionService = transactionService;
        this.userRepository = userRepository;
    }

    /*
     * Endpoint: Add a transaction
     */
    @PostMapping
    public ResponseEntity<TransactionDetailsOutDto> createManualTransaction(
            Authentication authentication,
            @PathVariable @NotNull UUID accountId,
            @RequestBody @Valid TransactionCreateDto transactionCreateDto) throws AccessDeniedException {

        UUID userId = currentUserService.requireUserId(authentication);
        TransactionDetailsOutDto transactionDetailsOutDto = transactionService.createManualTransaction(userId, accountId, transactionCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionDetailsOutDto);
    }

    /*
     * Endpoint: Get a transaction by id
     */
    @GetMapping("/{transactionId}")
    public ResponseEntity<TransactionDetailsOutDto> getTransactionById(
            Authentication authentication,
            @PathVariable @NotNull UUID accountId,
            @PathVariable @NotNull UUID transactionId) throws AccessDeniedException {

        UUID userId = currentUserService.requireUserId(authentication);
        return ResponseEntity.ok(transactionService.getTransactionById(userId, accountId, transactionId));
    }

    /*
     * Endpoint: Get all transactions
     */
    @GetMapping
    public ResponseEntity<List<TransactionSummaryResponseDto>> getAllTransactions(
            Authentication authentication,
            @PathVariable @NotNull UUID accountId) throws AccessDeniedException {

        UUID userId = currentUserService.requireUserId(authentication);
        return ResponseEntity.ok(transactionService.getAllTransactions(userId, accountId));
    }
}
