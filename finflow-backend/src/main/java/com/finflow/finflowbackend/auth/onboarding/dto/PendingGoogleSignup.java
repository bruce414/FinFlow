package com.finflow.finflowbackend.auth.onboarding.dto;

import java.io.Serializable;

//This is for the users who have registered and authenticated, but not yet finish the onboarding process yet.
public record PendingGoogleSignup(
    String googleSubject,
    String firstName,
    String lastName,
    String email,
    boolean emailVerified
) implements Serializable {}
