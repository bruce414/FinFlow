package com.finflow.finflowbackend.user.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record UserPatchDto(
    @Size(min = 1, max = 50)
    String firstName,

    @Size(min = 1, max = 50)
    String lastName,

    @Pattern(regexp = "^\\+[1-9]\\d{7,14}$")
    String phoneNumber,

    @Past
    LocalDate dateOfBirth,

    @Size(max = 50)
    String timeZone
) {}
