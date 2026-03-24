-- Align budget period_type check with application enum (YEARLY, CUSTOM).
ALTER TABLE budgets DROP CONSTRAINT IF EXISTS budgets_period_type_check;
ALTER TABLE budgets ADD CONSTRAINT budgets_period_type_check
    CHECK (period_type IN ('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'CUSTOM'));

CREATE TABLE user_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(500) NOT NULL,
    body VARCHAR(2000) NOT NULL,
    budget_id UUID NOT NULL,
    period_start DATE NOT NULL,
    read_flag BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT fk_user_notifications_user
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_user_notifications_budget
        FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_notif_budget_period_type
        UNIQUE (user_id, budget_id, period_start, notification_type)
);

CREATE INDEX idx_user_notifications_user_created
    ON user_notifications (user_id, created_at DESC);
