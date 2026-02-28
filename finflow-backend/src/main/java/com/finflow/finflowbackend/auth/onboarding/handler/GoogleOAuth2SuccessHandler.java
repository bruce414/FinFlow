package com.finflow.finflowbackend.auth.onboarding;

import com.finflow.finflowbackend.user.User;
import com.finflow.finflowbackend.user.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class GoogleOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    public static final String PENDING_GOOGLE_SIGNUP = "PENDING_GOOGLE_SIGNUP";

    private final UserRepository userRepository;

    //Dashboard link after users finish completing the onboarding process
    private final String dashboardUrl = "http://localhost:5734/dashboard";
    //complete profile link if users have not finished completing the onboarding process
    private final String completeProfileUrl = "http://localhost:5734/complete-profile";

    public GoogleOAuth2SuccessHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        if (!(authentication.getPrincipal() instanceof OidcUser oidcUser)) {
            throw new ServletException("Expected OIDC user principal for Google login");
        }

        String sub = oidcUser.getSubject();
        String firstName = oidcUser.getGivenName();
        String lastName = oidcUser.getFamilyName();
        String email = oidcUser.getEmail();
        Boolean emailVerified = oidcUser.getEmailVerified();

        if (sub == null || sub.isBlank()) throw new ServletException("Google OIDC subject (sub) is missing");
        if (email == null || email.isBlank()) throw new ServletException("Google email missing");

        User user = userRepository.findByGoogleSubject(sub).orElse(null);
        if (user != null) {
            user.markLoginNow();
            response.sendRedirect(dashboardUrl);
        }

        HttpSession session = request.getSession(true);
        session.setAttribute(PENDING_GOOGLE_SIGNUP, new PendingGoogleSignup(
                sub,
                firstName,
                lastName,
                email,
                emailVerified
        ));

        response.sendRedirect(completeProfileUrl);
    }

}
