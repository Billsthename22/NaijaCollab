package com.naijacollab.backend.service;

import com.naijacollab.backend.domain.DataSubjectRequestEntity;
import com.naijacollab.backend.dto.export.DataExportRequestResponse;
import com.naijacollab.backend.repository.DataSubjectRequestRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DataPortabilityService {

    private static final String REQUEST_TYPE_EXPORT = "EXPORT";
    private static final String STATUS_PENDING = "PENDING";

    private final DataSubjectRequestRepository dataSubjectRequestRepository;
    private final AuditLogService auditLogService;
    private final ExportJobService exportJobService;

    public DataPortabilityService(
            DataSubjectRequestRepository dataSubjectRequestRepository,
            AuditLogService auditLogService,
            ExportJobService exportJobService) {
        this.dataSubjectRequestRepository = dataSubjectRequestRepository;
        this.auditLogService = auditLogService;
        this.exportJobService = exportJobService;
    }

    @Transactional
    public DataExportRequestResponse requestExport(UUID userId) {
        DataSubjectRequestEntity request = new DataSubjectRequestEntity();
        request.setId(UUID.randomUUID());
        request.setUserId(userId);
        request.setRequestType(REQUEST_TYPE_EXPORT);
        request.setStatus(STATUS_PENDING);
        request.setRequestedAt(Instant.now());
        dataSubjectRequestRepository.save(request);
        auditLogService.logEvent(userId, "DATA_EXPORT_REQUESTED", "DATA_SUBJECT_REQUEST", request.getId().toString());
        exportJobService.processExport(request.getId());
        return toResponse(request);
    }

    @Transactional(readOnly = true)
    public List<DataExportRequestResponse> listExportRequests(UUID userId) {
        return dataSubjectRequestRepository.findTop20ByUserIdOrderByRequestedAtDesc(userId).stream()
                .filter(request -> REQUEST_TYPE_EXPORT.equals(request.getRequestType()))
                .map(this::toResponse)
                .toList();
    }

    private DataExportRequestResponse toResponse(DataSubjectRequestEntity request) {
        return new DataExportRequestResponse(
                request.getId(),
                request.getUserId(),
                request.getRequestType(),
                request.getStatus(),
                request.getRequestedAt(),
                request.getCompletedAt(),
                request.getResultLocation());
    }
}
