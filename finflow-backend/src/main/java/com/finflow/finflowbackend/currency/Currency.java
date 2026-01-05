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
        if (code == null || code.length() < 3) {
            throw new IllegalArgumentException("code length should be at least 3 characters");
        }

        if (decimalScale < 0) {
            throw new IllegalArgumentException("decimalScale should be at least 0");
        }

        this.code = code;
        this.name = name;
        this.decimalScale = decimalScale;
        this.active = active;
    }
}
