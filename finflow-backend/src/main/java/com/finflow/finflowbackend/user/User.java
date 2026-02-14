package com.finflow.finflowbackend.user;

import com.finflow.finflowbackend.account.Account;
import com.finflow.finflowbackend.common.enums.AuthMethod;
import com.finflow.finflowbackend.common.enums.UserStatus;
import com.finflow.finflowbackend.common.persistence.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(
        name = "users"
)
@Getter
@NoArgsConstructor
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid")
    private UUID userId;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuthMethod authMethod;

    @Column(length = 100, unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private boolean emailVerified;

    @Column
    private String phoneNumber; //stored in E.164 format, e.g. +64211234567

    @Column
    private String passwordHash; //this field only makes sense when authModel == "LOCAL"

    @Column(nullable = false)
    private LocalDate dateOfBirth;

    @Column(nullable = false)
    private String timeZone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Setter
    private UserStatus status;

    @Column
    private Instant lastLoginAt;

    @Column
    @Setter
    private Instant deactivatedAt;

    @OneToMany(mappedBy = "user")
    private List<Account> financialAccounts = new ArrayList<>();

    public static User createLocalUser(
            String firstName,
            String lastName,
            AuthMethod authMethod,
            String email,
            String phoneNumber,
            String passwordHash,
            LocalDate dateOfBirth,
            String timeZone
    ) {
        User user = new User();
        user.firstName = normalizeName(firstName);
        user.lastName = normalizeName(lastName);
        user.authMethod = Objects.requireNonNull(authMethod, "Auth Method");
        user.email = requireNonBlank(email, "Email");
        user.phoneNumber = requireNonBlank(phoneNumber, "Phone Number");
        user.passwordHash = requireNonBlank(passwordHash, "Password Hash");
        user.dateOfBirth = requirePastDate(dateOfBirth, "Date of Birth");
        user.timeZone = requireNonBlank(timeZone, "Time Zone");

        //Temp change this to active for testing
        user.status = UserStatus.ACTIVE;
        user.lastLoginAt = null;

        user.assertInvariants();
        return user;
    }

    public void setFirstName(String firstName) {
        this.firstName = normalizeName(firstName);
    }

    public void setLastName(String lastName) {
        this.lastName = normalizeName(lastName);
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = requireNonBlank(phoneNumber, "Phone Number");
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = requirePastDate(dateOfBirth, "dateOfBirth");
    }

    public void setTimeZone(String timeZone) {
        this.timeZone = requireNonBlank(timeZone, "Timezone");
    }

    private void assertInvariants() {
        // passwordHash invariant
        if (authMethod == AuthMethod.LOCAL) {
            if (passwordHash == null || passwordHash.isBlank()) {
                throw new IllegalStateException("LOCAL user must have passwordHash");
            }
        } else {
            if (passwordHash != null) {
                throw new IllegalStateException("Non-LOCAL user must not have passwordHash");
            }
        }

        // minimal sanity checks (Bean Validation should cover DTO; entity still protects itself)
        if (firstName == null || firstName.isBlank()) throw new IllegalStateException("firstName required");
        if (lastName == null || lastName.isBlank()) throw new IllegalStateException("lastName required");
        if (email == null || email.isBlank()) throw new IllegalStateException("email required");
        if (dateOfBirth == null) throw new IllegalStateException("dateOfBirth required");
        if (timeZone == null || timeZone.isBlank()) throw new IllegalStateException("timeZone required");
        if (status == null) throw new IllegalStateException("status required");
        if (financialAccounts == null) financialAccounts = new ArrayList<>();
    }

    private static String normalizeName(String input) {
        String v = requireNonBlank(input, "name").trim();
        if (v.length() > 100) {
            throw new IllegalArgumentException("name must be <= 100 characters");
        }
        return v;
    }

    private static LocalDate requirePastDate(LocalDate date, String field) {
        Objects.requireNonNull(date, field + " must not be null");
        if (!date.isBefore(LocalDate.now())) { // adjust to @PastOrPresent if you want
            throw new IllegalArgumentException(field + " must be in the past");
        }
        return date;
    }

    private static String requireNonBlank(String v, String field) {
        if (v == null || v.isBlank()) throw new IllegalArgumentException(field + " must not be blank");
        return v;
    }
}
