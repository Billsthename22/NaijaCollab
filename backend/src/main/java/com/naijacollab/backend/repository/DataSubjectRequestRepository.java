package com.naijacollab.backend.repository;

import com.naijacollab.backend.domain.DataSubjectRequestEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DataSubjectRequestRepository extends JpaRepository<DataSubjectRequestEntity, UUID> {

    List<DataSubjectRequestEntity> findTop20ByUserIdOrderByRequestedAtDesc(UUID userId);
}
