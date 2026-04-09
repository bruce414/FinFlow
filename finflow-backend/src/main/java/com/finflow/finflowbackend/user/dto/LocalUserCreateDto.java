package com.finflow.finflowbackend.user.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record LocalUserCreateDto(
        @NotBlank
        @Size(max = 100)
        String firstName,

        @NotBlank
        @Size(max = 100)
        String lastName,

        @NotBlank
        @Email
        @Size(max = 100)
        String email,

        @Size(max = 16)
        @Pattern(regexp = "^\\+[1-9]\\d{7,14}$")
        String phoneNumber,

        @NotBlank
        @Size(min = 8, max = 72)
        String password,

        @NotNull
        @Past
        LocalDate dateOfBirth,

        @NotBlank
        @Size(max = 100)
        String timeZone
) {
}
