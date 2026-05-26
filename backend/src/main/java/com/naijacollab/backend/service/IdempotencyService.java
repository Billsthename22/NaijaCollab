package com.naijacollab.backend.service;

import com.naijacollab.backend.domain.IdempotencyKeyEntity;
import com.naijacollab.backend.repository.IdempotencyKeyRepository;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class IdempotencyService {

    private static final Duration DEFAULT_TTL = Duration.ofHours(24);

    private final IdempotencyKeyRepository idempotencyKeyRepository;

    public IdempotencyService(IdempotencyKeyRepository idempotencyKeyRepository) {
        this.idempotencyKeyRepository = idempotencyKeyRepository;
    }

    @Transactional(readOnly = true)
    public IdempotencyKeyEntity assertKeyOrGetExisting(
            String scope, UUID actorUserId, String key, String requestHash) {
        return idempotencyKeyRepository
                .findByScopeAndActorUserIdAndIdempotencyKeyAndExpiresAtAfter(
                        scope, actorUserId, key, Instant.now())
                .map(
                        existing -> {
                            if (!existing.getRequestHash().equals(requestHash)) {
                                throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "Idempotency key already used with a different payload");
                            }
                            return existing;
                        })
                .orElse(null);
    }

    @Transactional
    public IdempotencyKeyEntity save(
            String scope,
            UUID actorUserId,
            String key,
            String requestHash,
            String resourceType,
            String resourceId,
            int responseCode) {
        IdempotencyKeyEntity record = new IdempotencyKeyEntity();
        record.setId(UUID.randomUUID());
        record.setScope(scope);
        record.setActorUserId(actorUserId);
        record.setIdempotencyKey(key);
        record.setRequestHash(requestHash);
        record.setResourceType(resourceType);
        record.setResourceId(resourceId);
        record.setResponseCode(responseCode);
        record.setCreatedAt(Instant.now());
        record.setExpiresAt(Instant.now().plus(DEFAULT_TTL));
        return idempotencyKeyRepository.save(record);
    }
}
