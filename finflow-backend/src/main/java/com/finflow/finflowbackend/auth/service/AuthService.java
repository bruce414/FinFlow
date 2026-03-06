package com.finflow.finflowbackend.auth.service;

import com.finflow.finflowbackend.auth.dto.RegisterRequest;
import com.finflow.finflowbackend.common.enums.AuthMethod;
import com.finflow.finflowbackend.user.User;
import com.finflow.finflowbackend.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void register(RegisterRequest registerRequest) {
        String email = registerRequest.email().toLowerCase().trim();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists");
        }

        if (registerRequest.password() == null || registerRequest.password().length() < 8) {
            throw new IllegalArgumentException("Password has to be at least 8 characters");
        }

        String passwordHash = passwordEncoder.encode(registerRequest.password());

        User user = User.createLocalUser(
            registerRequest.firstName().trim(),
            registerRequest.lastName().trim(),
            AuthMethod.LOCAL,
            email,
            registerRequest.phoneNumber(),
            passwordHash,
            registerRequest.dateOfBirth(),
            registerRequest.timeZone(),
            registerRequest.baseCurrencyCode()
        );
        userRepository.save(user);
    }
}
