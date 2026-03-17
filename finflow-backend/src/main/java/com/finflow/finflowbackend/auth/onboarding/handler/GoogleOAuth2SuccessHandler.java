package com.finflow.finflowbackend.auth.onboarding.handler;

import com.finflow.finflowbackend.auth.onboarding.dto.PendingGoogleSignup;
import com.finflow.finflowbackend.common.enums.UserStatus;
import com.finflow.finflowbackend.user.User;
import com.finflow.finflowbackend.user.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class GoogleOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    public static final String PENDING_GOOGLE_SIGNUP = "PENDING_GOOGLE_SIGNUP";

    private final UserRepository userRepository;

    // Put these in application-local.yml so you don't hardcode ports
    private final String dashboardUrl;
    private final String completeProfileUrl;

    public GoogleOAuth2SuccessHandler(
            UserRepository userRepository,
            @Value("${app.frontend.dashboard-url:http://localhost:5173/dashboard}") String dashboardUrl,
            @Value("${app.frontend.complete-profile-url:http://localhost:5173/complete-profile}") String completeProfileUrl
    ) {
        this.userRepository = userRepository;
        this.dashboardUrl = dashboardUrl;
        this.completeProfileUrl = completeProfileUrl;
    }

    @Override
    @Transactional
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        if (!(authentication.getPrincipal() instanceof OidcUser oidcUser)) {
            throw new ServletException("Expected OIDC user principal for Google login");
        }

        String sub = oidcUser.getSubject();
        String email = oidcUser.getEmail();

        if (sub == null || sub.isBlank()) throw new ServletException("Google OIDC subject (sub) is missing");
        if (email == null || email.isBlank()) throw new ServletException("Google email is missing");

        String firstName = oidcUser.getGivenName();   // may be null
        String lastName = oidcUser.getFamilyName();   // may be null
        Boolean emailVerified = oidcUser.getEmailVerified(); // may be null

        // 1) If user already exists by google subject: route by onboarding completeness or reject deactivated
        User user = userRepository.findByGoogleSubject(sub).orElse(null);
        if (user != null) {
            if (user.getStatus() == UserStatus.DEACTIVATED) {
                if (request.getSession(false) != null) {
                    request.getSession(false).invalidate();
                }
                try {
                    String loginUrl = java.net.URI.create(dashboardUrl).resolve("/").toString() + "?error=deactivated";
                    response.sendRedirect(loginUrl);
                } catch (Exception ex) {
                    throw new ServletException("Invalid dashboard URL for redirect", ex);
                }
                return;
            }
            user.markLoginNow();

            boolean profileComplete = user.isProfileComplete();

            response.sendRedirect(profileComplete ? dashboardUrl : completeProfileUrl);
            return;
        }

        // 2) Optional policy: if email exists already (local signup), decide whether to link or block.
        // If you want auto-linking, do it here (careful with security).
        // For MVP, I’d recommend: if email exists, redirect to complete-profile and let user confirm linking.
        var existingByEmail = userRepository.findByEmail(email).orElse(null);
        if (existingByEmail != null) {
            // store pending info; your onboarding endpoint can decide to link accounts after explicit confirmation
            HttpSession session = request.getSession(true);
            session.setAttribute(PENDING_GOOGLE_SIGNUP, new PendingGoogleSignup(
                    sub, firstName, lastName, email, emailVerified
            ));
            response.sendRedirect(completeProfileUrl);
            return;
        }

        // 3) Brand-new user: store pending signup in session and redirect
        HttpSession session = request.getSession(true);
        session.setAttribute(PENDING_GOOGLE_SIGNUP, new PendingGoogleSignup(
                sub, firstName, lastName, email, emailVerified
        ));

        response.sendRedirect(completeProfileUrl);
    }
}