package com.finflow.finflowbackend.account.mapper;

import com.finflow.finflowbackend.account.Account;
import com.finflow.finflowbackend.account.dto.AccountRenameDto;
import org.springframework.stereotype.Component;

@Component
public class AccountPatchApplier {
    public void apply(AccountRenameDto accountRenameDto, Account account) {
        if (accountRenameDto.accountDisplayName() != null) account.setAccountDisplayName(accountRenameDto.accountDisplayName());
    }
}
