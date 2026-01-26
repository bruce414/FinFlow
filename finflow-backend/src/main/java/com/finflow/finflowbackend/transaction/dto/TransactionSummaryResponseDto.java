package com.finflow.finflowbackend.transaction.dto;

import com.finflow.finflowbackend.common.dtos.money.MoneyResponseDto;
import com.finflow.finflowbackend.common.enums.TransactionDirection;

import java.util.UUID;

public record TransactionSummaryResponseDto(
    TransactionDirection direction,
    MoneyResponseDto moneyResponse,
    UUID categoryId,
    String counterpartyName
) {}
