package com.finflow.finflowbackend.user.mapper;

import com.finflow.finflowbackend.user.User;
import com.finflow.finflowbackend.user.dto.LocalUserCreateDto;
import com.finflow.finflowbackend.user.dto.UserDetailsOutDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    //Entity -> DTO
    UserDetailsOutDto userToUserDetailsOutDto(User user);

    //DTO -> Entity
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "authMethod", ignore = true)
    @Mapping(target = "emailVerified", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "lastLoginAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    User toLocalUserEntity(LocalUserCreateDto localUserCreateDto);
}
