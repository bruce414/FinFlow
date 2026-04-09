package com.finflow.finflowbackend.budget.evaluation;

import com.finflow.finflowbackend.common.enums.PeriodType;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.Optional;

/**
 * Maps a budget's {@link PeriodType} to calendar windows for "today", then clips the start to
 * the budget's {@code startDate} so spending is only counted after the budget is active.
 */
public final class BudgetPeriodWindowCalculator {

    public record PeriodWindow(LocalDate startInclusive, LocalDate endInclusive) {}

    private BudgetPeriodWindowCalculator() {}

    public static PeriodWindow rawWindowFor(LocalDate today, PeriodType periodType) {
        return switch (periodType) {
            case DAILY -> new PeriodWindow(today, today);
            case WEEKLY -> {
                LocalDate monday = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
                yield new PeriodWindow(monday, monday.plusDays(6));
            }
            case MONTHLY -> {
                LocalDate start = today.withDayOfMonth(1);
                LocalDate end = today.with(TemporalAdjusters.lastDayOfMonth());
                yield new PeriodWindow(start, end);
            }
            case QUARTERLY -> {
                int month = today.getMonthValue();
                int qStartMonth = ((month - 1) / 3) * 3 + 1;
                LocalDate start = LocalDate.of(today.getYear(), qStartMonth, 1);
                LocalDate end = start.plusMonths(2).with(TemporalAdjusters.lastDayOfMonth());
                yield new PeriodWindow(start, end);
            }
            case YEARLY -> {
                LocalDate start = LocalDate.of(today.getYear(), 1, 1);
                LocalDate end = LocalDate.of(today.getYear(), 12, 31);
                yield new PeriodWindow(start, end);
            }
            case CUSTOM -> rawWindowFor(today, PeriodType.MONTHLY);
        };
    }

    /**
     * @return empty if the budget has not started yet or does not overlap the current raw period.
     */
    public static Optional<PeriodWindow> effectiveWindow(LocalDate today, PeriodType periodType, LocalDate budgetStartDate) {
        if (budgetStartDate.isAfter(today)) {
            return Optional.empty();
        }
        PeriodWindow raw = rawWindowFor(today, periodType);
        if (budgetStartDate.isAfter(raw.endInclusive())) {
            return Optional.empty();
        }
        LocalDate start = raw.startInclusive().isBefore(budgetStartDate) ? budgetStartDate : raw.startInclusive();
        if (start.isAfter(raw.endInclusive())) {
            return Optional.empty();
        }
        return Optional.of(new PeriodWindow(start, raw.endInclusive()));
    }
}
