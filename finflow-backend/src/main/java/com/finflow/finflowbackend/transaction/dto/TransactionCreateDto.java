package com.finflow.finflowbackend.transaction.dto;

import com.finflow.finflowbackend.common.dtos.money.MoneyRequestDto;
import com.finflow.finflowbackend.common.enums.CounterpartyType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record TransactionCreateDto(
    @NotNull
    @Valid
    MoneyRequestDto moneyRequest,

    @NotNull
    LocalDate postedDate,

    @Size(max = 255)
    String reference,

    @NotBlank
    @Size(max = 255)
    String counterpartyName,

    @NotNull
    CounterpartyType counterpartyType
) {}
