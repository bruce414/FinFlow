package com.finflow.finflowbackend.dashboard.dto;

import java.time.Instant;
import java.util.List;

public record DashboardResponse(
        Instant asOf,
        String currency,
        DashboardTotalBalance totalBalance,
        List<DashboardAccountItem> accounts,
        List<DashboardTransactionItem> recentTransactions
) {}