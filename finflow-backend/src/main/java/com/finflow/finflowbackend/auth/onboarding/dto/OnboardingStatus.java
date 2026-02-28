package com.finflow.finflowbackend.auth.onboarding.controller;

public record OnboardingStatus(
        boolean authenticated,
        boolean pendingGoogleSignup
) {}
