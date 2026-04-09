package com.finflow.finflowbackend.notification;

import com.finflow.finflowbackend.budget.Budget;
import com.finflow.finflowbackend.common.persistence.BaseEntity;
import com.finflow.finflowbackend.user.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(
        name = "user_notifications",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_user_notif_budget_period_type",
                        columnNames = {"user_id", "budget_id", "period_start", "notification_type"})
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserNotification extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "notification_type", nullable = false, length = 50)
    private NotificationType notificationType;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(nullable = false, length = 2000)
    private String body;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "budget_id", nullable = false)
    private Budget budget;

    @Column(name = "period_start", nullable = false)
    private LocalDate periodStart;

    @Column(name = "read_flag", nullable = false)
    private boolean readFlag;

    public static UserNotification createBudgetExceeded(User user, Budget budget, LocalDate periodStart, String title, String body) {
        UserNotification n = new UserNotification();
        n.user = user;
        n.notificationType = NotificationType.BUDGET_EXCEEDED;
        n.budget = budget;
        n.periodStart = periodStart;
        n.title = title;
        n.body = body;
        n.readFlag = false;
        return n;
    }

    public void markRead() {
        this.readFlag = true;
    }
}
