package com.finflow.finflowbackend.budget.dto;

import com.finflow.finflowbackend.common.dtos.money.MoneyRequestDto;
import com.finflow.finflowbackend.common.enums.PeriodType;

public record BudgetUpdateDto(
        String budgetName,
        PeriodType periodType,
        MoneyRequestDto budgetLimit,
        boolean enableRollover,
        boolean active
) {}
