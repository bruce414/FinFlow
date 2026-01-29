package com.finflow.finflowbackend.account.mapper;

import com.finflow.finflowbackend.account.Account;
import com.finflow.finflowbackend.account.dto.AccountDetailsOutDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AccountResponseMapper {

    //Account -> AccountDetailsOutDto
    @Mapping(source = "id", target = "accountId")
    @Mapping(source = "accountMoney.amount", target = "money.amount")
    @Mapping(source = "accountMoney.currency", target = "money.currencyCode")
    AccountDetailsOutDto toAccountDetailsOutDto(Account account);
}
