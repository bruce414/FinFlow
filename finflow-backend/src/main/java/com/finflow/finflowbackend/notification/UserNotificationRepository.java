package com.finflow.finflowbackend.notification;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserNotificationRepository extends JpaRepository<UserNotification, UUID> {

    List<UserNotification> findByUser_UserIdOrderByCreatedAtDesc(UUID userId);

    Optional<UserNotification> findByUser_UserIdAndBudget_IdAndPeriodStartAndNotificationType(
            UUID userId,
            UUID budgetId,
            LocalDate periodStart,
            NotificationType notificationType);

    void deleteByUser_UserIdAndBudget_IdAndPeriodStartAndNotificationType(
            UUID userId,
            UUID budgetId,
            LocalDate periodStart,
            NotificationType notificationType);

    long countByUser_UserIdAndReadFlagFalse(UUID userId);
}
