package com.finflow.finflowbackend.valueobjects;

import jakarta.persistence.*;
import lombok.Getter;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Currency;
import java.util.Locale;
import java.util.Objects;

@Embeddable
@Getter
public class Money {

    @Column(nullable = false, precision = 19, scale = 6)
    private BigDecimal amount;

//    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @Column(name = "currency_code", nullable = false, length = 3)
    private String currencyCode;

    protected Money(){}

    private Money(BigDecimal amount, String currencyCode) {
        this.amount = amount;
        this.currencyCode = currencyCode;
    }

    public static Money of(BigDecimal amount, String currencyCode) {
        if (amount == null) throw new IllegalArgumentException("Amount must not be null");
        if (currencyCode == null || currencyCode.isBlank()) throw new IllegalArgumentException("Currency code must not be blank");

        BigDecimal normalizedAmount = normalizeAmount(amount);
        String normalizeCurrencyCode = normalizeCurrencyCode(currencyCode);
        return new Money(normalizedAmount, normalizeCurrencyCode);
    }

    private static final int SCALE = 6;
    private static BigDecimal normalizeAmount(BigDecimal amount) {
        return amount.setScale(SCALE, RoundingMode.HALF_UP);
    }

    private static String normalizeCurrencyCode(String currencyCode) {
        String trimmedCurrencyCode = currencyCode.trim();
        if (trimmedCurrencyCode.isBlank()) throw new IllegalArgumentException("Currency code must not be blank");
        return trimmedCurrencyCode.toUpperCase(Locale.ROOT);
    }

    /*
     * For money amount is ZERO 0
     */
    public static Money zero(String currencyCode) {
        return new Money(BigDecimal.ZERO, currencyCode);
    }

    public Money add(Money otherMoney) {
        this.requireSameCurrency(otherMoney);
        return new Money(this.amount.add(otherMoney.getAmount()), this.currencyCode);
    }

    public Money subtract(Money otherMoney) {
        this.requireSameCurrency(otherMoney);
        return new Money(this.amount.subtract(otherMoney.getAmount()), this.currencyCode);
    }

    /*
     * For negating the amount
     */
    public Money negate() {
        return Money.of(this.amount.negate(), this.currencyCode);
    }

    private void requireSameCurrency(Money otherMoney) {
        Objects.requireNonNull(otherMoney, "Money must not be null");
        if (!this.currencyCode.equals(otherMoney.currencyCode)) {
            throw new IllegalArgumentException("Money currency are not the same");
        }
    }
}
