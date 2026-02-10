package com.finflow.finflowbackend.account.service;

import com.finflow.finflowbackend.account.Account;
import com.finflow.finflowbackend.account.AccountRepository;
import com.finflow.finflowbackend.account.dto.AccountCreateDto;
import com.finflow.finflowbackend.account.dto.AccountDetailsOutDto;
import com.finflow.finflowbackend.account.dto.AccountRenameDto;
import com.finflow.finflowbackend.account.dto.AccountSummaryResponseDto;
import com.finflow.finflowbackend.account.mapper.AccountPatchApplier;
import com.finflow.finflowbackend.account.mapper.AccountResponseMapper;
import com.finflow.finflowbackend.common.enums.UserStatus;
import com.finflow.finflowbackend.exception.ResourceNotFoundException;
import com.finflow.finflowbackend.user.User;
import com.finflow.finflowbackend.user.UserRepository;
import com.finflow.finflowbackend.valueobjects.Money;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class AccountService {

    private final AccountRepository accountRepository;
    private final AccountResponseMapper accountResponseMapper;
    private final AccountPatchApplier accountPatchApplier;
    private final UserRepository userRepository;

    public AccountService(AccountRepository accountRepository, AccountResponseMapper accountResponseMapper, AccountPatchApplier accountPatchApplier, UserRepository userRepository) {
        this.accountRepository = accountRepository;
        this.accountResponseMapper = accountResponseMapper;
        this.accountPatchApplier = accountPatchApplier;
        this.userRepository = userRepository;
    }

    public AccountDetailsOutDto createAccount(UUID userId, AccountCreateDto accountCreateDto) {
        User user = userRepository.findByUserIdAndStatus(userId, UserStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Money money = Money.of(accountCreateDto.moneyRequest().amount(), accountCreateDto.moneyRequest().currencyCode());

        Account account = Account.createAccount(
                user,
                accountCreateDto.accountType(),
                accountCreateDto.accountOrigin(),
                accountCreateDto.providerAccountName(),
                accountCreateDto.accountDisplayName(),
                accountCreateDto.accountNumberLast4(),
                accountCreateDto.institutionName(),
                accountCreateDto.institutionCode(),
                money
        );

        Account savedAccount = accountRepository.save(account);
        return accountResponseMapper.toAccountDetailsOutDto(savedAccount);
    }

    public AccountDetailsOutDto getAccountById(UUID userId, UUID accountId) {
        User user = userRepository.findByUserIdAndStatus(userId, UserStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + accountId));

        return accountResponseMapper.toAccountDetailsOutDto(account);
    }

    public List<AccountSummaryResponseDto> getAllAccountsByUserId(UUID userId) {
        User user = userRepository.findByUserIdAndStatus(userId, UserStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        List<Account> accountList = user.getFinancialAccounts();
        List<AccountSummaryResponseDto> accountDetailsOutDtoList = new ArrayList<>();
        for (Account account : accountList) {
            accountDetailsOutDtoList.add(accountResponseMapper.toAccountSummaryResponseDto(account));
        }
        return accountDetailsOutDtoList;
    }

    public AccountDetailsOutDto changeAccountNameById(UUID userId, UUID accountId, AccountRenameDto accountRenameDto) {
        User user = userRepository.findByUserIdAndStatus(userId, UserStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + accountId));

        accountPatchApplier.apply(accountRenameDto, account);

        Account savedAccount = accountRepository.save(account);
        return accountResponseMapper.toAccountDetailsOutDto(savedAccount);
    }

    public void deactiveAccount(UUID userId, UUID accountId) {
        User user = userRepository.findByUserIdAndStatus(userId, UserStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + accountId));

        account.deActive();
    }
}
