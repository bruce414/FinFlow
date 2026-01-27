package com.finflow.finflowbackend.user.mapper;

import com.finflow.finflowbackend.user.User;
import com.finflow.finflowbackend.user.dto.LocalUserCreateDto;
import com.finflow.finflowbackend.user.dto.UserDetailsOutDto;
import com.finflow.finflowbackend.user.dto.UserPatchDto;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserResponseMapper {

    //Entity -> DTO
    UserDetailsOutDto userToUserDetailsOutDto(User user);
}
