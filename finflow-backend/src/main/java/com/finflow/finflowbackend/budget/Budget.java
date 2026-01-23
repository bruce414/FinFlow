package com.finflow.finflowbackend.budget;

import com.finflow.finflowbackend.category.Category;
import com.finflow.finflowbackend.common.enums.PeriodType;
import com.finflow.finflowbackend.common.persistence.BaseEntity;
import com.finflow.finflowbackend.user.User;
import com.finflow.finflowbackend.valueobjects.Money;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(
        name = "budgets",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_budgets_user_name", columnNames = {"user_id", "budget_name"})
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Budget extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, name = "budget_name")
    private String budgetName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PeriodType periodType;

    @Column
    private int customIntervalPeriod;

    @Column(nullable = false)
    private LocalDate startDate;

    @Embedded
    @AttributeOverride(
            name = "amount",
            column = @Column(name = "budget_amount", nullable = false, precision = 19, scale = 6)
    )
    @AssociationOverride(
            name = "currency",
            joinColumns = @JoinColumn(name = "budget_currency_code", referencedColumnName = "code", nullable = false)
    )
    private Money budgetMoney;

    @Column(nullable = false)
    private boolean enableRollover = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category budgetCategory;

    @Column(nullable = false)
    private boolean active = true;

    public void deactivate() {
        if (!this.active) {
            return;
        }
        active = false;
    }

    public static Budget createBudget(
            User user,
            String budgetName,
            PeriodType periodType,
            int customIntervalPeriod,
            LocalDate startDate,
            Money budgetMoney,
            boolean enableRollover,
            Category budgetCategory
    ) {
        String normalizedString = Objects.requireNonNull(budgetName).trim();
        if (periodType == PeriodType.CUSTOM) {
            if (customIntervalPeriod <= 0) throw new IllegalArgumentException("custom interval period must be > 0");
        }
        else {
            customIntervalPeriod = 0;
        }
        Budget budget = new Budget();
        budget.user = Objects.requireNonNull(user, "User must not be null");
        budget.budgetName = Objects.requireNonNull(budgetName, "Budget name must not be null");
        budget.periodType = Objects.requireNonNull(periodType, "Period type must not be null");
        budget.customIntervalPeriod = customIntervalPeriod;
        budget.startDate = Objects.requireNonNull(startDate, "Start date must not be null");
        budget.budgetMoney = Objects.requireNonNull(budgetMoney, "Budget money must not be null");
        budget.enableRollover = enableRollover;
        budget.budgetCategory = Objects.requireNonNull(budgetCategory, "Budget category must not be null");
        return budget;
    }
}
