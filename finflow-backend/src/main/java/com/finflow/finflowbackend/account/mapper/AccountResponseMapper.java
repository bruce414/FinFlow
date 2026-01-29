package com.finflow.finflowbackend.account.mapper;

import com.finflow.finflowbackend.account.Account;
import com.finflow.finflowbackend.account.dto.AccountDetailsOutDto;
import com.finflow.finflowbackend.common.mapper.MoneyResponseMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = MoneyResponseMapper.class)
public interface AccountResponseMapper {

    //Account -> AccountDetailsOutDto
    @Mapping(source = "id", target = "accountId")
    @Mapping(source = "accountMoney", target = "money")
    AccountDetailsOutDto toAccountDetailsOutDto(Account account);
}
