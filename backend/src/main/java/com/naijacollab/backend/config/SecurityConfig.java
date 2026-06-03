package com.naijacollab.backend.config;

import com.naijacollab.backend.security.JwtAuthenticationFilter;
import com.naijacollab.backend.security.RateLimitFilter;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Core security configuration for the NaijaCollab Spring Boot backend.
 * This class configures HTTP security (CSRF, CORS, CSP), defines the filter chain order,
 * sets up the stateless session policy for JWTs, and provides the password encoder bean.
 */
@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final RateLimitFilter rateLimitFilter;
    private final AppSecurityProperties securityProperties;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            RateLimitFilter rateLimitFilter,
            AppSecurityProperties securityProperties) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.rateLimitFilter = rateLimitFilter;
        this.securityProperties = securityProperties;
    }

    /**
     * Builds the main Security Filter Chain.
     * 
     * Security posture:
     * - CSRF is disabled because we use stateless JWTs (no JSESSIONID cookies).
     * - Sessions are fully stateless (SessionCreationPolicy.STATELESS).
     * - Strict CSP (Content Security Policy) headers are enforced to prevent XSS.
     * - Specific public endpoints (like /auth/login) are permitted, everything else requires auth.
     * - Custom filters (JWT and RateLimiting) are injected into the chain.
     */
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .headers(
                        headers ->
                                // CSP policy:
                                // - only same-origin scripts/connects by default
                                // - inline styles temporarily allowed for current frontend transition
                                // - embeds and object content blocked
                                headers.httpStrictTransportSecurity(
                                                hsts -> hsts.includeSubDomains(true).maxAgeInSeconds(31536000))
                                        .frameOptions(frame -> frame.deny())
                                        .contentSecurityPolicy(
                                                csp ->
                                                        csp.policyDirectives(
                                                                "default-src 'self'; "
                                                                        + "script-src 'self'; "
                                                                        + "style-src 'self' 'unsafe-inline'; "
                                                                        + "img-src 'self' data: https:; "
                                                                        + "connect-src 'self'; "
                                                                        + "object-src 'none'; "
                                                                        + "frame-ancestors 'none'; "
                                                                        + "base-uri 'self';"))
                                        .referrerPolicy(
                                                referrer ->
                                                        referrer.policy(
                                                                org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
                                        .contentTypeOptions(Customizer.withDefaults()))
                // Ensure no HTTP sessions are created; every request must be authenticated via the JWT in the header
                .sessionManagement(
                        configurer ->
                                configurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Define endpoint access rules
                .authorizeHttpRequests(
                        auth ->
                                auth.requestMatchers(
                                                "/actuator/health",
                                                "/actuator/health/**",
                                                "/actuator/info")
                                        .permitAll() // Public health checks
                                        .requestMatchers(
                                                "/api/v1/auth/register",
                                                "/api/v1/auth/login",
                                                "/api/v1/auth/refresh",
                                                "/api/v1/auth/logout")
                                        .permitAll() // Public auth endpoints
                                        .requestMatchers(HttpMethod.OPTIONS, "/**")
                                        .permitAll() // Allow pre-flight CORS requests
                                        .anyRequest()
                                        .authenticated()) // All other APIs require a valid JWT
                // Add the JWT Filter BEFORE the standard Spring authentication filter
                .addFilterBefore(
                        jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                // Add RateLimiting AFTER JWT parsing so we know *who* is making the request (for user-based limits)
                .addFilterAfter(rateLimitFilter, JwtAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Defines the hashing algorithm for passwords.
     * Argon2id is the current industry standard recommended for highly secure password hashing.
     */
    @Bean
    PasswordEncoder passwordEncoder() {
        return Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();
    }

    /**
     * Configures CORS (Cross-Origin Resource Sharing) globally.
     * This dictates which frontend origins (e.g., localhost:3000, naijacollab.com) are allowed to call these APIs.
     * Allowed origins are pulled from properties (application.yml).
     */
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(securityProperties.getCorsAllowedOrigins());
        configuration.setAllowedMethods(List.of("GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
