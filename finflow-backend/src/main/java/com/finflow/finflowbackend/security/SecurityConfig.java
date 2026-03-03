package com.finflow.finflowbackend.security;

import com.finflow.finflowbackend.auth.onboarding.handler.GoogleOAuth2SuccessHandler;
import com.finflow.finflowbackend.auth.service.GoogleOidcUserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            GoogleOidcUserService googleOidcUserService,
            GoogleOAuth2SuccessHandler googleOAuth2SuccessHandler
    ) throws Exception {

        http
                .cors(Customizer.withDefaults())

                // SPA-friendly CSRF: cookie readable by JS so frontend can echo it back via X-XSRF-TOKEN
                .csrf(csrf -> csrf
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                        // OAuth2 redirect endpoints are GET-based; they don't need CSRF checks.
                        // Being explicit avoids surprises.
                        .ignoringRequestMatchers(
                                "/oauth2/**",
                                "/login/oauth2/**"
                        )
                )

                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))

                .authorizeHttpRequests(auth -> auth
                        // swagger
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/v3/api-docs.yaml"
                        ).permitAll()

                        // auth endpoints
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/login").permitAll()

                        // logout is handled by Spring Security's LogoutFilter at this same URL
                        // Keep it authenticated (or permitAll if you want idempotent logout).
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/logout").authenticated()

                        // csrf token fetch endpoint
                        .requestMatchers(HttpMethod.GET, "/api/v1/auth/csrf").permitAll()

                        // oauth2 debug failure endpoint
                        .requestMatchers(HttpMethod.GET, "/api/v1/auth/oauth2-failure").permitAll()

                        // oauth2 endpoints (authorization start + callback)
                        .requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll()

                        // onboarding requires login
                        .requestMatchers("/api/v1/auth/onboarding/**").authenticated()

                        // error endpoint
                        .requestMatchers("/error").permitAll()

                        .anyRequest().authenticated()
                )

                // prevent misleading "invalid credentials" HTML login page
                .formLogin(f -> f.disable())
                .httpBasic(b -> b.disable())

                .oauth2Login(oauth -> oauth
                        .userInfoEndpoint(userInfo -> userInfo.oidcUserService(googleOidcUserService))
                        .successHandler(googleOAuth2SuccessHandler)
                        .failureHandler((req, res, ex) -> {
                            ex.printStackTrace();
                            res.sendRedirect("/api/v1/auth/oauth2-failure?error=" + ex.getClass().getSimpleName());
                        })
                )

                .oauth2Client(Customizer.withDefaults())

                .logout(logout -> logout
                        .logoutUrl("/api/v1/auth/logout")
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .deleteCookies("JSESSIONID", "XSRF-TOKEN")
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // DEV: allow any localhost port (covers 5173, 5734, etc.)
        // When you deploy, tighten this to your real frontend origin.
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:*",
                "http://127.0.0.1:*"
        ));

        config.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));

        // Allow common headers + XSRF headers used by SPA
        config.setAllowedHeaders(List.of(
                "Content-Type",
                "Accept",
                "Origin",
                "X-Requested-With",
                "Authorization",
                "X-XSRF-TOKEN",
                "X-CSRF-TOKEN"
        ));

        // Expose the CSRF header if you ever return it as a header (optional but useful)
        config.setExposedHeaders(List.of("X-CSRF-TOKEN"));

        // Important for session cookies
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
        return cfg.getAuthenticationManager();
    }
}