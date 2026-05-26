package com.naijacollab.backend.dto.profile;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ProfileUpdateRequest(
        @Size(max = 60) String primaryRole,
        @Size(max = 500) String bio,
        @Size(max = 12)
                @Pattern(
                        regexp =
                                "^(ABJ|FCT|ABIA|ADAM|AKIB|ANAM|BAUC|BAYA|BENU|BORN|CROS|DELT|EBON|EDO|EKIT|ENUG|GOMB|IMO|JIGA|KADU|KANO|KATS|KEBB|KOGI|KWAR|LAG|NASA|NIGE|OGUN|ONDO|OSUN|OYO|PLAT|RIVE|SOKO|TARA|YOBE|ZAM|REMOTE)$")
                String stateCode,
        @Size(max = 100) String city,
        @Size(max = 500) String avatarUrl,
        @Size(max = 500) String websiteUrl,
        Boolean onboardingCompleted) {}
