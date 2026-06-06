package com.naijacollab.backend.repository;

import com.naijacollab.backend.domain.ReportedContentEntity;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportedContentRepository extends JpaRepository<ReportedContentEntity, UUID> {

    List<ReportedContentEntity> findTop50ByReporterUserIdOrderByCreatedAtDesc(UUID reporterUserId);

    Optional<ReportedContentEntity> findByReporterUserIdAndIdempotencyKey(
            UUID reporterUserId, String idempotencyKey);
}
