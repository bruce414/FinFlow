package com.finflow.finflowbackend.budget.dto;

import com.finflow.finflowbackend.common.dtos.money.MoneyResponseDto;
import com.finflow.finflowbackend.common.enums.PeriodType;

import java.time.LocalDate;
import java.util.UUID;

public record BudgetDetailsOutDto(
       UUID budgetId,
       String budgetName,
       PeriodType periodType,
       LocalDate startDate,
       MoneyResponseDto moneyResponse,
       boolean enableRollover,
       UUID categoryId,
       boolean active
) {}
