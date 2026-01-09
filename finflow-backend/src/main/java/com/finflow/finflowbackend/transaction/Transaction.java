package com.finflow.finflowbackend.transaction;

import com.finflow.finflowbackend.account.Account;
import com.finflow.finflowbackend.category.Category;
import com.finflow.finflowbackend.common.enums.CounterpartyType;
import com.finflow.finflowbackend.common.enums.TransactionDirection;
import com.finflow.finflowbackend.common.enums.TransactionOrigin;
import com.finflow.finflowbackend.common.enums.TransactionType;
import com.finflow.finflowbackend.valueobjects.Money;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(
        name = "transactions",
        indexes = {
                @Index(name = "idx_transaction_date", columnList = "account_id, posted_date"),
                @Index(name = "idx_transaction_category", columnList = "category_id")
        }
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
    private TransactionOrigin origin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionDirection direction;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(
                    name = "amount",
                    column = @Column(name = "transaction_amount", nullable = false)
            ),
            @AttributeOverride(
                    name = "currency",
                    column = @Column(name = "transaction_currency", nullable = false)
            )
    })
    private Money transactionMoney;

    @Column(name = "posted_date", nullable = false)
    private LocalDate postedDate;

    @Column(length = 255)
    private String reference;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus transactionStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category transactionCategory;

//    @Column(nullable = false)
//    private boolean recurring = false; //This does not scale

    @Column(nullable = false, length = 255)
    private String counterpartyName = "UNKNOWN";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CounterpartyType counterpartyType;

    public static Transaction createTransaction(
            Account account,
            Money money,
            LocalDate postedDate,
            TransactionDirection direction,
            TransactionType type,
            TransactionOrigin origin,
            String counterpartyName,
            CounterpartyType counterpartyType
    ) {
        Transaction transaction = new Transaction();
        transaction.account = Objects.requireNonNull(account, "account is required");
        transaction.transactionMoney = Objects.requireNonNull(money, "money is required");
        transaction.postedDate = Objects.requireNonNull(postedDate,  "postedDate is required");
        transaction.counterpartyName = normalizeOrDefault(counterpartyName);
        transaction.counterpartyType = Objects.requireNonNull(counterpartyType, "counterpartyType is required");
        transaction.direction = Objects.requireNonNull(direction, "direction is required");
        transaction.type = Objects.requireNonNull(type,  "type is required");
        transaction.origin = Objects.requireNonNull(origin,  "origin is required");
        transaction.transactionStatus = TransactionStatus.POSTED;
        return transaction;
    }

    public void updateReference(String reference) {
        this.reference = normalizeReference(reference);
    }

    private static String normalizeReference(String reference) {
        if (reference == null) {
            return null;
        }
        String trimmedReference =  reference.trim();
        if (trimmedReference.isEmpty()) {
            return null;
        }
        return trimmedReference.length() > 255 ? trimmedReference.substring(0, 255) : trimmedReference;
    }

    private static String normalizeOrDefault(String counterpartyName) {
        if (counterpartyName == null) {
            return "UNKNOWN";
        }
        String trimmedCounterpartyName = counterpartyName.trim();
        if (trimmedCounterpartyName.isEmpty()) {
            return "UNKNOWN";
        }
        return trimmedCounterpartyName.length() > 255 ? trimmedCounterpartyName.substring(0, 255) : trimmedCounterpartyName;
    }
}
