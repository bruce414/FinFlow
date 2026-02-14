package com.finflow.finflowbackend.transaction;

import com.finflow.finflowbackend.transaction.dto.TransactionCreateDto;
import com.finflow.finflowbackend.transaction.dto.TransactionDetailsOutDto;
import com.finflow.finflowbackend.transaction.dto.TransactionSummaryResponseDto;
import com.finflow.finflowbackend.transaction.service.TransactionService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/users/{userId}/accounts/{accountId}/transactions")
@Validated
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    /*
     * Endpoint: Add a transaction
     */
    @PostMapping
    public ResponseEntity<TransactionDetailsOutDto> createManualTransaction(
            @PathVariable @NotNull UUID userId,
            @PathVariable @NotNull UUID accountId,
            @RequestBody @Valid TransactionCreateDto transactionCreateDto) {

        TransactionDetailsOutDto transactionDetailsOutDto = transactionService.createManualTransaction(userId, accountId, transactionCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionDetailsOutDto);
    }

    /*
     * Endpoint: Get a transaction by id
     */
    @GetMapping("/{transactionId}")
    public ResponseEntity<TransactionDetailsOutDto> getTransactionById(
            @PathVariable @NotNull UUID userId,
            @PathVariable @NotNull UUID accountId,
            @PathVariable @NotNull UUID transactionId) {

        return ResponseEntity.ok(transactionService.getTransactionById(userId, accountId, transactionId));
    }

    /*
     * Endpoint: Get all transactions
     */
    @GetMapping
    public ResponseEntity<List<TransactionSummaryResponseDto>> getAllTransactions(
            @PathVariable @NotNull UUID userId,
            @PathVariable @NotNull UUID accountId) {

        return ResponseEntity.ok(transactionService.getAllTransactions(userId, accountId));
    }
}
