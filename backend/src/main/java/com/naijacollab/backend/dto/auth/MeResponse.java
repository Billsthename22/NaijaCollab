package com.naijacollab.backend.dto.auth;

import com.naijacollab.backend.dto.profile.ProfileResponse;

public record MeResponse(AuthUserDto user, ProfileResponse profile) {}

