package com.finflow.finflowbackend.auth.service;

import com.finflow.finflowbackend.common.enums.AuthMethod;
import com.finflow.finflowbackend.user.User;
import com.finflow.finflowbackend.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class GoogleOAuth2UserService extends DefaultOAuth2UserService {

    public final UserRepository userRepository;

    public GoogleOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        if (email == null) {
            throw new OAuth2AuthenticationException(new OAuth2Error("invalid_user"), "Google account has no email");
        }
        email = email.toLowerCase();

        String givenName = oAuth2User.getAttribute("given_name");
        String familyName = oAuth2User.getAttribute("family_name");
        String name = oAuth2User.getAttribute("name");

        String firstName = (givenName != null) ? givenName : (name != null ? name.split(" ")[0] : "User");
        String lastName = (familyName != null) ? familyName : (name != null && name.split(" ").length > 1 ? name.split(" ")[1] : " ");

        User user = userRepository.findByEmail(email).orElse(null);

//        if (user == null) {
//            user = User.createGoogleOAuthUser(
//                firstName,
//                lastName,
//                AuthMethod.GOOGLE,
//                email
//            );
//            userRepository.save(user);
//        } else {
//            user.setEmailVerified(true);
//            if (user.getFirstName() == null || user.getFirstName().isBlank()) user.setFirstName(firstName);
//            if (user.getLastName() == null || user.getLastName().isBlank()) user.setLastName(lastName);
//        }

        return oAuth2User;
    }
}
