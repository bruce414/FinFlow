package com.finflow.finflowbackend.account;

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
public class Account {

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
    private Money accountMoney;

    @Column(precision = 19, scale = 4)
    private BigDecimal creditLimit;

    @Column(nullable = false)
    private boolean active;

    private Instant closedAt;

    public void deactive() {
        if (!this.active) {
            return;
        }
        this.active = false;
    }

    public void updateAccountMoney(Money newMoney) {
        if (newMoney == null) {
            throw new IllegalArgumentException("Money cannot be null");
        }
        if (!newMoney.getCurrency().equals(this.accountMoney.getCurrency())) {
            throw new IllegalArgumentException("Money currency mismatch");
        }
        this.accountMoney = newMoney;
    }
}
