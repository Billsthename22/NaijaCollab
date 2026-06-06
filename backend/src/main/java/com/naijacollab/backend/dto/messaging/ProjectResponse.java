package com.naijacollab.backend.dto.messaging;

import java.time.Instant;
import java.util.UUID;

public record ProjectResponse(
        UUID id,
        String name,
        String description,
        String status,
        UUID ownerId,
        Instant createdAt) {}
