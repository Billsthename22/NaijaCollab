package com.naijacollab.backend.repository;

import com.naijacollab.backend.domain.ProjectEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<ProjectEntity, UUID> {
    List<ProjectEntity> findByOwner_Id(UUID ownerId);
}
