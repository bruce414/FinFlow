package com.finflow.finflowbackend.account.dto;

import com.finflow.finflowbackend.common.dtos.money.MoneyResponseDto;
import com.finflow.finflowbackend.common.enums.AccountOrigin;
import com.finflow.finflowbackend.common.enums.AccountType;

import java.math.BigDecimal;
import java.util.*;

public record AccountDetailsOutDto(
    UUID accountId,
    AccountType accountType,
    AccountOrigin accountOrigin,
    String providerAccountName,
    String accountDisplayName,
    String accountNumberLast4,
    String institutionName,
    String institutionCode,
    MoneyResponseDto money,
    boolean active
) {}
