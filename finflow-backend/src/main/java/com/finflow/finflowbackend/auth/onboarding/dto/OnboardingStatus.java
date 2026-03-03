package com.finflow.finflowbackend.auth.onboarding.dto;

public record OnboardingStatus(
        boolean authenticated,
        boolean pendingGoogleSignup
) {}
