package com.finflow.finflowbackend.auth.dtos;

public record LoginRequest(
    String email,
    String password
) {}
