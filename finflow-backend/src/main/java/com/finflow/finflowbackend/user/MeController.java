/*
The New MeController is used to replace the old UserController
 */

package com.finflow.finflowbackend.user;

import com.finflow.finflowbackend.security.CurrentUserService;
import com.finflow.finflowbackend.user.dto.UserDetailsOutDto;
import com.finflow.finflowbackend.user.dto.UserPatchDto;
import com.finflow.finflowbackend.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/me")
public class MeController {

    private final CurrentUserService currentUserService;
    private final UserService userService;

    public MeController(CurrentUserService currentUserService, UserService userService) {
        this.currentUserService = currentUserService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<UserDetailsOutDto> getMe(Authentication authentication) {
        UUID userId = currentUserService.requireUserId(authentication);
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @PatchMapping
    public ResponseEntity<UserDetailsOutDto> patchMe(Authentication authentication, @RequestBody @Valid UserPatchDto userPatchDto) {
        UUID userId = currentUserService.requireUserId(authentication);
        return ResponseEntity.ok(userService.patchUser(userId, userPatchDto));
    }

    @DeleteMapping
    public ResponseEntity<Void> deactiveMe(Authentication authentication) {
        UUID userId = currentUserService.requireUserId(authentication);
        userService.deActiveUser(userId);
        return ResponseEntity.noContent().build();
    }
}
