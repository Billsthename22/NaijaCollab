package com.naijacollab.backend.dto.profile;

import java.util.UUID;

public record ProfileSkillDto(
        UUID id,
        SkillDto skill,
        String proficiencyLevel
) {}
