package com.finflow.finflowbackend.Entities;

import com.finflow.finflowbackend.Enums.AuthMethod;
import com.finflow.finflowbackend.Enums.UserStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;
import java.util.UUID;

@Entity
@Table(
        name = "users"
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

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

    @Column(unique = true, nullable = false)
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
    private CurrencySupported defaultCurrency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status;

    @Column
    private Instant lastLoginAt;

    @OneToMany(mappedBy = "user")
    private List<FinancialAccount> financialAccounts = new ArrayList<>();
}
