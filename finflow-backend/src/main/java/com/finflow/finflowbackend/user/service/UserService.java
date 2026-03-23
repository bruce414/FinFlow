package com.finflow.finflowbackend.user.service;

import com.finflow.finflowbackend.common.enums.UserStatus;
import com.finflow.finflowbackend.exception.ResourceNotFoundException;
import com.finflow.finflowbackend.user.User;
import com.finflow.finflowbackend.user.UserRepository;
import com.finflow.finflowbackend.user.dto.UserDetailsOutDto;
import com.finflow.finflowbackend.user.dto.UserPatchDto;
import com.finflow.finflowbackend.user.mapper.UserPatchApplier;
import com.finflow.finflowbackend.user.mapper.UserResponseMapper;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final UserResponseMapper userResponseMapper;
    private final UserPatchApplier userPatchApplier;

    public UserService(UserRepository userRepository, UserResponseMapper userResponseMapper, UserPatchApplier userPatchApplier) {
        this.userRepository = userRepository;
        this.userResponseMapper = userResponseMapper;
        this.userPatchApplier = userPatchApplier;
    }

    //This method has been deprecated
//    public UserDetailsOutDto createLocalUser(LocalUserCreateDto localUserCreateDto) {
//        User user = User.createLocalUser(
//                localUserCreateDto.firstName(),
//                localUserCreateDto.lastName(),
//                AuthMethod.LOCAL,
//                localUserCreateDto.email(),
//                localUserCreateDto.phoneNumber(),
//                localUserCreateDto.password(),
//                localUserCreateDto.dateOfBirth(),
//                localUserCreateDto.timeZone()
//        );
//
//        User savedUser = userRepository.save(user);
//        return userResponseMapper.userToUserDetailsOutDto(savedUser);
//    }

    public UserDetailsOutDto getUserById(UUID userId) {
        User user =  userRepository.findByUserIdAndStatus(userId, UserStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return userResponseMapper.userToUserDetailsOutDto(user);
    }

    public List<UserDetailsOutDto> getAllUsers() {
        List<User> users = userRepository.findAllByStatus(UserStatus.ACTIVE);
        List<UserDetailsOutDto> userDetailsOutDtoList = new ArrayList<>();
        for (User user : users) {
            userDetailsOutDtoList.add(userResponseMapper.userToUserDetailsOutDto(user));
        }
        return userDetailsOutDtoList;
    }

    public UserDetailsOutDto patchUser(UUID userId, UserPatchDto userPatchDto) {
        User user = userRepository.findByUserIdAndStatus(userId, UserStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        userPatchApplier.apply(userPatchDto, user);

        User savedUser = userRepository.save(user);
        return userResponseMapper.userToUserDetailsOutDto(savedUser);
    }

    public void deActiveUser(UUID userId) {
        User user = userRepository.findByUserIdAndStatus(userId,  UserStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (user.getStatus() == UserStatus.DEACTIVATED) {
            //nothing will break, and nothing will happen
            return;
        }

        user.setStatus(UserStatus.DEACTIVATED);
        user.setDeactivatedAt(Instant.now());
    }
}
