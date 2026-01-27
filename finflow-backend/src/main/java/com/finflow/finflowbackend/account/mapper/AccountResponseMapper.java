package com.finflow.finflowbackend.account.mapper;

import com.finflow.finflowbackend.account.Account;
import com.finflow.finflowbackend.account.dto.AccountDetailsOutDto;

public interface AccountResponseMapper {

    //Account -> AccountDetailsOutDto
    AccountDetailsOutDto toAccountDetailsOutDto(Account account);
}
