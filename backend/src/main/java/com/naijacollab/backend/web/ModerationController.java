package com.naijacollab.backend.web;

import com.naijacollab.backend.dto.moderation.ReportContentRequest;
import com.naijacollab.backend.dto.moderation.ReportedContentResponse;
import com.naijacollab.backend.security.SecurityPrincipalAccessor;
import com.naijacollab.backend.service.ModerationService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/moderation")
public class ModerationController {

    private final ModerationService moderationService;
    private final SecurityPrincipalAccessor principalAccessor;

    public ModerationController(
            ModerationService moderationService, SecurityPrincipalAccessor principalAccessor) {
        this.moderationService = moderationService;
        this.principalAccessor = principalAccessor;
    }

    @PostMapping("/reports")
    public ReportedContentResponse report(
            @Valid @RequestBody ReportContentRequest request,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey) {
        return moderationService.report(principalAccessor.requireUserId(), request, idempotencyKey);
    }

    @GetMapping("/reports/mine")
    public List<ReportedContentResponse> myReports() {
        return moderationService.listMine(principalAccessor.requireUserId());
    }
}
