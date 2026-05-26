package com.naijacollab.backend.service;

import com.naijacollab.backend.config.AppSecurityProperties;
import com.naijacollab.backend.domain.DeviceSessionEntity;
import com.naijacollab.backend.domain.ProfileEntity;
import com.naijacollab.backend.domain.RefreshTokenEntity;
import com.naijacollab.backend.domain.UserEntity;
import com.naijacollab.backend.domain.UserStatus;
import com.naijacollab.backend.dto.auth.AuthResponse;
import com.naijacollab.backend.dto.auth.AuthUserDto;
import com.naijacollab.backend.dto.auth.LoginRequest;
import com.naijacollab.backend.dto.auth.RegisterRequest;
import com.naijacollab.backend.repository.DeviceSessionRepository;
import com.naijacollab.backend.repository.ProfileRepository;
import com.naijacollab.backend.repository.RefreshTokenRepository;
import com.naijacollab.backend.repository.UserRepository;
import com.naijacollab.backend.security.JwtService;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final DeviceSessionRepository deviceSessionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AppSecurityProperties securityProperties;
    private final AuditLogService auditLogService;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(
            UserRepository userRepository,
            ProfileRepository profileRepository,
            RefreshTokenRepository refreshTokenRepository,
            DeviceSessionRepository deviceSessionRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AppSecurityProperties securityProperties,
            AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.deviceSessionRepository = deviceSessionRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.securityProperties = securityProperties;
        this.auditLogService = auditLogService;
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public AuthResponse register(RegisterRequest request, ClientContext clientContext) {
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
        if (userRepository.existsByUsernameIgnoreCase(request.username())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }

        UserEntity user = new UserEntity();
        user.setId(UUID.randomUUID());
        user.setEmail(request.email().trim().toLowerCase());
        user.setUsername(request.username().trim());
        user.setDisplayName(request.displayName().trim());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        userRepository.save(user);

        ProfileEntity profile = new ProfileEntity();
        profile.setUser(user);
        profile.setOnboardingCompleted(false);
        profileRepository.save(profile);
        auditLogService.logEvent(user.getId(), "AUTH_REGISTER", "USER", user.getId().toString());

        return issueSession(user, clientContext, null);
    }

    @Transactional
    public AuthResponse login(LoginRequest request, ClientContext clientContext) {
        UserEntity user =
                userRepository
                        .findByEmailIgnoreCase(request.email().trim())
                        .orElseThrow(
                                () -> {
                                    auditLogService.logEvent(
                                            null,
                                            "AUTH_LOGIN_FAILED",
                                            "USER_EMAIL",
                                            request.email().trim().toLowerCase());
                                    return new ResponseStatusException(
                                            HttpStatus.UNAUTHORIZED, "Invalid credentials");
                                });

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            auditLogService.logEvent(
                    user.getId(), "AUTH_LOGIN_FAILED", "USER", user.getId().toString());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
        if (user.getStatus() != UserStatus.ACTIVE || user.isDeleted()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account is not active");
        }
        auditLogService.logEvent(user.getId(), "AUTH_LOGIN", "USER", user.getId().toString());

        return issueSession(user, clientContext, null);
    }

    @Transactional
    public AuthResponse refresh(String refreshTokenRaw, ClientContext clientContext) {
        RefreshTokenEntity existingToken =
                refreshTokenRepository
                        .findByTokenHash(hashToken(refreshTokenRaw))
                        .orElseThrow(
                                () ->
                                        new ResponseStatusException(
                                                HttpStatus.UNAUTHORIZED, "Invalid refresh token"));

        Instant now = Instant.now();
        if (existingToken.getRevokedAt() != null || existingToken.getExpiresAt().isBefore(now)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token expired");
        }

        DeviceSessionEntity existingSession =
                deviceSessionRepository
                        .findByRefreshTokenIdAndRevokedAtIsNull(existingToken.getId())
                        .orElse(null);

        existingToken.setRevokedAt(now);
        refreshTokenRepository.save(existingToken);
        auditLogService.logEvent(
                existingToken.getUser().getId(),
                "AUTH_REFRESH",
                "REFRESH_TOKEN",
                existingToken.getId().toString());

        return issueSession(existingToken.getUser(), clientContext, existingSession);
    }

    @Transactional
    public void logout(String refreshTokenRaw) {
        if (refreshTokenRaw == null || refreshTokenRaw.isBlank()) {
            return;
        }
        refreshTokenRepository
                .findByTokenHash(hashToken(refreshTokenRaw))
                .ifPresent(
                        token -> {
                            Instant now = Instant.now();
                            token.setRevokedAt(now);
                            refreshTokenRepository.save(token);
                            auditLogService.logEvent(
                                    token.getUser().getId(),
                                    "AUTH_LOGOUT",
                                    "REFRESH_TOKEN",
                                    token.getId().toString());
                            deviceSessionRepository
                                    .findByRefreshTokenIdAndRevokedAtIsNull(token.getId())
                                    .ifPresent(
                                            session -> {
                                                session.setRevokedAt(now);
                                                session.setLastSeenAt(now);
                                                deviceSessionRepository.save(session);
                                            });
                        });
    }

    @Transactional
    public void logoutAll(UUID userId) {
        Instant now = Instant.now();
        List<RefreshTokenEntity> activeTokens =
                refreshTokenRepository.findByUser_IdAndRevokedAtIsNullAndExpiresAtAfter(userId, now);
        for (RefreshTokenEntity token : activeTokens) {
            token.setRevokedAt(now);
        }
        refreshTokenRepository.saveAll(activeTokens);

        List<DeviceSessionEntity> activeSessions =
                deviceSessionRepository.findByUserIdAndRevokedAtIsNull(userId);
        for (DeviceSessionEntity session : activeSessions) {
            session.setRevokedAt(now);
            session.setLastSeenAt(now);
        }
        deviceSessionRepository.saveAll(activeSessions);
        auditLogService.logEvent(userId, "AUTH_LOGOUT_ALL", "USER", userId.toString());
    }

    private AuthResponse issueSession(
            UserEntity user, ClientContext clientContext, DeviceSessionEntity existingSession) {
        String accessToken = jwtService.issueAccessToken(user.getId(), user.getEmail(), user.getUsername());

        Instant now = Instant.now();
        String refreshTokenRaw = generateRefreshToken();
        RefreshTokenEntity refreshToken = new RefreshTokenEntity();
        refreshToken.setId(UUID.randomUUID());
        refreshToken.setUser(user);
        refreshToken.setTokenHash(hashToken(refreshTokenRaw));
        refreshToken.setExpiresAt(now.plus(securityProperties.getRefreshTokenTtl()));
        refreshTokenRepository.save(refreshToken);
        upsertDeviceSession(user.getId(), refreshToken.getId(), clientContext, existingSession, now);

        AuthUserDto userDto =
                new AuthUserDto(user.getId(), user.getEmail(), user.getUsername(), user.getDisplayName());

        return new AuthResponse(
                userDto,
                accessToken,
                refreshTokenRaw,
                securityProperties.getAccessTokenTtl().toSeconds());
    }

    private void upsertDeviceSession(
            UUID userId,
            UUID refreshTokenId,
            ClientContext context,
            DeviceSessionEntity existingSession,
            Instant now) {
        DeviceSessionEntity session = existingSession == null ? new DeviceSessionEntity() : existingSession;
        if (session.getId() == null) {
            session.setId(UUID.randomUUID());
            session.setUserId(userId);
            session.setCreatedAt(now);
        }
        session.setRefreshTokenId(refreshTokenId);
        session.setDeviceFingerprint(trimToNull(context.deviceFingerprint()));
        session.setUserAgent(trimToNull(context.userAgent()));
        session.setIpHash(hashNullable(context.ipAddress()));
        session.setCountryCode(toCountryCode(context.countryCode()));
        session.setCity(trimToNull(context.city()));
        session.setLastSeenAt(now);
        session.setRevokedAt(null);
        deviceSessionRepository.save(session);
    }

    private String generateRefreshToken() {
        byte[] bytes = new byte[48];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hashToken(String token) {
        return hashRawString(token);
    }

    private String hashNullable(String rawValue) {
        if (rawValue == null || rawValue.isBlank()) {
            return null;
        }
        return hashRawString(rawValue);
    }

    private String hashRawString(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to hash token", ex);
        }
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String toCountryCode(String value) {
        String trimmed = trimToNull(value);
        if (trimmed == null) {
            return null;
        }
        String normalized = trimmed.toUpperCase();
        return normalized.length() == 2 ? normalized : null;
    }
}
