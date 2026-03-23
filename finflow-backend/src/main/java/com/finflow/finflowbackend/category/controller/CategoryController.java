package com.finflow.finflowbackend.category.controller;

import com.finflow.finflowbackend.security.CurrentUserService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.finflow.finflowbackend.category.service.CategoryService;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import java.util.List;
import com.finflow.finflowbackend.category.dto.CategoryResponseDto;
import org.springframework.web.bind.annotation.PathVariable;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

@RestController
@RequestMapping("api/v1/me/categories")
public class CategoryController {

    private final CurrentUserService currentUserService;
    private final CategoryService categoryService;

    public CategoryController(CurrentUserService currentUserService, CategoryService categoryService) {
        this.currentUserService = currentUserService;
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponseDto>> getCategories(
            @Parameter(in = ParameterIn.HEADER, name = "X-XSRF-TOKEN", required = true,
                    description = "CSRF token from GET /api/v1/auth/csrf (token field)")
            @RequestHeader("X-XSRF-TOKEN") String csrfToken,
            Authentication authentication) {
        UUID userId = currentUserService.requireUserId(authentication);
        List<CategoryResponseDto> categories = categoryService.getCategories(userId);
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<CategoryResponseDto> getCategoryById(
            Authentication authentication,
            @PathVariable @NotNull UUID categoryId) {
        UUID userId = currentUserService.requireUserId(authentication);
        return ResponseEntity.ok(categoryService.getCategoryById(userId, categoryId));
    }
}
