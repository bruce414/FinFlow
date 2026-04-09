package com.finflow.finflowbackend.budget.service;

import com.finflow.finflowbackend.budget.Budget;
import com.finflow.finflowbackend.budget.dto.BudgetCreateDto;
import com.finflow.finflowbackend.budget.dto.BudgetDetailsOutDto;
import com.finflow.finflowbackend.budget.dto.BudgetSummaryResponseDto;
import com.finflow.finflowbackend.budget.dto.BudgetUpdateDto;
import com.finflow.finflowbackend.budget.mapper.BudgetResponseMapper;
import com.finflow.finflowbackend.budget.repository.BudgetRepository;
import com.finflow.finflowbackend.category.Category;
import com.finflow.finflowbackend.category.repository.CategoryRepository;
import com.finflow.finflowbackend.common.enums.UserStatus;
import com.finflow.finflowbackend.exception.ResourceNotFoundException;
import com.finflow.finflowbackend.notification.UserNotificationService;
import com.finflow.finflowbackend.user.User;
import com.finflow.finflowbackend.user.UserRepository;
import com.finflow.finflowbackend.valueobjects.Money;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    private final UserRepository userRepository;
    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final BudgetResponseMapper budgetResponseMapper;
    private final UserNotificationService userNotificationService;

    public BudgetService(
            UserRepository userRepository,
            BudgetRepository budgetRepository,
            CategoryRepository categoryRepository,
            BudgetResponseMapper budgetResponseMapper,
            UserNotificationService userNotificationService) {
        this.userRepository = userRepository;
        this.budgetRepository = budgetRepository;
        this.categoryRepository = categoryRepository;
        this.budgetResponseMapper = budgetResponseMapper;
        this.userNotificationService = userNotificationService;
    }

    public BudgetDetailsOutDto getBudgetById(UUID userId, UUID budgetId) {
        userRepository.findByUserIdAndStatus(userId, UserStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Budget budget = budgetRepository.findByIdAndUser_UserId(budgetId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + budgetId));

        return budgetResponseMapper.toBudgetDetailsOutDto(budget);
    }

    public List<BudgetSummaryResponseDto> getAllBudgets(UUID userId) {
        userRepository.findByUserIdAndStatus(userId, UserStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return budgetRepository.findAllByUser_UserId(userId).stream()
                .map(budgetResponseMapper::toBudgetSummaryResponseDto)
                .collect(Collectors.toList());
    }

    public BudgetDetailsOutDto createBudget(UUID userId, BudgetCreateDto dto) {
        User user = userRepository.findByUserIdAndStatus(userId, UserStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Category category = categoryRepository.findByIdAndUser_UserId(dto.categoryId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.categoryId()));

        Money budgetMoney = Money.of(dto.budgetLimit().amount(), dto.budgetLimit().currencyCode());

        Budget budget = Budget.createBudget(
                user,
                dto.budgetName(),
                dto.periodType(),
                dto.startDate(),
                budgetMoney,
                dto.enableRollover(),
                category
        );

        budget = budgetRepository.save(budget);
        userNotificationService.syncBudgetExceededNotifications(userId);
        return budgetResponseMapper.toBudgetDetailsOutDto(budget);
    }

    public BudgetDetailsOutDto updateBudget(UUID userId, UUID budgetId, BudgetUpdateDto dto) {
        userRepository.findByUserIdAndStatus(userId, UserStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Budget budget = budgetRepository.findByIdAndUser_UserId(budgetId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + budgetId));

        Money budgetMoney = dto.budgetLimit() != null
                ? Money.of(dto.budgetLimit().amount(), dto.budgetLimit().currencyCode())
                : null;

        budget.updateDetails(
                dto.budgetName(),
                dto.periodType(),
                budgetMoney,
                dto.enableRollover(),
                dto.active()
        );

        budget = budgetRepository.save(budget);
        userNotificationService.syncBudgetExceededNotifications(userId);
        return budgetResponseMapper.toBudgetDetailsOutDto(budget);
    }

    public void deleteBudget(UUID userId, UUID budgetId) {
        userRepository.findByUserIdAndStatus(userId, UserStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Budget budget = budgetRepository.findByIdAndUser_UserId(budgetId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + budgetId));

        budgetRepository.delete(budget);
        userNotificationService.syncBudgetExceededNotifications(userId);
    }
}
