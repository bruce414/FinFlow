package com.finflow.finflowbackend.account;

import com.finflow.finflowbackend.account.dto.AccountCreateDto;
import com.finflow.finflowbackend.account.dto.AccountDetailsOutDto;
import com.finflow.finflowbackend.account.dto.AccountRenameDto;
import com.finflow.finflowbackend.account.dto.AccountSummaryResponseDto;
import com.finflow.finflowbackend.account.service.AccountService;
import com.finflow.finflowbackend.security.CurrentUserService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/me/accounts")
@Validated
public class AccountController {

    private final CurrentUserService currentUserService;
    private final AccountService accountService;

    public AccountController(CurrentUserService currentUserService, AccountService accountService) {
        this.currentUserService = currentUserService;
        this.accountService = accountService;
    }

    /*
     * Endpoint: Create an account object
     */
    @PostMapping
    public ResponseEntity<AccountDetailsOutDto> createAccount(
            @Parameter(in = ParameterIn.HEADER, name = "X-XSRF-TOKEN", required = true,
                    description = "CSRF token from GET /api/v1/auth/csrf (token field)")
            @RequestHeader("X-XSRF-TOKEN") String csrfToken,
            Authentication authentication,
            @RequestBody @Valid AccountCreateDto accountCreateDto) {

        UUID userId = currentUserService.requireUserId(authentication);
        AccountDetailsOutDto createdAccount = accountService.createAccount(userId, accountCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAccount);
    }

    /*
     * Endpoint: List all active accounts by userId
     */
    @GetMapping
    public ResponseEntity<List<AccountSummaryResponseDto>> getAllAccountsByUserId(Authentication authentication) {

        UUID userId = currentUserService.requireUserId(authentication);
        return ResponseEntity.ok(accountService.getAllAccountsByUserId(userId));
    }

    /*
     * Endpoint: List archived (deactivated) accounts by userId. Must be declared before /{accountId}.
     */
    @GetMapping("/archived")
    public ResponseEntity<List<AccountSummaryResponseDto>> getArchivedAccounts(Authentication authentication) {

        UUID userId = currentUserService.requireUserId(authentication);
        return ResponseEntity.ok(accountService.getArchivedAccountsByUserId(userId));
    }

    /*
     * Endpoint: Get the account by id
     */
    @GetMapping("/{accountId}")
    public ResponseEntity<AccountDetailsOutDto> getAccountById(
            Authentication authentication,
            @PathVariable @NotNull UUID accountId) {

        UUID userId = currentUserService.requireUserId(authentication);
        return ResponseEntity.ok(accountService.getAccountById(userId, accountId));
    }

    /*
     * Endpoint: Patch the account by id
     */
    @PatchMapping("/{accountId}")
    public ResponseEntity<AccountDetailsOutDto> changeAccountNameById(
            Authentication authentication,
            @PathVariable @NotNull UUID accountId,
            @RequestBody @Valid AccountRenameDto accountRenameDto
    ) {
        UUID userId = currentUserService.requireUserId(authentication);
        return ResponseEntity.ok(accountService.changeAccountNameById(userId, accountId, accountRenameDto));
    }

    /*
     * Endpoint: Delete the account by id
     */
    @DeleteMapping("/{accountId}")
    public ResponseEntity<Void> deleteAccountById(
            Authentication authentication,
            @PathVariable UUID accountId) {

        UUID userId = currentUserService.requireUserId(authentication);
        accountService.deactiveAccount(userId, accountId);
        return ResponseEntity.noContent().build();
    }
}
