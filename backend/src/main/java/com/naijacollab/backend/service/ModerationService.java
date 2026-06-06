package com.naijacollab.backend.service;

import com.naijacollab.backend.domain.ReportedContentEntity;
import com.naijacollab.backend.domain.IdempotencyKeyEntity;
import com.naijacollab.backend.dto.moderation.ReportContentRequest;
import com.naijacollab.backend.dto.moderation.ReportedContentResponse;
import com.naijacollab.backend.repository.ReportedContentRepository;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ModerationService {

    private static final String IDEMPOTENCY_SCOPE = "MODERATION_REPORT";

    private final ReportedContentRepository reportedContentRepository;
    private final IdempotencyService idempotencyService;
    private final AuditLogService auditLogService;

    public ModerationService(
            ReportedContentRepository reportedContentRepository,
            IdempotencyService idempotencyService,
            AuditLogService auditLogService) {
        this.reportedContentRepository = reportedContentRepository;
        this.idempotencyService = idempotencyService;
        this.auditLogService = auditLogService;
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public ReportedContentResponse report(
            UUID reporterUserId, ReportContentRequest request, String idempotencyKey) {
        String normalizedIdempotencyKey = trimToNull(idempotencyKey);
        if (normalizedIdempotencyKey != null && normalizedIdempotencyKey.length() > 120) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Idempotency key is too long");
        }

        String requestHash = hashRequest(request);
        if (normalizedIdempotencyKey != null) {
            IdempotencyKeyEntity existing =
                    idempotencyService.assertKeyOrGetExisting(
                            IDEMPOTENCY_SCOPE, reporterUserId, normalizedIdempotencyKey, requestHash);
            if (existing != null && existing.getResourceId() != null) {
                return reportedContentRepository
                        .findById(UUID.fromString(existing.getResourceId()))
                        .map(this::toResponse)
                        .orElseThrow(
                                () ->
                                        new ResponseStatusException(
                                                HttpStatus.CONFLICT,
                                                "Idempotent resource reference is stale"));
            }
        }

        ReportedContentEntity entity = new ReportedContentEntity();
        entity.setId(UUID.randomUUID());
        entity.setReporterUserId(reporterUserId);
        entity.setTargetUserId(request.targetUserId());
        entity.setContentType(request.contentType().trim().toUpperCase());
        entity.setContentId(trimToNull(request.contentId()));
        entity.setReasonCode(request.reasonCode().trim().toUpperCase());
        entity.setDetails(trimToNull(request.details()));
        entity.setIdempotencyKey(normalizedIdempotencyKey);
        entity.setStatus("OPEN");
        entity.setCreatedAt(Instant.now());
        try {
            reportedContentRepository.save(entity);
        } catch (DataIntegrityViolationException ex) {
            if (normalizedIdempotencyKey != null) {
                return reportedContentRepository
                        .findByReporterUserIdAndIdempotencyKey(reporterUserId, normalizedIdempotencyKey)
                        .map(this::toResponse)
                        .orElseThrow(
                                () ->
                                        new ResponseStatusException(
                                                HttpStatus.CONFLICT,
                                                "Idempotent moderation report could not be completed"));
            }
            throw ex;
        }
        auditLogService.logEvent(
                reporterUserId, "MODERATION_REPORT_CREATED", "REPORTED_CONTENT", entity.getId().toString());

        if (normalizedIdempotencyKey != null) {
            idempotencyService.save(
                    IDEMPOTENCY_SCOPE,
                    reporterUserId,
                    normalizedIdempotencyKey,
                    requestHash,
                    "REPORTED_CONTENT",
                    entity.getId().toString(),
                    HttpStatus.OK.value());
        }
        return toResponse(entity);
    }

    @Transactional(readOnly = true)
    public List<ReportedContentResponse> listMine(UUID reporterUserId) {
        return reportedContentRepository.findTop50ByReporterUserIdOrderByCreatedAtDesc(reporterUserId).stream()
                .map(this::toResponse)
                .toList();
    }

    private ReportedContentResponse toResponse(ReportedContentEntity entity) {
        return new ReportedContentResponse(
                entity.getId(),
                entity.getReporterUserId(),
                entity.getTargetUserId(),
                entity.getContentType(),
                entity.getContentId(),
                entity.getReasonCode(),
                entity.getDetails(),
                entity.getStatus(),
                entity.getCreatedAt(),
                entity.getResolvedAt());
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String hashRequest(ReportContentRequest request) {
        try {
            String normalized =
                    (request.contentType() == null ? "" : request.contentType().trim().toUpperCase())
                            + "|"
                            + (request.contentId() == null ? "" : request.contentId().trim())
                            + "|"
                            + (request.targetUserId() == null ? "" : request.targetUserId())
                            + "|"
                            + (request.reasonCode() == null ? "" : request.reasonCode().trim().toUpperCase())
                            + "|"
                            + (request.details() == null ? "" : request.details().trim());
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(normalized.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to hash moderation request", ex);
        }
    }
}
