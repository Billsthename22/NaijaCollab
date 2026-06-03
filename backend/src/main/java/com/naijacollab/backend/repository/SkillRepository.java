package com.naijacollab.backend.repository;

import com.naijacollab.backend.domain.SkillEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SkillRepository extends JpaRepository<SkillEntity, UUID> {
    Optional<SkillEntity> findBySlug(String slug);
}
