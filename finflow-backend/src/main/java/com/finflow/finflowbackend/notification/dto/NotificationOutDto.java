package com.finflow.finflowbackend.notification.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record NotificationOutDto(
        UUID id,
        String notificationType,
        String title,
        String body,
        Instant createdAt,
        boolean read,
        UUID budgetId,
        LocalDate periodStart
) {}
