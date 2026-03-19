package com.finflow.finflowbackend.budget.controller;

import com.finflow.finflowbackend.budget.dto.BudgetCreateDto;
import com.finflow.finflowbackend.budget.dto.BudgetUpdateDto;
import com.finflow.finflowbackend.budget.dto.BudgetDetailsOutDto;
import com.finflow.finflowbackend.budget.dto.BudgetSummaryResponseDto;
import com.finflow.finflowbackend.budget.service.BudgetService;
import com.finflow.finflowbackend.security.CurrentUserService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/me/budgets")
public class BudgetController {

    private final CurrentUserService currentUserService;
    private final BudgetService budgetService;
    public BudgetController(CurrentUserService currentUserService, BudgetService budgetService) {
        this.currentUserService = currentUserService;
        this.budgetService = budgetService;
    }

    @GetMapping
    public ResponseEntity<List<BudgetSummaryResponseDto>> getAllBudgets(Authentication authentication) {
        UUID userId = currentUserService.requireUserId(authentication);
        return ResponseEntity.ok(budgetService.getAllBudgets(userId));
    }

    @GetMapping("/{budgetId}")
    public ResponseEntity<BudgetDetailsOutDto> getBudgetById(
            Authentication authentication,
            @PathVariable @NotNull UUID budgetId) {

        UUID userId = currentUserService.requireUserId(authentication);
        return ResponseEntity.ok(budgetService.getBudgetById(userId, budgetId));
    }

    @PostMapping
    public ResponseEntity<BudgetDetailsOutDto> createBudget(
            @Parameter(in = ParameterIn.HEADER, name = "X-XSRF-TOKEN", required = true,
                    description = "CSRF token from GET /api/v1/auth/csrf (token field)")
            @RequestHeader("X-XSRF-TOKEN") String csrfToken,
            Authentication authentication,
            @RequestBody @Valid BudgetCreateDto budgetCreateDto) {

         UUID userId = currentUserService.requireUserId(authentication);
         BudgetDetailsOutDto createBudget = budgetService.createBudget(userId, budgetCreateDto);
         return ResponseEntity.status(HttpStatus.CREATED).body(createBudget);
    }

    @PutMapping("/{budgetId}")
    public ResponseEntity<BudgetDetailsOutDto> updateBudget(
            @Parameter(in = ParameterIn.HEADER, name = "X-XSRF-TOKEN", required = true,
                    description = "CSRF token from GET /api/v1/auth/csrf (token field)")
            @RequestHeader("X-XSRF-TOKEN") String csrfToken,
            Authentication authentication,
            @PathVariable @NotNull UUID budgetId,
            @RequestBody @Valid BudgetUpdateDto budgetUpdateDto) {

        UUID userId = currentUserService.requireUserId(authentication);
        BudgetDetailsOutDto updated = budgetService.updateBudget(userId, budgetId, budgetUpdateDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{budgetId}")
    public ResponseEntity<Void> deleteBudget(
            Authentication authentication,
            @PathVariable @NotNull UUID budgetId) {

        UUID userId = currentUserService.requireUserId(authentication);
        budgetService.deleteBudget(userId, budgetId);
        return ResponseEntity.noContent().build();
    }


}
