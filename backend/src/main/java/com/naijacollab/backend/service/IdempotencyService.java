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

/**
 * Service to ensure critical operations (like payments, exports, or collab requests) happen exactly once.
 * 
 * Concept: 
 * The client sends a unique 'Idempotency-Key' header with their request.
 * If a network error occurs and the client retries the same request, this service intercepts it.
 * It checks if the key was already processed successfully. If so, it returns the cached response
 * instead of re-executing the heavy/sensitive logic.
 */
@Service
public class IdempotencyService {

    private static final Duration DEFAULT_TTL = Duration.ofHours(24);

    private final IdempotencyKeyRepository idempotencyKeyRepository;

    public IdempotencyService(IdempotencyKeyRepository idempotencyKeyRepository) {
        this.idempotencyKeyRepository = idempotencyKeyRepository;
    }

    /**
     * Checks if a request with this idempotency key was already processed by this user.
     * 
     * @param scope The domain scope (e.g., "PAYMENT_INTENT", "DATA_EXPORT")
     * @param actorUserId The user making the request
     * @param key The unique UUID provided by the frontend client
     * @param requestHash A hash of the request body to ensure the client isn't reusing the key for a DIFFERENT payload.
     * @return The existing record if found, or null if this is a fresh request.
     */
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

    /**
     * Records a successful operation so future retries with the same key can be caught.
     * 
     * @param resourceType The type of entity created/modified (e.g., "ExportJob")
     * @param resourceId The UUID of the created entity
     * @param responseCode The HTTP status code to return to the retrying client (usually 200 or 201)
     */
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
