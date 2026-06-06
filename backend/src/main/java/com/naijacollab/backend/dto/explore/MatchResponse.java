package com.naijacollab.backend.dto.explore;

import java.time.Instant;
import java.util.UUID;

public record MatchResponse(
        UUID matchId,
        UUID matchedUserId,
        String matchedUsername,
        String matchedDisplayName,
        Double score,
        String reasonsJsonb,
        Instant matchedAt) {}
