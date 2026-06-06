package com.naijacollab.backend.dto.user;

import jakarta.validation.constraints.Size;

public record UserUpdateRequest(
        @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
        String username,

        @Size(max = 100, message = "Display name cannot exceed 100 characters")
        String displayName
) {}
