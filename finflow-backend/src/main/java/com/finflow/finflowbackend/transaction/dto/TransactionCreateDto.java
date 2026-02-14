package com.finflow.finflowbackend.transaction.dto;

import com.finflow.finflowbackend.common.dtos.money.MoneyRequestDto;
import com.finflow.finflowbackend.common.enums.CounterpartyType;
import com.finflow.finflowbackend.common.enums.TransactionType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record TransactionCreateDto(
    @NotNull
    @Valid
    MoneyRequestDto moneyRequest,

    @NotNull
    LocalDate postedDate,

    @NotNull
    TransactionType transactionType,

    @Size(max = 255)
    String reference,

    @NotBlank
    @Size(max = 255)
    String counterpartyName,

    @NotNull
    CounterpartyType counterpartyType
) {}
