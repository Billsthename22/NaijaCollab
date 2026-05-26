package com.naijacollab.backend.dto.auth;

public record AuthResponse(
        AuthUserDto user, String accessToken, String refreshToken, long accessTokenExpiresInSeconds) {}

