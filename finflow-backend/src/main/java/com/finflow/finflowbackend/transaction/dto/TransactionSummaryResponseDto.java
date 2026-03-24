package com.finflow.finflowbackend.transaction.dto;

import com.finflow.finflowbackend.common.dtos.money.MoneyResponseDto;
import com.finflow.finflowbackend.common.enums.TransactionDirection;

import java.time.LocalDate;
import java.util.UUID;

public record TransactionSummaryResponseDto(
    UUID transactionId,
    LocalDate postedDate,
    TransactionDirection direction,
    MoneyResponseDto moneyResponse,
    UUID categoryId,
    String categoryName,
    String counterpartyName
) {}
