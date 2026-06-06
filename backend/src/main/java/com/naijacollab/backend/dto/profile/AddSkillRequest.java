package com.naijacollab.backend.dto.profile;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public record AddSkillRequest(
        UUID skillId,
        String skillName,
        @NotBlank(message = "Proficiency level is required")
        String proficiencyLevel
) {}
