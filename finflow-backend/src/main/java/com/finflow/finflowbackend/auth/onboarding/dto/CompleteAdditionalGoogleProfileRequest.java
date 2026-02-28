package com.finflow.finflowbackend.auth.onboarding.dto;

import java.time.LocalDate;

public record CompleteGoogleProfileRequest(
   LocalDate dateOfBirth,
   
) {}
