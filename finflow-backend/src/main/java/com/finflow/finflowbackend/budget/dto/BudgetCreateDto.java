package com.finflow.finflowbackend.budget.dto;

import com.finflow.finflowbackend.common.dtos.money.MoneyRequestDto;
import com.finflow.finflowbackend.common.enums.PeriodType;

import java.time.LocalDate;
import java.util.UUID;

public record BudgetCreateDto(
       String budgetName,
       PeriodType periodType,
       LocalDate startDate,
       MoneyRequestDto budgetLimit,
       boolean enableRollover,
       UUID categoryId
) {}
