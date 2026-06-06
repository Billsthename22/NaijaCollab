package com.naijacollab.backend.dto.export;

import java.time.Instant;
import java.util.UUID;

public record DataExportRequestResponse(
        UUID id,
        UUID userId,
        String requestType,
        String status,
        Instant requestedAt,
        Instant completedAt,
        String resultLocation) {}
