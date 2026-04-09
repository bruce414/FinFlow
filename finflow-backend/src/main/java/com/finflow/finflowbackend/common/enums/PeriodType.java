package com.finflow.finflowbackend.common.enums;

public enum PeriodType {
    DAILY,
    WEEKLY,
    MONTHLY,
    QUARTERLY,
    /** Calendar-year budget; persisted as YEARLY to match DB constraint. */
    YEARLY,
    CUSTOM
}
