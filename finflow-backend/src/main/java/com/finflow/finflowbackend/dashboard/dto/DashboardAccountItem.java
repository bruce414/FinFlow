package com.finflow.finflowbackend.dashboard.dto;

import com.finflow.finflowbackend.common.dtos.money.MoneyResponseDto;
import com.finflow.finflowbackend.common.enums.AccountType;

import java.util.UUID;

public record DashboardAccountItem(
        UUID accountId,
        String displayName,
        MoneyResponseDto balance,
        AccountType accountType,
        String institutionName
) {}
