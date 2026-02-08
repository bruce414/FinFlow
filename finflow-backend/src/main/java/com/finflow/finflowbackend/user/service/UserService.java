package com.finflow.finflowbackend.user.service;

import com.finflow.finflowbackend.user.UserRepository;
import com.finflow.finflowbackend.user.mapper.UserResponseMapper;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final UserResponseMapper userResponseMapper;

    public UserService(UserRepository userRepository, UserResponseMapper userResponseMapper) {
        this.userRepository = userRepository;
        this.userResponseMapper = userResponseMapper;
    }
}
