package com.naijacollab.backend.service;

import com.naijacollab.backend.repository.DataSubjectRequestRepository;
import java.time.Instant;
import java.util.UUID;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ExportJobService {

    private final DataSubjectRequestRepository dataSubjectRequestRepository;
    private final AuditLogService auditLogService;

    public ExportJobService(
            DataSubjectRequestRepository dataSubjectRequestRepository,
            AuditLogService auditLogService) {
        this.dataSubjectRequestRepository = dataSubjectRequestRepository;
        this.auditLogService = auditLogService;
    }

    @Async
    @Transactional
    public void processExport(UUID requestId) {
        dataSubjectRequestRepository
                .findById(requestId)
                .ifPresent(
                        request -> {
                            request.setStatus("PROCESSING");
                            dataSubjectRequestRepository.save(request);

                            // MVP skeleton: replace with S3 object generation and signed URL issuance.
                            String token = UUID.randomUUID().toString().replace("-", "");
                            request.setResultLocation("/api/v1/users/me/export/download/" + token);
                            request.setStatus("COMPLETED");
                            request.setCompletedAt(Instant.now());
                            dataSubjectRequestRepository.save(request);
                            auditLogService.logEvent(
                                    request.getUserId(),
                                    "DATA_EXPORT_COMPLETED",
                                    "DATA_SUBJECT_REQUEST",
                                    requestId.toString());
                        });
    }
}
