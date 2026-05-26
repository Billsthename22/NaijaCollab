package com.naijacollab.backend.dto.profile;

public record ProfileResponse(
        String primaryRole,
        String bio,
        String stateCode,
        String city,
        String avatarUrl,
        String websiteUrl,
        boolean onboardingCompleted) {}

