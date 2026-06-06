package com.naijacollab.backend.service;

import com.naijacollab.backend.domain.ProfileEntity;
import com.naijacollab.backend.dto.profile.ProfileResponse;
import com.naijacollab.backend.dto.profile.ProfileUpdateRequest;
import com.naijacollab.backend.domain.ProfileSkillEntity;
import com.naijacollab.backend.domain.SkillEntity;
import com.naijacollab.backend.dto.profile.AddSkillRequest;
import com.naijacollab.backend.dto.profile.ProfileSkillDto;
import com.naijacollab.backend.dto.profile.SkillDto;
import com.naijacollab.backend.repository.ProfileSkillRepository;
import com.naijacollab.backend.repository.ProfileRepository;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final ProfileSkillRepository profileSkillRepository;
    private final SkillService skillService;
    private final AuditLogService auditLogService;

    public ProfileService(
            ProfileRepository profileRepository, 
            ProfileSkillRepository profileSkillRepository,
            SkillService skillService,
            AuditLogService auditLogService) {
        this.profileRepository = profileRepository;
        this.profileSkillRepository = profileSkillRepository;
        this.skillService = skillService;
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

    @Transactional
    public ProfileResponse addSkillToProfile(UUID userId, AddSkillRequest request) {
        ProfileEntity profile = profileRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));

        SkillEntity skill;
        if (request.skillId() != null) {
            // we should technically fetch it from skillService by id, but we can also getOrCreate by name
            // Let's assume getOrCreateSkill handles it if name is provided.
            if (request.skillName() == null || request.skillName().trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "skillName is required");
            }
            skill = skillService.getOrCreateSkill(request.skillName());
        } else {
            skill = skillService.getOrCreateSkill(request.skillName());
        }

        // check if already added
        boolean alreadyHasSkill = profileSkillRepository.findByProfile_UserId(userId).stream()
                .anyMatch(ps -> ps.getSkill().getId().equals(skill.getId()));
        
        if (!alreadyHasSkill) {
            ProfileSkillEntity ps = new ProfileSkillEntity();
            ps.setId(UUID.randomUUID());
            ps.setProfile(profile);
            ps.setSkill(skill);
            ps.setProficiencyLevel(request.proficiencyLevel());
            profileSkillRepository.save(ps);
        }

        return toResponse(profile);
    }

    @Transactional
    public ProfileResponse removeSkillFromProfile(UUID userId, UUID profileSkillId) {
        ProfileEntity profile = profileRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));

        profileSkillRepository.findById(profileSkillId)
                .filter(ps -> ps.getProfile().getUserId().equals(userId))
                .ifPresent(profileSkillRepository::delete);

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
        List<ProfileSkillDto> skills = profileSkillRepository.findByProfile_UserId(profile.getUserId())
                .stream()
                .map(ps -> new ProfileSkillDto(
                        ps.getId(),
                        new SkillDto(
                                ps.getSkill().getId(), 
                                ps.getSkill().getSlug(), 
                                ps.getSkill().getName(), 
                                ps.getSkill().getCategory(), 
                                ps.getSkill().isActive()),
                        ps.getProficiencyLevel()
                ))
                .collect(Collectors.toList());

        return new ProfileResponse(
                profile.getPrimaryRole(),
                profile.getBio(),
                profile.getStateCode(),
                profile.getCity(),
                profile.getAvatarUrl(),
                profile.getWebsiteUrl(),
                profile.isOnboardingCompleted(),
                skills);
    }
}
