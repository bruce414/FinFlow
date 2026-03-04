package com.finflow.finflowbackend.auth.onboarding.controller;

import com.finflow.finflowbackend.auth.onboarding.handler.GoogleOAuth2SuccessHandler;
import com.finflow.finflowbackend.auth.onboarding.dto.PendingGoogleSignup;
import com.finflow.finflowbackend.auth.onboarding.dto.CompleteAdditionalGoogleProfileRequest;
import com.finflow.finflowbackend.auth.onboarding.dto.OnboardingStatus;
import com.finflow.finflowbackend.user.User;
import com.finflow.finflowbackend.user.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth/onboarding")
public class OnboardingController {

    private final UserRepository userRepository;

    public OnboardingController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/status")
    public OnboardingStatus status(HttpSession session, Authentication authentication) {
        PendingGoogleSignup pendingGoogleSignup = (PendingGoogleSignup) session.getAttribute(GoogleOAuth2SuccessHandler.PENDING_GOOGLE_SIGNUP);
        boolean authenticated = authentication != null && authentication.isAuthenticated();
        return new OnboardingStatus(authenticated, pendingGoogleSignup != null);
    }

    //Testing only
//    @GetMapping("/complete-profile")
//    public Map<String, Object> completeProfile(Authentication auth) {
//        return Map.of(
//                "isAuthenticated", auth != null && auth.isAuthenticated(),
//                "principalType", auth == null ? null : auth.getPrincipal().getClass().getName(),
//                "name", auth == null ? null : auth.getName(),
//                "authorities", auth == null ? null : auth.getAuthorities()
//        );
//    }

    @PostMapping("/complete-profile")
    @ResponseStatus(HttpStatus.CREATED)
    public void completeProfile(@RequestBody CompleteAdditionalGoogleProfileRequest request, HttpSession session, Authentication authentication) {
        if (!(authentication != null && authentication.getPrincipal() instanceof OidcUser oidcUser)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated with Google");
        }

        PendingGoogleSignup pendingGoogleSignup = (PendingGoogleSignup) session.getAttribute(GoogleOAuth2SuccessHandler.PENDING_GOOGLE_SIGNUP);
        if (pendingGoogleSignup == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No pending Google signup in session");
        }

        if (!pendingGoogleSignup.googleSubject().equals(oidcUser.getSubject())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google identity mismatch");
        }

        //Ensure no duplicate exists
        if (userRepository.findByGoogleSubject(pendingGoogleSignup.googleSubject()).isPresent()) {
            session.removeAttribute(GoogleOAuth2SuccessHandler.PENDING_GOOGLE_SIGNUP);
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Account already exists");
        }
        if (userRepository.findByEmail(pendingGoogleSignup.email()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        String firstName = (pendingGoogleSignup.firstName() != null && !pendingGoogleSignup.firstName().isBlank()) ? pendingGoogleSignup.firstName() : "User";
        String lastName = (pendingGoogleSignup.lastName() != null && !pendingGoogleSignup.lastName().isBlank()) ? pendingGoogleSignup.lastName() : " ";

        User user = User.createGoogleOAuthUser(
                firstName,
                lastName,
                pendingGoogleSignup.email(),
                pendingGoogleSignup.emailVerified(),
                pendingGoogleSignup.googleSubject(),
                request.dateOfBirth(),
                request.timeZone(),
                true
        );
        userRepository.save(user);

        session.removeAttribute(GoogleOAuth2SuccessHandler.PENDING_GOOGLE_SIGNUP);
    }
}
