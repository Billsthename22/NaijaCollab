package com.naijacollab.backend.dto.messaging;

import java.time.Instant;
import java.util.UUID;

public record MessageResponse(
        UUID id,
        UUID conversationId,
        UUID senderId,
        String content,
        Instant createdAt,
        Instant readAt) {}
