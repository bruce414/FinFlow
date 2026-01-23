package com.finflow.finflowbackend.account.dto;

import jakarta.validation.constraints.*;

public record AccountRenameDto(
    @NotNull
    @NotBlank
    @Size(min = 1, max = 30)
    String accountDisplayName
) {}
