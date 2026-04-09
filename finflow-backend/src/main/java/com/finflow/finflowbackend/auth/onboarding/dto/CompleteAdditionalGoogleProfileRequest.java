package com.finflow.finflowbackend.auth.onboarding.dto;

import java.time.LocalDate;

public record CompleteAdditionalGoogleProfileRequest(
       LocalDate dateOfBirth,
       String timeZone,
       String baseCurrencyCode
) {}
