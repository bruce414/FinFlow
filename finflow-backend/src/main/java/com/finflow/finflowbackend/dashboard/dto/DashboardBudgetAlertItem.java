package com.finflow.finflowbackend.dashboard.dto;

import com.finflow.finflowbackend.common.dtos.money.MoneyResponseDto;
import com.finflow.finflowbackend.common.enums.PeriodType;

import java.time.LocalDate;
import java.util.UUID;

public record DashboardBudgetAlertItem(
        UUID budgetId,
        String budgetName,
        PeriodType periodType,
        LocalDate periodStart,
        LocalDate periodEnd,
        MoneyResponseDto limit,
        MoneyResponseDto spent
) {}
