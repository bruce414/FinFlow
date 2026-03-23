package com.finflow.finflowbackend.category.dto;

import java.util.UUID;

public record CategoryResponseDto (
    UUID categoryId,
    String categoryName,
    String categoryIcon,
    String categoryColorHex,
    boolean categorySystemDefined
) {}
