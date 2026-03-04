package com.finflow.finflowbackend.auth.service;

import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

@Service
public class GoogleOidcUserService extends OidcUserService {

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        OidcUser oidcUser = super.loadUser(userRequest);

        if (oidcUser.getSubject() == null || oidcUser.getSubject().isBlank()) {
            throw new OAuth2AuthenticationException(new OAuth2Error("invalid_user"), "Google subject (sub) missing");
        }
        if (oidcUser.getEmail() == null || oidcUser.getEmail().isBlank()) {
            throw new OAuth2AuthenticationException(new OAuth2Error("invalid_user"), "Google email missing");
        }
        return oidcUser;
    }
}
