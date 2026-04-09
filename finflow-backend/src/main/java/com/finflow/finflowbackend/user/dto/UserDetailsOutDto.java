package com.finflow.finflowbackend.user.dto;

import com.finflow.finflowbackend.common.enums.UserStatus;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record UserDetailsOutDto(
    UUID userId,
    String firstName,
    String lastName,
    String email,
    boolean emailVerified,
    String phoneNumber,
    LocalDate dateOfBirth,
    String timeZone,
    UserStatus status,
    Instant lastLoginAt
) {}

