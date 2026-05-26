package com.naijacollab.backend.repository;

import com.naijacollab.backend.domain.RefreshTokenEntity;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefreshTokenRepository extends JpaRepository<RefreshTokenEntity, UUID> {

    Optional<RefreshTokenEntity> findByTokenHash(String tokenHash);

    List<RefreshTokenEntity> findByUser_IdAndRevokedAtIsNullAndExpiresAtAfter(
            UUID userId, Instant now);

    void deleteByUser_IdAndExpiresAtBefore(UUID userId, Instant expiresAt);
}
