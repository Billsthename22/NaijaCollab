package com.naijacollab.backend.dto.moderation;

import java.time.Instant;
import java.util.UUID;

public record ReportedContentResponse(
        UUID id,
        UUID reporterUserId,
        UUID targetUserId,
        String contentType,
        String contentId,
        String reasonCode,
        String details,
        String status,
        Instant createdAt,
        Instant resolvedAt) {}
