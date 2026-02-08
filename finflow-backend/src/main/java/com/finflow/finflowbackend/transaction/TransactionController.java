package com.finflow.finflowbackend.transaction;

import com.finflow.finflowbackend.transaction.dto.TransactionCreateDto;
import com.finflow.finflowbackend.transaction.dto.TransactionDetailsOutDto;
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
    public ResponseEntity<TransactionDetailsOutDto> createTransaction(
            @PathVariable @NotNull UUID userId,
            @PathVariable @NotNull UUID accountId,
            @RequestBody @Valid TransactionCreateDto transactionCreateDto) {

        //Complete the body to replace this
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
    }

    /*
     * Endpoint: Get a transaction by id
     */
    @GetMapping("/{transactionId}")
    public ResponseEntity<TransactionDetailsOutDto> getTransaction(
            @PathVariable @NotNull UUID userId,
            @PathVariable @NotNull UUID accountId,
            @PathVariable @NotNull UUID transactionId) {

        //Complete the body to replace this
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
    }

    /*
     * Endpoint: Get all transactions
     */
    @GetMapping
    public ResponseEntity<List<TransactionDetailsOutDto>> getAllTransactions(
            @PathVariable @NotNull UUID userId,
            @PathVariable @NotNull UUID accountId) {

        //Complete the body to replace this
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
    }

    @DeleteMapping("/{transactionId}")
    public ResponseEntity<Void> deleteTransaction(
            @PathVariable @NotNull UUID userId,
            @PathVariable @NotNull UUID accountId,
            @PathVariable @NotNull UUID transactionId) {

        //Complete the body to replace this
        return ResponseEntity.noContent().build();
    }
}
