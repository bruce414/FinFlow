package com.finflow.finflowbackend.account.service;

import com.finflow.finflowbackend.account.Account;
import com.finflow.finflowbackend.account.AccountRepository;
import com.finflow.finflowbackend.account.dto.AccountCreateDto;
import com.finflow.finflowbackend.account.dto.AccountDetailsOutDto;
import com.finflow.finflowbackend.account.mapper.AccountResponseMapper;
import com.finflow.finflowbackend.common.enums.AccountOrigin;
import com.finflow.finflowbackend.common.enums.AccountType;
import com.finflow.finflowbackend.common.enums.UserStatus;
import com.finflow.finflowbackend.common.mapper.MoneyResponseMapper;
import com.finflow.finflowbackend.exception.ResourceNotFoundException;
import com.finflow.finflowbackend.user.User;
import com.finflow.finflowbackend.user.UserRepository;
import com.finflow.finflowbackend.valueobjects.Money;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Transactional
public class AccountService {

    private final AccountRepository accountRepository;
    private final AccountResponseMapper accountResponseMapper;
    private final UserRepository userRepository;

    public AccountService(AccountRepository accountRepository, AccountResponseMapper accountResponseMapper, UserRepository userRepository) {
        this.accountRepository = accountRepository;
        this.accountResponseMapper = accountResponseMapper;
        this.userRepository = userRepository;
    }

    public AccountDetailsOutDto createAccount(UUID userId, AccountCreateDto accountCreateDto) {
        User user = userRepository.findByUserIdAndStatus(userId, UserStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Money money = new Money(
                accountCreateDto.moneyRequest().amount(),
                accountCreateDto.moneyRequest().currencyCode()
        );

        Account account = Account.createAccount(
                user,
                AccountType.valueOf(accountCreateDto.accountType()),
                AccountOrigin.valueOf(accountCreateDto.accountOrigin()),
                accountCreateDto.providerAccountName(),
                accountCreateDto.accountDisplayName(),
                accountCreateDto.accountNumberLast4(),
                accountCreateDto.institutionName(),
                accountCreateDto.institutionCode(),
                money
        );
    }
}
