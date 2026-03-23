package com.finflow.finflowbackend.category.repository;

import com.finflow.finflowbackend.category.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, UUID> {

    Optional<Category> findByIdAndUser_UserId(UUID id, UUID userId);

    List<Category> findAllByUser_UserId(UUID userId);
}
