package com.naijacollab.backend.security;

import com.naijacollab.backend.config.AppSecurityProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;

/**
 * Service responsible for creating and validating JSON Web Tokens (JWT).
 * 
 * We use symmetric encryption (HMAC-SHA256) where the secret key is securely
 * injected from the environment properties. The tokens are stateless and self-contained,
 * meaning we don't need to hit the database to authenticate a request once a valid JWT is provided.
 */
@Service
public class JwtService {

    private final AppSecurityProperties securityProperties;
    private final SecretKey signingKey;

    public JwtService(AppSecurityProperties securityProperties) {
        this.securityProperties = securityProperties;
        this.signingKey =
                Keys.hmacShaKeyFor(
                        securityProperties.getJwtSecret().getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Issues a short-lived access token for a user.
     * 
     * @param userId The unique ID of the user (Subject)
     * @param email The user's email (stored as a claim)
     * @param username The user's username (stored as a claim)
     * @return A signed JWT string
     */
    public String issueAccessToken(UUID userId, String email, String username) {
        Instant now = Instant.now();
        Instant expiresAt = now.plus(securityProperties.getAccessTokenTtl());
        return Jwts.builder()
                .subject(userId.toString())
                .issuer(securityProperties.getIssuer())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiresAt))
                .claim("email", email)
                .claim("username", username)
                .signWith(signingKey)
                .compact();
    }

    /**
     * Parses and validates a JWT string.
     * 
     * Security checks performed automatically by JJWT:
     * - Signature verification (fails if token was tampered with).
     * - Expiration check (fails if current time > expiresAt).
     * - Issuer check (fails if the token wasn't issued by our trusted server).
     * 
     * @param token The raw JWT string from the Authorization header.
     * @return Optional containing the extracted principal data, or empty if invalid.
     */
    public Optional<AuthenticatedPrincipal> parseAccessToken(String token) {
        try {
            Claims claims =
                    Jwts.parser()
                            .verifyWith(signingKey)
                            .requireIssuer(securityProperties.getIssuer())
                            .build()
                            .parseSignedClaims(token)
                            .getPayload();

            UUID userId = UUID.fromString(claims.getSubject());
            String email = claims.get("email", String.class);
            String username = claims.get("username", String.class);
            return Optional.of(new AuthenticatedPrincipal(userId, email, username));
        } catch (Exception ex) {
            return Optional.empty();
        }
    }
}

