package com.finflow.finflowbackend.common.mapper;

import com.finflow.finflowbackend.common.dtos.money.MoneyResponseDto;
import com.finflow.finflowbackend.valueobjects.Money;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MoneyResponseMapper {

    //Money -> MoneyResponseDto
    MoneyResponseDto toMoneyResponseDto(Money money);
}
