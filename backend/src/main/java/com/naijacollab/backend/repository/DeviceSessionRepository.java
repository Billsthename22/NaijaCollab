package com.naijacollab.backend.repository;

import com.naijacollab.backend.domain.DeviceSessionEntity;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceSessionRepository extends JpaRepository<DeviceSessionEntity, UUID> {

    Optional<DeviceSessionEntity> findByRefreshTokenIdAndRevokedAtIsNull(UUID refreshTokenId);

    List<DeviceSessionEntity> findByUserIdAndRevokedAtIsNull(UUID userId);
}
