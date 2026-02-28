package com.finflow.finflowbackend.auth.onboarding;

import java.io.Serializable;

public record PendingGoogleSignup(
    String googleSubject,
    String firstName,
    String lastName,
    String email,
    boolean emailVerified
) implements Serializable {}
