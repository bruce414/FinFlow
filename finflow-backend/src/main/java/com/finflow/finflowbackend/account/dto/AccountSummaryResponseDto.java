package com.finflow.finflowbackend.account.dto;

import com.finflow.finflowbackend.common.dtos.money.MoneyResponseDto;
import com.finflow.finflowbackend.common.enums.AccountOrigin;
import com.finflow.finflowbackend.common.enums.AccountType;

import java.util.UUID;

public record AccountSummaryResponseDto(
    UUID accountId,
    AccountType accountType,
    AccountOrigin accountOrigin,
    String providerAccountName,
    String accountDisplayName,
    MoneyResponseDto accountMoney,
    boolean active
) {}
