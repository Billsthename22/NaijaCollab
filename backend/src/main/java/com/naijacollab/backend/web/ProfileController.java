package com.naijacollab.backend.web;

import com.naijacollab.backend.dto.profile.ProfileResponse;
import com.naijacollab.backend.dto.profile.ProfileUpdateRequest;
import com.naijacollab.backend.security.SecurityPrincipalAccessor;
import com.naijacollab.backend.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import com.naijacollab.backend.dto.profile.AddSkillRequest;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/profiles")
public class ProfileController {

    private final ProfileService profileService;
    private final SecurityPrincipalAccessor principalAccessor;

    public ProfileController(ProfileService profileService, SecurityPrincipalAccessor principalAccessor) {
        this.profileService = profileService;
        this.principalAccessor = principalAccessor;
    }

    @GetMapping("/me")
    public ProfileResponse me() {
        return profileService.getByUserId(principalAccessor.requireUserId());
    }

    @GetMapping("/{userId}")
    public ProfileResponse getPublicProfile(@PathVariable java.util.UUID userId) {
        return profileService.getByUserId(userId);
    }

    @PatchMapping("/me")
    public ProfileResponse updateMe(@Valid @RequestBody ProfileUpdateRequest request) {
        return profileService.updateByUserId(principalAccessor.requireUserId(), request);
    }

    @PostMapping("/me/skills")
    public ProfileResponse addSkill(@Valid @RequestBody AddSkillRequest request) {
        return profileService.addSkillToProfile(principalAccessor.requireUserId(), request);
    }

    @DeleteMapping("/me/skills/{profileSkillId}")
    public ProfileResponse removeSkill(@PathVariable java.util.UUID profileSkillId) {
        return profileService.removeSkillFromProfile(principalAccessor.requireUserId(), profileSkillId);
    }
}

