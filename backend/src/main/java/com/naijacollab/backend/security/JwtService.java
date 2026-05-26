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

