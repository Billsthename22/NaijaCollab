package com.naijacollab.backend.dto.profile;

import java.util.List;

public record ProfileResponse(
        String primaryRole,
        String bio,
        String stateCode,
        String city,
        String avatarUrl,
        String websiteUrl,
        boolean onboardingCompleted,
        List<ProfileSkillDto> skills
) {}

