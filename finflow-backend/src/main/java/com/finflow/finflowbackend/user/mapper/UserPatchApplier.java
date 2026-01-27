package com.finflow.finflowbackend.user.mapper;

import com.finflow.finflowbackend.user.User;
import com.finflow.finflowbackend.user.dto.UserPatchDto;
import org.springframework.stereotype.Component;

@Component
public class UserPatchApplier {
    public void apply(UserPatchDto userPatchDto, User user) {
        if (userPatchDto.firstName() != null) user.changeFirstName(userPatchDto.firstName());
        if (userPatchDto.lastName() != null) user.changeLastName(userPatchDto.lastName());
        if (userPatchDto.phoneNumber() != null) user.changePhoneNumber(userPatchDto.phoneNumber());
        if (userPatchDto.dateOfBirth() != null) user.changeDateOfBirth(userPatchDto.dateOfBirth());
        if (userPatchDto.timeZone() != null) user.changeTimeZone(userPatchDto.timeZone());
    }
}
