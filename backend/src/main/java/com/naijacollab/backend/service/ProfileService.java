package com.naijacollab.backend.service;

import com.naijacollab.backend.domain.ProfileEntity;
import com.naijacollab.backend.dto.profile.ProfileResponse;
import com.naijacollab.backend.dto.profile.ProfileUpdateRequest;
import com.naijacollab.backend.repository.ProfileRepository;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final AuditLogService auditLogService;

    public ProfileService(ProfileRepository profileRepository, AuditLogService auditLogService) {
        this.profileRepository = profileRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional(readOnly = true)
    public ProfileResponse getByUserId(UUID userId) {
        ProfileEntity profile =
                profileRepository
                        .findById(userId)
                        .orElseThrow(
                                () ->
                                        new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "Profile not found"));
        return toResponse(profile);
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public ProfileResponse updateByUserId(UUID userId, ProfileUpdateRequest request) {
        ProfileEntity profile =
                profileRepository
                        .findById(userId)
                        .orElseThrow(
                                () ->
                                        new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "Profile not found"));

        if (request.primaryRole() != null) {
            profile.setPrimaryRole(normalize(request.primaryRole()));
        }
        if (request.bio() != null) {
            profile.setBio(normalize(request.bio()));
        }
        if (request.stateCode() != null) {
            profile.setStateCode(normalizeUpper(request.stateCode()));
        }
        if (request.city() != null) {
            profile.setCity(normalize(request.city()));
        }
        if (request.avatarUrl() != null) {
            profile.setAvatarUrl(normalize(request.avatarUrl()));
        }
        if (request.websiteUrl() != null) {
            profile.setWebsiteUrl(normalize(request.websiteUrl()));
        }
        if (request.onboardingCompleted() != null) {
            profile.setOnboardingCompleted(request.onboardingCompleted());
        }

        profileRepository.save(profile);
        auditLogService.logEvent(userId, "PROFILE_UPDATED", "PROFILE", userId.toString());
        return toResponse(profile);
    }

    private String normalize(String value) {
        return value == null ? null : value.trim();
    }

    private String normalizeUpper(String value) {
        String normalized = normalize(value);
        return normalized == null ? null : normalized.toUpperCase();
    }

    private ProfileResponse toResponse(ProfileEntity profile) {
        return new ProfileResponse(
                profile.getPrimaryRole(),
                profile.getBio(),
                profile.getStateCode(),
                profile.getCity(),
                profile.getAvatarUrl(),
                profile.getWebsiteUrl(),
                profile.isOnboardingCompleted());
    }
}
