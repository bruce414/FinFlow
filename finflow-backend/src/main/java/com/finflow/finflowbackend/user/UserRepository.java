package com.finflow.finflowbackend.user;

import com.finflow.finflowbackend.common.enums.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    //Retrieve the user by userId and userStatus
    Optional<User> findByUserIdAndStatus(UUID userId, UserStatus status);

    //Retrieve all users
    List<User> findAllByStatus(UserStatus status);
}
