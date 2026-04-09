package com.finflow.finflowbackend.notification;

import com.finflow.finflowbackend.notification.dto.NotificationOutDto;
import com.finflow.finflowbackend.security.CurrentUserService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/me/notifications")
public class UserNotificationController {

    private final CurrentUserService currentUserService;
    private final UserNotificationService userNotificationService;

    public UserNotificationController(CurrentUserService currentUserService, UserNotificationService userNotificationService) {
        this.currentUserService = currentUserService;
        this.userNotificationService = userNotificationService;
    }

    @GetMapping
    public ResponseEntity<List<NotificationOutDto>> list(Authentication authentication) {
        UUID userId = currentUserService.requireUserId(authentication);
        userNotificationService.syncBudgetExceededNotifications(userId);
        return ResponseEntity.ok(userNotificationService.listForUser(userId));
    }

    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<Void> markRead(
            @Parameter(in = ParameterIn.HEADER, name = "X-XSRF-TOKEN", required = true,
                    description = "CSRF token from GET /api/v1/auth/csrf (token field)")
            @RequestHeader("X-XSRF-TOKEN") String csrfToken,
            Authentication authentication,
            @PathVariable UUID notificationId) {
        UUID userId = currentUserService.requireUserId(authentication);
        userNotificationService.markRead(userId, notificationId);
        return ResponseEntity.noContent().build();
    }
}
