package com.finflow.finflowbackend.account;

import com.finflow.finflowbackend.common.enums.AccountOrigin;
import com.finflow.finflowbackend.common.enums.AccountType;
import com.finflow.finflowbackend.common.persistence.BaseEntity;
import com.finflow.finflowbackend.user.User;
import com.finflow.finflowbackend.valueobjects.Money;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(
        name = "accounts"
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountOrigin accountOrigin;

    //The account's default name
    @Column(nullable = false)
    private String providerAccountName;

    //The account name users can customize
    @Column(name = "account_display_name", length = 30)
    private String accountDisplayName;

    @Column(nullable = false, length = 4)
    private String accountNumberLast4;

    @Column(nullable = false)
    private String institutionName;

    @Column(nullable = false)
    private String institutionCode;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(
                    name = "amount",
                    column = @Column(name = "account_balance", nullable = false, precision = 19, scale = 6)
            ),
            @AttributeOverride(
                    name = "currencyCode",
                    column = @Column(name = "account_currency_code", nullable = false, length = 3)
            )
    })
    private Money accountMoney;

    @Column(nullable = false)
    private boolean active;

    private Instant closedAt;

    public void deActive() {
        if (!this.active) {
            return;
        }
        this.active = false;
    }

    public static Account createAccount(
        User user,
        AccountType accountType,
        AccountOrigin accountOrigin,
        String providerAccountName,
        String accountDisplayName,
        String accountNumberLast4,
        String institutionName,
        String institutionCode,
        Money accountMoney
    ) {
        Objects.requireNonNull(user, "user cannot be null");
        Objects.requireNonNull(accountType, "accountType cannot be null");
        Objects.requireNonNull(accountOrigin, "accountOrigin cannot be null");

        String defaultName = requireNotBlank(providerAccountName, "account provider name cannot be blank");
        String instName = requireNotBlank(institutionName, "institutionName cannot be blank");
        String instCode = requireNotBlank(institutionCode, "institutionCode cannot be blank").trim();

        Money money = Objects.requireNonNull(accountMoney, "accountMoney cannot be null");
        if (money.getCurrencyCode() == null) throw new IllegalArgumentException("accountMoney currency cannot be null");
        if (money.getAmount() == null) throw new IllegalArgumentException("accountMoney amount cannot be null");
        if (money.getAmount().signum() < 0) throw new IllegalArgumentException("opening balance cannot be negative");

        Account account = new Account();
        account.user = user;
        account.accountType = accountType;
        account.accountOrigin = accountOrigin;

        if (accountDisplayName == null) {
            account.accountDisplayName = null;
        } else {
            account.accountDisplayName = requireNotBlank(accountDisplayName, "account display name cannot be blank");
        }

        account.providerAccountName = defaultName.trim();
        account.accountNumberLast4 = handleAccountNumberLast4(accountType, accountNumberLast4);
        account.institutionName = instName;
        account.institutionCode = instCode;
        account.accountMoney = money;

        account.active = true;
        account.closedAt = null;

        return account;
    }

    public void setAccountDisplayName(String accountDisplayName) {
        this.accountDisplayName = requireNotBlank(accountDisplayName, "account display name cannot be blank");
    }

    private static String requireNotBlank(String value, String message) {
        if (value == null || value.isBlank()) throw new IllegalArgumentException(message);
        return value;
    }

    private static final String LAST4_NOT_APPLICABLE = "0000";
    public static String handleAccountNumberLast4(AccountType accountType, String accountNumberLast4) {
        if (accountType == AccountType.CASH) {
            return LAST4_NOT_APPLICABLE;
        }

        if (accountNumberLast4 == null || accountNumberLast4.isBlank()) {
            throw new IllegalArgumentException("accountNumberLast4 is required for non-cash accounts");
        }

        String normalized = accountNumberLast4.trim();
        if (!normalized.matches("^\\d{4}$")) {
            throw new IllegalArgumentException("accountNumberLast4 must be exactly 4 digits for non-cash accounts");
        }
        if (LAST4_NOT_APPLICABLE.equals(normalized)) {
            throw new IllegalArgumentException("accountNumberLast4 cannot be 0000 for non-cash accounts");
        }
        return normalized;
    }

    //For updating the account balance - IN
    public void credit(Money moneyIn) {
        this.validateMoney(moneyIn);

        if (moneyIn.getAmount().signum() < 0) {
            throw new IllegalArgumentException("Money amount must be greater than zero");
        }
        this.accountMoney = this.accountMoney.add(moneyIn);
    }

    //For updating the account balance - OUT
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

    //Validate if the input Money object is valid
    private void validateMoney(Money newMoney) {
        if (newMoney == null) {
            throw new IllegalArgumentException("Money cannot be null");
        }
        if (!newMoney.getCurrencyCode().equals(this.accountMoney.getCurrencyCode())) {
            throw new IllegalArgumentException("Money currency mismatch");
        }
    }

    //apply the new account balance logic
    public void apply() {

    }
}
