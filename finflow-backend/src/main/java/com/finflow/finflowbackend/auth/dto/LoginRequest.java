package com.finflow.finflowbackend.auth.dto;

public record LoginRequest(
    String email,
    String password
) {}
