package com.finflow.finflowbackend.auth.controller;

import com.finflow.finflowbackend.auth.dtos.LoginRequest;
import com.finflow.finflowbackend.auth.dtos.MeResponse;
import com.finflow.finflowbackend.auth.dtos.RegisterRequest;
import com.finflow.finflowbackend.auth.service.AuthService;
import com.finflow.finflowbackend.user.User;
import com.finflow.finflowbackend.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, AuthenticationManager authenticationManager, UserRepository userRepository) {
        this.authService = authService;
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
    }

    //LOCAL ONLY
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@RequestBody RegisterRequest registerRequest) {
        try {
            authService.register(registerRequest);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
    }

    //LOCAL ONLY
    @PostMapping("/login")
    public void login(@RequestBody LoginRequest loginRequest, HttpServletRequest req) {
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(loginRequest.email().toLowerCase().trim(), loginRequest.password());

        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(token);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, ex.getMessage());
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);

        HttpSession session = req.getSession(true);
        session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
    }

    @PostMapping("/logout")
    public void logout(HttpServletRequest req) {
        SecurityContextHolder.clearContext();
        HttpSession session = req.getSession(false);
        if (session != null) session.invalidate();
    }

    @GetMapping("/me")
    public MeResponse me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }

        String email = authentication.getName().toLowerCase();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated"));

        return new MeResponse(
            user.getUserId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getPasswordHash()
        );
    }

    @GetMapping("/csrf")
    public CsrfToken csrf(CsrfToken token) {
        return token;
    }
}
