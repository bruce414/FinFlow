package com.finflow.finflowbackend.notification;

import com.finflow.finflowbackend.budget.evaluation.BudgetExceededAlert;

import java.math.BigDecimal;

public final class BudgetExceededMessageBuilder {

    private BudgetExceededMessageBuilder() {}

    public static String title() {
        return "Budget limit reached";
    }

    public static String body(BudgetExceededAlert alert) {
        BigDecimal limit = alert.limit().getAmount();
        BigDecimal spent = alert.spent().getAmount();
        String currency = alert.limit().getCurrencyCode();
        return String.format(
                "Spending for budget \"%s\" (%s period %s–%s) is %s %s, which has reached or exceeded your limit of %s %s.",
                alert.budgetName(),
                humanPeriod(alert.periodType()),
                alert.periodStart(),
                alert.periodEnd(),
                spent.stripTrailingZeros().toPlainString(),
                currency,
                limit.stripTrailingZeros().toPlainString(),
                currency);
    }

    private static String humanPeriod(com.finflow.finflowbackend.common.enums.PeriodType periodType) {
        return switch (periodType) {
            case DAILY -> "daily";
            case WEEKLY -> "weekly";
            case MONTHLY -> "monthly";
            case QUARTERLY -> "quarterly";
            case YEARLY -> "yearly";
            case CUSTOM -> "custom (calendar month)";
        };
    }
}
