package com.finflow.finflowbackend.category;

import com.finflow.finflowbackend.common.persistence.BaseEntity;
import com.finflow.finflowbackend.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(
        name = "categories",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "name"})
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Category extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    @Setter
    @Column
    private String icon;

    @Column(nullable = false)
    private String colorHex;

    @Column(nullable = false)
    private boolean systemDefined;

    @Column
    private Instant deletedAt;

    public boolean isDeleted() {
        return deletedAt != null;
    }

    public void softDelete() {
        if (isDeleted()) {
            return;
        }
        if (this.systemDefined) {
            throw new IllegalStateException("Cannot delete system defined category");
        }
        this.deletedAt = Instant.now();
    }

    public void rename(String name) {
        if (this.systemDefined) {
            throw new IllegalStateException("Cannot rename system defined category");
        }
        validateCategoryInput(name, this.colorHex);
        this.name = name.trim();
    }

    public static Category create(User user, String name, String colorHex, boolean systemDefined) {
        validateCategoryInput(name, colorHex);

        Category category = new Category();
        category.user = Objects.requireNonNull(user);
        category.name = Objects.requireNonNull(name);
        category.colorHex = Objects.requireNonNull(colorHex);
        category.systemDefined = systemDefined;
        return category;
    }

    public static Category createUserCategory(User user, String name, String colorHex) {
        return create(user, name, colorHex, false);
    }

    public static Category createSystemCategory(User user, String name, String colorHex) {
        return create(user, name, colorHex, true);
    }

    private static void validateCategoryInput(String name, String colorHex) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Category name is required");
        }

        if (!colorHex.matches("^#[0-9A-Fa-f]{6}$")) {
            throw new IllegalArgumentException("Invalid color hex");
        }
    }
}
