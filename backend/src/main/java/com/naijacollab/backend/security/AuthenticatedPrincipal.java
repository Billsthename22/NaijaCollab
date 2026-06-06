package com.naijacollab.backend.security;

import java.util.UUID;

public record AuthenticatedPrincipal(UUID userId, String email, String username) {}

