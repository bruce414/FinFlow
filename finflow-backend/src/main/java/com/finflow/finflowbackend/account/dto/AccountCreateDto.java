package com.finflow.finflowbackend.account.dto;

import com.finflow.finflowbackend.common.dtos.money.MoneyRequestDto;
import com.finflow.finflowbackend.common.enums.AccountOrigin;
import com.finflow.finflowbackend.common.enums.AccountType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

public record AccountCreateDto(
    @Size(min = 1, max = 30)
    String accountDisplayName,

    @NotBlank
    @Size(min = 1, max = 30)
    String providerAccountName,

    @NotNull
    AccountType accountType,

    @NotNull
    AccountOrigin accountOrigin,

    @Size(min = 4, max = 4)
    @Pattern(regexp = "^\\d{4}$")
    String accountNumberLast4,

    @NotBlank
    @Size(min = 1, max = 50)
    String institutionName,

    @NotBlank
    @Size(min = 3, max = 3)
    String institutionCode,

    @NotNull
    @Valid
    MoneyRequestDto moneyRequest
) {}
