package com.finflow.finflowbackend.dashboard.dto;

import java.time.Instant;
import java.util.List;

public record DashboardResponse(
        Instant asOf,
        String currency,
        DashboardTotalBalance totalBalance,
        DashboardMonthlySpending monthlySpending,
        DashboardIncome monthlyIncome,
        List<DashboardSpendingByCategoryItem> spendingByCategory,
        List<DashboardAccountItem> accounts,
        List<DashboardTransactionItem> recentTransactions,
        List<DashboardBudgetAlertItem> budgetAlerts
) {}