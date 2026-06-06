package com.naijacollab.backend.dto.profile;

import java.util.UUID;

public record SkillDto(
        UUID id,
        String slug,
        String name,
        String category,
        boolean isActive
) {}
