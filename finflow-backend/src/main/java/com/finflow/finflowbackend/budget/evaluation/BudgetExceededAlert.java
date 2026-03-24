package com.finflow.finflowbackend.budget.evaluation;

import com.finflow.finflowbackend.common.enums.PeriodType;
import com.finflow.finflowbackend.valueobjects.Money;

import java.time.LocalDate;
import java.util.UUID;

public record BudgetExceededAlert(
        UUID budgetId,
        String budgetName,
        PeriodType periodType,
        LocalDate periodStart,
        LocalDate periodEnd,
        Money limit,
        Money spent
) {}
