package com.naijacollab.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import com.naijacollab.backend.validation.StrongPassword;

public record RegisterRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 10, max = 72) @StrongPassword String password,
        @NotBlank @Size(min = 3, max = 30)
                @Pattern(regexp = "^[a-zA-Z0-9_-]+$") String username,
        @NotBlank @Size(min = 2, max = 100)
                @Pattern(regexp = "^[^\\p{Cntrl}]+$") String displayName) {}
