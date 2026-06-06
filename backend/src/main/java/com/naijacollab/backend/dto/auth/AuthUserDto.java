package com.naijacollab.backend.dto.auth;

import java.util.UUID;

public record AuthUserDto(UUID id, String email, String username, String displayName) {}

