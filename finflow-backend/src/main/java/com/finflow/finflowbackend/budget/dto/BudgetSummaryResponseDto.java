package com.finflow.finflowbackend.budget.dto;

import com.finflow.finflowbackend.common.dtos.money.MoneyResponseDto;

import java.time.LocalDate;
import java.util.UUID;

public record BudgetSummaryResponseDto (
    UUID budgetId,
    String budgetName,
    LocalDate startDate,
    MoneyResponseDto budgetLimit,
    UUID categoryId,
    boolean enableRollover,
    boolean active
) {}
