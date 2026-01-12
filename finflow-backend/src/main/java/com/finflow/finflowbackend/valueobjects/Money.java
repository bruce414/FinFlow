package com.finflow.finflowbackend.valueobjects;

import com.finflow.finflowbackend.currency.Currency;
import jakarta.persistence.*;
import lombok.Getter;

import java.math.BigDecimal;

@Embeddable
@Getter
public class Money {

    @Column(nullable = false, precision = 19, scale = 6)
    private BigDecimal amount;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "currency_code", referencedColumnName = "code")
    private Currency currency;

    protected Money(){}

    public Money(BigDecimal amount, Currency currency) {
        if (amount == null || currency == null) {
            throw new IllegalArgumentException("Money amount or currency cannot be null");
        }

        this.amount = amount;
        this.currency = currency;
    }

    public Money add(Money otherMoney) {
        this.requireSameCurrency(otherMoney);
        return new Money(this.amount.add(otherMoney.getAmount()), this.currency);
    }

    public Money subtract(Money otherMoney) {
        this.requireSameCurrency(otherMoney);
        return new Money(this.amount.subtract(otherMoney.getAmount()), this.currency);
    }

    private void requireSameCurrency(Money otherMoney) {
        if (!this.currency.equals(otherMoney.currency)) {
            throw new IllegalArgumentException("Money currency are not the same");
        }
    }
}
