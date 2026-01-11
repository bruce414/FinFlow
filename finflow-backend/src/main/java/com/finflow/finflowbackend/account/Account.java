package com.finflow.finflowbackend.account;

import com.finflow.finflowbackend.common.enums.AccountType;
import com.finflow.finflowbackend.common.persistence.BaseEntity;
import com.finflow.finflowbackend.user.User;
import com.finflow.finflowbackend.valueobjects.Money;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "accounts"
)
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Account extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountType accountType;

    @Column(nullable = false)
    private String accountName;

    @Column(nullable = false, length = 4)
    private String accountNumberLast4;

    @Column(nullable = false)
    private String institutionName;

    @Column(nullable = false)
    private String institutionCode;

    @Embedded
    @AttributeOverride(
            name = "amount",
            column = @Column(name = "account_balance", nullable = false)
    )
    @AssociationOverride(
            name = "currency",
            joinColumns = @JoinColumn(name = "currency_code", referencedColumnName = "code", nullable = false)
    )
    private Money accountMoney;

    @Column(precision = 19, scale = 4)
    private BigDecimal creditLimit; //DO NOT ADD THIS IN THE MVP MIGRATION SCRIPTS.

    @Column(nullable = false)
    private boolean active;

    private Instant closedAt;

    public void deActive() {
        if (!this.active) {
            return;
        }
        this.active = false;
    }

    public void credit(Money moneyIn) {
        this.validateMoney(moneyIn);

        if (moneyIn.getAmount().signum() < 0) {
            throw new IllegalArgumentException("Money amount must be greater than zero");
        }
        this.accountMoney = this.accountMoney.add(moneyIn);
    }

    public void debit(Money moneyOut) {
        this.validateMoney(moneyOut);

        if (moneyOut.getAmount().signum() < 0) {
            throw new IllegalArgumentException("Money amount must be greater than zero");
        }

        Money newAccountBalance = this.accountMoney.subtract(moneyOut);

        if (newAccountBalance.getAmount().signum() < 0) {
            throw new IllegalArgumentException("Insufficient balance");
        }
        this.accountMoney = newAccountBalance;
    }

    private void validateMoney(Money newMoney) {
        if (newMoney == null) {
            throw new IllegalArgumentException("Money cannot be null");
        }
        if (!newMoney.getCurrency().equals(this.accountMoney.getCurrency())) {
            throw new IllegalArgumentException("Money currency mismatch");
        }
    }

    //apply the new account balance logic
    public void apply() {

    }
}
