package com.naijacollab.backend.repository;

import com.naijacollab.backend.domain.ProfileSkillEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileSkillRepository extends JpaRepository<ProfileSkillEntity, UUID> {
    List<ProfileSkillEntity> findByProfile_UserId(UUID userId);
}
