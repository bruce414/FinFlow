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

        //Complete the body to replace this
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
    }

    /*
     * Endpoint: Get user by id
     */
    @GetMapping("/{userId}")
    public ResponseEntity<UserDetailsOutDto> getUserById(@PathVariable @NotNull UUID userId) {

        //Complete the body to replace this
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
    }

    /*
     * Endpoint: Patch user by id
     */
    @PatchMapping("/{userId}")
    public ResponseEntity<UserDetailsOutDto> patchUserById(
            @PathVariable("userId") @NotNull UUID userId,
            @RequestBody @Valid UserPatchDto userPatchDto
    ) {

        //Complete the body to replace this
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
    }

    /*
     * Endpoint: Delete user by id
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUserById(@PathVariable @NotNull UUID userId) {

        //Complete the body to replace this
        return ResponseEntity.noContent().build();
    }
}
