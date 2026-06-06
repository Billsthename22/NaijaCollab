package com.naijacollab.backend.dto.portfolio;

import java.time.Instant;
import java.util.UUID;

public record PortfolioResponse(
        UUID id,
        UUID userId,
        String title,
        String description,
        String mediaUrl,
        Instant createdAt) {}
