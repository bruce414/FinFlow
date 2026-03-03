package com.finflow.finflowbackend.dashboard.dto;

import com.finflow.finflowbackend.common.dtos.money.MoneyResponseDto;

public record DashboardTotalBalance(
        MoneyResponseDto totalBalance
) {}
