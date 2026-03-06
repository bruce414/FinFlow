package com.finflow.finflowbackend.dashboard.dto;

import com.finflow.finflowbackend.common.dtos.money.MoneyResponseDto;
import com.finflow.finflowbackend.common.enums.TransactionDirection;

import java.time.LocalDate;
import java.util.UUID;

public record DashboardTransactionItem(
        UUID transactionId,
        UUID accountId,
        TransactionDirection direction,
        MoneyResponseDto amount,
        LocalDate postedDate,
        String counterpartyName,
        UUID categoryId
) {}
