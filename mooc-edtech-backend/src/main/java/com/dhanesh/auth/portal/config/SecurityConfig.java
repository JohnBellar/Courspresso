package com.dhanesh.auth.portal.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.dhanesh.auth.portal.security.jwt.JwtAuthenticationFilter;
import org.springframework.security.authentication.AuthenticationProvider;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider authenticationProvider;

    /**
     * Defines the security filter chain for the application.
     * Handles CORS, CSRF, session management, authorization rules,
     * and JWT filter integration.
     */
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Enable default CORS settings (will use CorsConfigurationSource bean)
            .cors(Customizer.withDefaults())

            // Disable CSRF since the app uses stateless JWT-based auth
            .csrf(csrf -> csrf.disable())

            // No session will be created or used by Spring Security
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Authorization rules for different endpoint access
            .authorizeHttpRequests(auth -> auth
                // 🔐 Allow preflight requests for CORS (this fixes your main issue)
                .requestMatchers(HttpMethod.OPTIONS, "/").permitAll()

                // Publicly accessible endpoints
                .requestMatchers(
                    "/",
                    "/api/auth/signup",
                    "/api/auth/signin",
                    "/api/auth/request-otp",
                    "/api/auth/verify-otp",
                    "/api/auth/forgot-password",
                    "/api/auth/reset-password",
                    "/users/all" 
                ).permitAll()

                // Admin-only endpoints
                .requestMatchers("/admin/").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/courses").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/courses/").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/courses/").hasRole("ADMIN")

                // All other endpoints require authentication
                .anyRequest().authenticated()
            )

            // Attach custom authentication provider
            .authenticationProvider(authenticationProvider)

            // Add custom JWT filter before the default UsernamePasswordAuthenticationFilter
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
