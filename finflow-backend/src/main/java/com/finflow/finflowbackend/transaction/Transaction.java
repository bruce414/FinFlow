package com.finflow.finflowbackend.transaction;

import com.finflow.finflowbackend.account.Account;
import com.finflow.finflowbackend.common.enums.TransactionDirection;
import com.finflow.finflowbackend.common.enums.TransactionOrigin;
import com.finflow.finflowbackend.common.enums.TransactionType;
import com.finflow.finflowbackend.valueobjects.Money;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(
        name = "transactions"
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionOrigin source;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionDirection direction;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    @Embedded
    private Money transactionMoney;

    @Column(nullable = false)
    private LocalDate transactionDate;

    @Column
    private String reference;


}
