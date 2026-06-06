package com.naijacollab.backend.repository;

import com.naijacollab.backend.domain.RateLimitPolicyEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RateLimitPolicyRepository extends JpaRepository<RateLimitPolicyEntity, UUID> {

    List<RateLimitPolicyEntity> findByEnabledTrue();
}
