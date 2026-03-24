package com.finflow.finflowbackend.notification;

import com.finflow.finflowbackend.budget.Budget;
import com.finflow.finflowbackend.budget.evaluation.BudgetExceededAlert;
import com.finflow.finflowbackend.budget.evaluation.BudgetExceededEvaluationService;
import com.finflow.finflowbackend.budget.evaluation.BudgetPeriodWindowCalculator;
import com.finflow.finflowbackend.budget.repository.BudgetRepository;
import com.finflow.finflowbackend.common.enums.UserStatus;
import com.finflow.finflowbackend.exception.ResourceNotFoundException;
import com.finflow.finflowbackend.notification.dto.NotificationOutDto;
import com.finflow.finflowbackend.user.User;
import com.finflow.finflowbackend.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserNotificationService {

    private final UserNotificationRepository userNotificationRepository;
    private final BudgetExceededEvaluationService budgetExceededEvaluationService;
    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;

    public UserNotificationService(
            UserNotificationRepository userNotificationRepository,
            BudgetExceededEvaluationService budgetExceededEvaluationService,
            BudgetRepository budgetRepository,
            UserRepository userRepository) {
        this.userNotificationRepository = userNotificationRepository;
        this.budgetExceededEvaluationService = budgetExceededEvaluationService;
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void syncBudgetExceededNotifications(UUID userId) {
        Optional<User> userOpt = userRepository.findByUserIdAndStatus(userId, UserStatus.ACTIVE);
        if (userOpt.isEmpty()) {
            return;
        }
        User user = userOpt.get();
        LocalDate today = LocalDate.now();
        List<BudgetExceededAlert> exceeded = budgetExceededEvaluationService.findExceededBudgets(userId, today);

        for (BudgetExceededAlert alert : exceeded) {
            Optional<UserNotification> existing = userNotificationRepository
                    .findByUser_UserIdAndBudget_IdAndPeriodStartAndNotificationType(
                            userId,
                            alert.budgetId(),
                            alert.periodStart(),
                            NotificationType.BUDGET_EXCEEDED);
            if (existing.isPresent()) {
                continue;
            }
            Budget budget = budgetRepository.findByIdAndUser_UserId(alert.budgetId(), userId).orElse(null);
            if (budget == null) {
                continue;
            }
            UserNotification created = UserNotification.createBudgetExceeded(
                    user,
                    budget,
                    alert.periodStart(),
                    BudgetExceededMessageBuilder.title(),
                    BudgetExceededMessageBuilder.body(alert));
            userNotificationRepository.save(created);
        }

        List<Budget> activeBudgets = budgetRepository.findAllByUser_UserId(userId).stream()
                .filter(Budget::isActive)
                .toList();
        for (Budget budget : activeBudgets) {
            Optional<BudgetPeriodWindowCalculator.PeriodWindow> windowOpt =
                    BudgetPeriodWindowCalculator.effectiveWindow(today, budget.getPeriodType(), budget.getStartDate());
            if (windowOpt.isEmpty()) {
                continue;
            }
            LocalDate periodStart = windowOpt.get().startInclusive();
            boolean stillExceeded = exceeded.stream()
                    .anyMatch(a -> a.budgetId().equals(budget.getId()) && a.periodStart().equals(periodStart));
            if (!stillExceeded) {
                userNotificationRepository.deleteByUser_UserIdAndBudget_IdAndPeriodStartAndNotificationType(
                        userId,
                        budget.getId(),
                        periodStart,
                        NotificationType.BUDGET_EXCEEDED);
            }
        }
    }

    public List<NotificationOutDto> listForUser(UUID userId) {
        return userNotificationRepository.findByUser_UserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toDto)
                .toList();
    }

    public long countUnread(UUID userId) {
        return userNotificationRepository.countByUser_UserIdAndReadFlagFalse(userId);
    }

    @Transactional
    public void markRead(UUID userId, UUID notificationId) {
        UserNotification n = userNotificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));
        if (!n.getUser().getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Notification not found with id: " + notificationId);
        }
        n.markRead();
        userNotificationRepository.save(n);
    }

    private NotificationOutDto toDto(UserNotification n) {
        return new NotificationOutDto(
                n.getId(),
                n.getNotificationType().name(),
                n.getTitle(),
                n.getBody(),
                n.getCreatedAt(),
                n.isReadFlag(),
                n.getBudget().getId(),
                n.getPeriodStart());
    }
}
