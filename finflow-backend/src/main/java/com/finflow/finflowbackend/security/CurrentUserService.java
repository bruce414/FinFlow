package com.finflow.finflowbackend.security;

import com.finflow.finflowbackend.user.User;
import com.finflow.finflowbackend.user.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.UUID;

@Service
public class CurrentUserService {

    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UUID requireUserId(Authentication auth) throws AccessDeniedException {
        if (auth == null || !auth.isAuthenticated()) {
            throw new AccessDeniedException("Not authenticated");
        }

        Object principal = auth.getPrincipal();

        // Google OIDC session
        if (principal instanceof OidcUser oidc) {
            String sub = oidc.getSubject();
            User user = userRepository.findByGoogleSubject(sub)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found for google sub"));
            return user.getUserId();
        }

        // Local login session (if you use UserDetails)
        if (principal instanceof UserDetails ud) {
            User user = userRepository.findByEmail(ud.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found for email"));
            return user.getUserId();
        }

        throw new AccessDeniedException("Unsupported principal type: " + principal.getClass().getName());
    }
}
