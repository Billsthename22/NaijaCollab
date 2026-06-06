package com.naijacollab.backend.repository;

import com.naijacollab.backend.domain.IdempotencyKeyEntity;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IdempotencyKeyRepository extends JpaRepository<IdempotencyKeyEntity, UUID> {

    Optional<IdempotencyKeyEntity> findByScopeAndActorUserIdAndIdempotencyKeyAndExpiresAtAfter(
            String scope, UUID actorUserId, String idempotencyKey, Instant now);
}
