package com.finflow.finflowbackend.budget.mapper;

import com.finflow.finflowbackend.budget.Budget;
import com.finflow.finflowbackend.budget.dto.BudgetDetailsOutDto;
import com.finflow.finflowbackend.budget.dto.BudgetSummaryResponseDto;
import com.finflow.finflowbackend.common.mapper.MoneyResponseMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = MoneyResponseMapper.class)
public interface BudgetResponseMapper {

    //Budget -> BudgetDetailsOutDto
    @Mapping(source = "budget.id", target = "budgetId")
    @Mapping(source = "budgetMoney", target = "moneyResponse")
    @Mapping(source = "budgetCategory.id", target = "categoryId")
    BudgetDetailsOutDto toBudgetDetailsOutDto(Budget budget);

    //budget -> BudgetSummaryResponseDto
    @Mapping(source = "budget.id", target = "budgetId")
    @Mapping(source = "budgetMoney", target = "budgetLimit")
    @Mapping(source = "budgetCategory.id", target = "categoryId")
    BudgetSummaryResponseDto toBudgetSummaryResponseDto(Budget budget);
}
