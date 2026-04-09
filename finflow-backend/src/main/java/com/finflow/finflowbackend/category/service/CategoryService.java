package com.finflow.finflowbackend.category.service;

import com.finflow.finflowbackend.category.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;
import com.finflow.finflowbackend.category.dto.CategoryResponseDto;
import java.util.List;
import java.util.ArrayList;
import com.finflow.finflowbackend.category.Category;
import com.finflow.finflowbackend.category.SystemCategories;
import com.finflow.finflowbackend.exception.ResourceNotFoundException;
import com.finflow.finflowbackend.user.User;
import com.finflow.finflowbackend.user.UserRepository;
import com.finflow.finflowbackend.common.enums.UserStatus;
import com.finflow.finflowbackend.category.mapper.CategoryResponseMapper;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final CategoryResponseMapper categoryResponseMapper;
    private final SystemCategories systemCategories;

    public CategoryService(UserRepository userRepository, CategoryRepository categoryRepository, CategoryResponseMapper categoryResponseMapper, SystemCategories systemCategories) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.categoryResponseMapper = categoryResponseMapper;
        this.systemCategories = systemCategories;
    }

    public CategoryResponseDto getCategoryById(UUID userId, UUID categoryId) {
        Category category = categoryRepository.findByIdAndUser_UserId(categoryId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));

        return categoryResponseMapper.toCategoryResponseDto(category);
    }

    public List<CategoryResponseDto> getCategories(UUID userId) {
        userRepository.findByUserIdAndStatus(userId, UserStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        List<CategoryResponseDto> categoryResponseDtos = new ArrayList<>();
        List<Category> categories = categoryRepository.findAllByUser_UserId(userId);
        for (Category category : categories) {
            categoryResponseDtos.add(categoryResponseMapper.toCategoryResponseDto(category));
        }
        return categoryResponseDtos;
    }

    @Transactional
    public void createSystemCategories(UUID userId) {
        User user = userRepository.findByUserIdAndStatus(userId, UserStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Idempotency: do not insert categories that already exist for this user.
        List<Category> existingCategories = categoryRepository.findAllByUser_UserId(userId);
        Set<String> existingNames = existingCategories.stream()
                .map(Category::getName)
                .collect(Collectors.toSet());

        List<Category> toCreate = new ArrayList<>();
        for (SystemCategories.SystemCategoryDef def : systemCategories.getSystemCategories()) {
            if (existingNames.contains(def.name())) {
                continue;
            }

            Category category = Category.createSystemCategory(user, def.name(), def.colorHex());
            category.setIcon(def.icon());
            toCreate.add(category);
        }

        categoryRepository.saveAll(toCreate);
    }
}
