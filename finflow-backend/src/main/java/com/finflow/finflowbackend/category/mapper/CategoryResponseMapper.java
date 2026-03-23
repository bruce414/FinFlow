package com.finflow.finflowbackend.category.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.finflow.finflowbackend.category.Category;
import com.finflow.finflowbackend.category.dto.CategoryResponseDto;

@Mapper(componentModel = "spring")
public interface CategoryResponseMapper {

    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "category.name", target = "categoryName")
    @Mapping(source = "category.icon", target = "categoryIcon")
    @Mapping(source = "category.colorHex", target = "categoryColorHex")
    @Mapping(source = "category.systemDefined", target = "categorySystemDefined")
    CategoryResponseDto toCategoryResponseDto(Category category);
}
