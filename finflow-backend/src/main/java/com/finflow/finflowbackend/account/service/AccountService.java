package com.finflow.finflowbackend.account.service;

import com.finflow.finflowbackend.account.AccountRepository;
import com.finflow.finflowbackend.account.mapper.AccountResponseMapper;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class AccountService {

    private final AccountRepository accountRepository;
    private final AccountResponseMapper accountResponseMapper;

    public AccountService(AccountRepository accountRepository, AccountResponseMapper accountResponseMapper) {
        this.accountRepository = accountRepository;
        this.accountResponseMapper = accountResponseMapper;
    }
}
