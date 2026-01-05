package com.finflow.finflowbackend.valueobjects;

import com.finflow.finflowbackend.currency.Currency;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Embeddable
public class Money {

    @Column(nullable = false, precision = 19, scale = 6)
    private BigDecimal amount;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "code")
    private Currency currency;

    protected Money(){}

    public Money(BigDecimal amount, Currency currency) {
        if (amount == null && currency == null) {
            throw new IllegalArgumentException("Money amount and currency cannot be null");
        }

        this.amount = amount;
        this.currency = currency;
    }
}
