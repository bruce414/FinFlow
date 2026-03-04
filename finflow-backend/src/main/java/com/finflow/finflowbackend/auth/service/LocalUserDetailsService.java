package com.finflow.finflowbackend.auth.service;

import com.finflow.finflowbackend.user.User;
import com.finflow.finflowbackend.user.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocalUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public LocalUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(userName.toLowerCase())
            .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + userName));

        if (user.getPasswordHash() == null) {
            throw new UsernameNotFoundException("User has no password");
        }

        return new org.springframework.security.core.userdetails.User(
            user.getEmail(),
            user.getPasswordHash(),
            true, true, true, true,
            List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }
}
