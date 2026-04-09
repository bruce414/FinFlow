package com.finflow.finflowbackend.budget.repository;

import com.finflow.finflowbackend.budget.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BudgetRepository extends JpaRepository<Budget, UUID> {

    List<Budget> findAllByUser_UserId(UUID userId);

    Optional<Budget> findByIdAndUser_UserId(UUID id, UUID userId);
}
