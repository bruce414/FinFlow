package com.finflow.finflowbackend.currency;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(
        name = "currencies"
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode
public class Currency {

    @Id
    @Column(length = 3)
    private String code; //ISO 4217, e.g. SGD

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int decimalScale;

    @Column(nullable = false)
    private boolean active = true;

    public Currency(String code, String name, int decimalScale, boolean active) {
        if (code == null) throw new IllegalArgumentException("code is null");
        String normalizedCode = code.trim().toUpperCase();
        if (normalizedCode.length() != 3) throw new IllegalArgumentException("code length is not 3");

        if (!normalizedCode.matches("[A-Z]{3}")) {
            throw new IllegalArgumentException("code must contain only letters A-Z (ISO 4217 alpha code)");
        }

        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("name must not be null or blank");
        }
        String normalizedName = name.trim();

        if (decimalScale < 0) {
            throw new IllegalArgumentException("decimalScale must be >= 0");
        }

        this.code = normalizedCode;
        this.name = normalizedName;
        this.decimalScale = decimalScale;
        this.active = active;
    }
}
