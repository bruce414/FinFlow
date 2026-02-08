package com.finflow.finflowbackend.account;

import com.finflow.finflowbackend.account.dto.AccountCreateDto;
import com.finflow.finflowbackend.account.dto.AccountDetailsOutDto;
import com.finflow.finflowbackend.account.dto.AccountRenameDto;
import com.finflow.finflowbackend.account.dto.AccountSummaryResponseDto;
import com.finflow.finflowbackend.account.service.AccountService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/users/{userId}/accounts")
@Validated
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    /*
     * Endpoint: Create an account object
     */
    @PostMapping
    public ResponseEntity<AccountDetailsOutDto> createAccount(
            @PathVariable @NotNull UUID userId,
            @RequestBody @Valid AccountCreateDto accountCreateDto) {

        //Complete the body to replace this
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
    }

    /*
     * Endpoint: Get the account by id
     */
    @GetMapping("/{accountId}")
    public ResponseEntity<AccountDetailsOutDto> getAccountById(
            @PathVariable @NotNull UUID userId,
            @PathVariable @NotNull UUID accountId) {

        //Complete the body to replace this
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
    }

    /*
     * Endpoint: List all account by userId
     */
    @GetMapping
    public ResponseEntity<List<AccountSummaryResponseDto>> getAllAccountsByUserId(@RequestParam @NotNull UUID userId) {

        //Complete the body to replace this
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
    }

    /*
     * Endpoint: Patch the account by id
     */
    @PatchMapping("/{accountId}")
    public ResponseEntity<AccountDetailsOutDto> changeAccountNameById(
            @PathVariable @NotNull UUID userId,
            @PathVariable @NotNull UUID accountId,
            @RequestBody @Valid AccountRenameDto accountRenameDto
    ) {

        //Complete the body to replace this
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
    }

    /*
     * Endpoint: Delete the account by id
     */
    @DeleteMapping("/{accountId}")
    public ResponseEntity<Void> deleteAccountById(
            @PathVariable UUID userId,
            @PathVariable UUID accountId) {

        //Complete the body to replace this
        return ResponseEntity.noContent().build();
    }
}
