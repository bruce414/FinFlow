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

CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('CASH', 'CREDIT_CARD', 'CHECKING', 'SAVINGS')),
    account_name VARCHAR(100) NOT NULL,
    account_number_last4 VARCHAR(4) NOT NULL,
    institution_name VARCHAR(255) NOT NULL,
    institution_code VARCHAR(40) NOT NULL,
    account_balance DECIMAL(19, 6) NOT NULL DEFAULT 0,
    currency_code VARCHAR(10) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    closed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT fk_account_user
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,

    CONSTRAINT fk_account_currency
        FOREIGN KEY (currency_code) REFERENCES currencies(code)
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL,
    origin VARCHAR(15) NOT NULL CHECK (origin IN ('USER', 'SYSTEM', 'IMPORT', 'OPEN_BANKING')),
    direction VARCHAR(4) NOT NULL CHECK (direction IN ('IN', 'OUT')),
    type VARCHAR(10) NOT NULL CHECK (type IN ('CREDIT', 'DEBIT', 'TRANSFER')),
    transaction_amount DECIMAL(19, 6) NOT NULL DEFAULT 0,
    transaction_currency_code VARCHAR(10) NOT NULL,
    posted_date DATE NOT NULL,
    reference VARCHAR(255),
    transaction_status VARCHAR(10) NOT NULL CHECK (transaction_status IN ('PENDING', 'POSTED', 'REVERSED', 'DELETED')),
    category_id UUID,
    counterparty_name VARCHAR(255) NOT NULL,
    counterparty_type VARCHAR(15) NOT NULL CHECK (counterparty_type IN ('PERSON', 'MERCHANT', 'BANK', 'GOVERNMENT', 'UNKNOWN')),

    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT fk_transaction_account
        FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,

    CONSTRAINT fk_transaction_currency
        FOREIGN KEY (transaction_currency_code) REFERENCES currencies(code),

    CONSTRAINT fk_transaction_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE currencies (
    code CHAR(3) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    decimal_scale INT NOT NULL CHECK (decimal_scale > 0),
    active BOOLEAN NOT NULL DEFAULT TRUE
);

