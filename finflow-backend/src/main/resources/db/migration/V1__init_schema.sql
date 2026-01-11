CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    auth_method VARCHAR(30) NOT NULL CHECK (auth_method IN ('LOCAL', 'GOOGLE', 'APPLE')),
    email VARCHAR(100) NOT NULL UNIQUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    phone_number VARCHAR(20),
    password_hash VARCHAR(255),
    date_of_birth DATE NOT NULL,
    time_zone VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'DELETED')),
    last_login_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT chk_password_hash_local
        CHECK (
            (auth_method = 'LOCAL' AND password_hash IS NOT NULL)
            OR
            (auth_method <> 'LOCAL' AND password_hash IS NULL)
        )
);