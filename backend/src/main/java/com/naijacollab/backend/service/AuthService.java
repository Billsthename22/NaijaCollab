package com.naijacollab.backend.service;

import com.naijacollab.backend.config.AppSecurityProperties;
import com.naijacollab.backend.domain.DeviceSessionEntity;
import com.naijacollab.backend.domain.ProfileEntity;
import com.naijacollab.backend.domain.RefreshTokenEntity;
import com.naijacollab.backend.domain.UserEntity;
import com.naijacollab.backend.domain.UserStatus;
import com.naijacollab.backend.dto.auth.AuthResponse;
import com.naijacollab.backend.dto.auth.AuthUserDto;
import com.naijacollab.backend.dto.auth.ForgotPasswordRequest;
import com.naijacollab.backend.dto.auth.LoginRequest;
import com.naijacollab.backend.dto.auth.RegisterRequest;
import com.naijacollab.backend.dto.auth.ResetPasswordRequest;
import com.naijacollab.backend.domain.PasswordResetTokenEntity;
import com.naijacollab.backend.repository.DeviceSessionRepository;
import com.naijacollab.backend.repository.PasswordResetTokenRepository;
import com.naijacollab.backend.repository.ProfileRepository;
import com.naijacollab.backend.repository.RefreshTokenRepository;
import com.naijacollab.backend.repository.UserRepository;
import com.naijacollab.backend.security.JwtService;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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

/**
 * Handles core user authentication workflows including registration, login, token refresh, and logout operations.
 * 
 * Key Responsibilities:
 * - Issues and rotates JWT access and refresh tokens.
 * - Tracks user device sessions (IP, User Agent) for security monitoring.
 * - Enforces account status checks and password validation using Argon2id.
 * - Writes to the AuditLog for all critical security events (login success/fail, registration, logout).
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final DeviceSessionRepository deviceSessionRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
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
            PasswordResetTokenRepository passwordResetTokenRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AppSecurityProperties securityProperties,
            AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.deviceSessionRepository = deviceSessionRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.securityProperties = securityProperties;
        this.auditLogService = auditLogService;
    }

    /**
     * Registers a new user on the platform.
     * 
     * Process:
     * 1. Checks for duplicate email or username.
     * 2. Hashes the password via Argon2id.
     * 3. Creates the base UserEntity and an initial empty ProfileEntity.
     * 4. Logs the registration event and issues the first session tokens.
     */
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

    /**
     * Authenticates a user based on their email and password.
     * 
     * Process:
     * 1. Retrieves user by normalized email.
     * 2. Validates password against the stored Argon2 hash.
     * 3. Checks if the account is ACTIVE and not soft-deleted.
     * 4. Logs the login attempt (success or failure).
     * 5. Issues new JWTs and tracks the device session.
     */
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

    /**
     * Rotates a refresh token to generate a new pair of Access and Refresh tokens.
     * 
     * Security mechanism (Refresh Token Rotation):
     * - The provided refresh token is hashed and looked up in the database.
     * - If it is expired or already revoked (e.g., token reuse attack), access is denied.
     * - If valid, the old token is revoked immediately, and a new session is issued tying to the existing device context.
     */
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

    /**
     * Logs out a specific device session by revoking its refresh token.
     * - Finds the hashed token in the database.
     * - Marks it and its associated device session as revoked (soft-delete style).
     */
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

    /**
     * "Panic button" logout. Invalidates ALL active refresh tokens and device sessions for a user.
     * Used when an account is suspected to be compromised or during password resets.
     */
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

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        UserEntity user = userRepository.findByEmailIgnoreCase(request.email().trim()).orElse(null);
        if (user == null || user.isDeleted() || user.getStatus() != UserStatus.ACTIVE) {
            // Silently return to prevent email enumeration
            return;
        }

        String rawToken = generateRefreshToken(); // reuse secure random string generator
        PasswordResetTokenEntity resetToken = new PasswordResetTokenEntity();
        resetToken.setId(UUID.randomUUID());
        resetToken.setUser(user);
        resetToken.setTokenHash(hashToken(rawToken));
        resetToken.setExpiresAt(Instant.now().plus(1, ChronoUnit.HOURS));
        passwordResetTokenRepository.save(resetToken);

        // TODO: Send email with rawToken
        auditLogService.logEvent(user.getId(), "PASSWORD_RESET_REQUESTED", "USER", user.getId().toString());
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetTokenEntity tokenEntity = passwordResetTokenRepository
                .findByTokenHash(hashToken(request.token()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid or expired token"));

        if (tokenEntity.getUsedAt() != null || tokenEntity.getExpiresAt().isBefore(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid or expired token");
        }

        UserEntity user = tokenEntity.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        tokenEntity.setUsedAt(Instant.now());
        passwordResetTokenRepository.save(tokenEntity);

        logoutAll(user.getId()); // Invalidate all sessions
        auditLogService.logEvent(user.getId(), "PASSWORD_RESET_COMPLETED", "USER", user.getId().toString());
    }

    /**
     * Core session generator. 
     * Creates a short-lived JWT Access Token and a long-lived opaque Refresh Token.
     * The refresh token is securely hashed before storage (like a password) to mitigate database leaks.
     */
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
