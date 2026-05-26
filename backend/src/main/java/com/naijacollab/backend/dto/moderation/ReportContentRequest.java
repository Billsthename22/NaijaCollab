package com.naijacollab.backend.dto.moderation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record ReportContentRequest(
        @NotBlank @Size(max = 40) String contentType,
        @Size(max = 120) String contentId,
        UUID targetUserId,
        @NotBlank @Size(max = 40) String reasonCode,
        @Size(max = 1000) String details) {}
