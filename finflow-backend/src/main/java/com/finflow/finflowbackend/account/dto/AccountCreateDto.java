package com.finflow.finflowbackend.account.dto;

import com.finflow.finflowbackend.common.enums.AccountType;
import com.finflow.finflowbackend.currency.Currency;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.*;
import lombok.Builder;

import java.math.BigDecimal;

public record AccountCreateDto(
    @NotNull
    @NotBlank
    @Size(min = 1, max = 30)
    String accountName,

    @NotNull
    String accountType,

    @Size(min = 4, max = 4)
    @Pattern(regexp = "^\\d{4}$")
    String accountNumberLast4,

    @NotNull
    @NotBlank
    @Size(min = 1, max = 50)
    String institutionName,

    @NotNull
    @NotBlank
    @Size(min = 3, max = 3)
    String institutionCode,

    @NotNull
    @Digits(integer = 13, fraction = 6)
    BigDecimal accountBalance,

    @NotNull
    @NotBlank
    @Size(min = 3, max = 3)
    String accountCurrencyCode,

    BigDecimal creditLimit
) {}
