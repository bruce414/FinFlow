package com.finflow.finflowbackend.user;

import com.finflow.finflowbackend.user.dto.LocalUserCreateDto;
import com.finflow.finflowbackend.user.dto.UserDetailsOutDto;
import com.finflow.finflowbackend.user.dto.UserPatchDto;
import com.finflow.finflowbackend.user.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("api/v1/users")
@Validated
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /*
     * Endpoint: Create a user object
     */
    @PostMapping
    public ResponseEntity<UserDetailsOutDto> createLocalUser(@RequestBody @Valid LocalUserCreateDto localUserCreateDto) {
        UserDetailsOutDto createdUser = userService.createLocalUser(localUserCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    /*
     * Endpoint: Get user by id
     */
    @GetMapping("/{userId}")
    public ResponseEntity<UserDetailsOutDto> getUserById(@PathVariable @NotNull UUID userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    /*
     * Endpoint: Patch user by id
     */
    @PatchMapping("/{userId}")
    public ResponseEntity<UserDetailsOutDto> patchUserById(
            @PathVariable("userId") @NotNull UUID userId,
            @RequestBody @Valid UserPatchDto userPatchDto
    ) {
        return ResponseEntity.ok(userService.patchUser(userId, userPatchDto));
    }

    /*
     * Endpoint: Delete user by id
     */

    //In Fintech system, soft delete is always chosen over hard delete.
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deActiveUserById(@PathVariable @NotNull UUID userId) {
        userService.deActiveUser(userId);
        return ResponseEntity.noContent().build();
    }
}
