package com.finflow.finflowbackend.auth.dto;

import java.util.UUID;

public record MeResponse(
    UUID userId,
    String firstName,
    String lastName,
    String email,
    String authMethod
) {}
