package com.finflow.finflowbackend.common.dtos.money;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record MoneyRequestDto(
    @NotNull
    @Digits(integer = 13,  fraction = 6)
    BigDecimal amount,

    @NotNull
    @NotBlank
    @Size(min = 3, max = 3)
    @Pattern(regexp = "^[A-Z]{3}$")
    String currencyCode
) {}
