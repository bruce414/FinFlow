package com.finflow.finflowbackend.transaction.dto;

import com.finflow.finflowbackend.category.Category;
import com.finflow.finflowbackend.common.dtos.money.MoneyResponseDto;
import com.finflow.finflowbackend.common.enums.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.UUID;

public record TransactionDetailsOutDto(
    UUID accountId,
    UUID transactionId,
    TransactionOrigin origin,
    TransactionDirection direction,
    TransactionType type,
    MoneyResponseDto moneyResponse,
    LocalDate postedDate,
    String reference,
    TransactionStatus transactionStatus,
    UUID categoryId,
    String counterpartyName,
    CounterpartyType counterpartyType
) {}
