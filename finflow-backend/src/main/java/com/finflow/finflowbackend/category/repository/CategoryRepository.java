package com.finflow.finflowbackend.category.repository;

import com.finflow.finflowbackend.category.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, UUID> {

    Optional<Category> findByIdAndUser_UserId(UUID id, UUID userId);

    List<Category> findAllByUser_UserId(UUID userId);

    @Query("SELECT c FROM Category c WHERE c.user.userId = :userId AND c.name = :name AND c.deletedAt IS NULL")
    Optional<Category> findActiveByUserIdAndName(@Param("userId") UUID userId, @Param("name") String name);
}
