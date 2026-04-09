package com.finflow.finflowbackend.dashboard.dto;

import com.finflow.finflowbackend.common.dtos.money.MoneyResponseDto;

import java.util.UUID;

/**
 * One category's total spending (e.g. for the current month).
 * {@code categoryId} and {@code colorHex} are null for uncategorized transactions.
 */
public record DashboardSpendingByCategoryItem(
        UUID categoryId,
        String categoryName,
        String colorHex,
        MoneyResponseDto amount
) {}
