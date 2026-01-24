package com.finflow.finflowbackend.common.dtos.money;

import java.math.BigDecimal;

public record MoneyResponseDto(
    BigDecimal amount,
    String currencyCode,
    String currencyName
) {}
