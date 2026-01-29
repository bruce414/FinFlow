package com.finflow.finflowbackend.user.mapper;

import com.finflow.finflowbackend.user.User;
import com.finflow.finflowbackend.user.dto.UserPatchDto;
import org.springframework.stereotype.Component;

@Component
public class UserPatchApplier {
    public void apply(UserPatchDto userPatchDto, User user) {
        if (userPatchDto.firstName() != null) user.setFirstName(userPatchDto.firstName());
        if (userPatchDto.lastName() != null) user.setLastName(userPatchDto.lastName());
        if (userPatchDto.phoneNumber() != null) user.setPhoneNumber(userPatchDto.phoneNumber());
        if (userPatchDto.dateOfBirth() != null) user.setDateOfBirth(userPatchDto.dateOfBirth());
        if (userPatchDto.timeZone() != null) user.setTimeZone(userPatchDto.timeZone());
    }
}
