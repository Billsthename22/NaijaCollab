package com.naijacollab.backend.service;

import com.naijacollab.backend.repository.RateLimitPolicyRepository;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

@Service
public class RateLimitService {

    public record Decision(boolean allowed, long retryAfterSeconds) {}
    public record Policy(String key, int limitCount, int windowSeconds) {}
    private record CounterWindow(AtomicInteger count, Instant windowStart) {}

    private static final Duration POLICY_CACHE_TTL = Duration.ofMinutes(5);

    private final RateLimitPolicyRepository rateLimitPolicyRepository;
    private final Map<String, Policy> policyCache = new ConcurrentHashMap<>();
    private final Map<String, CounterWindow> counters = new ConcurrentHashMap<>();
    private volatile Instant cacheLoadedAt = Instant.EPOCH;

    public RateLimitService(RateLimitPolicyRepository rateLimitPolicyRepository) {
        this.rateLimitPolicyRepository = rateLimitPolicyRepository;
    }

    public Optional<Policy> getPolicy(String policyKey) {
        reloadPoliciesIfNeeded();
        return Optional.ofNullable(policyCache.get(policyKey));
    }

    public Decision checkAndIncrement(String policyKey, String subjectKey) {
        Optional<Policy> policyOpt = getPolicy(policyKey);
        if (policyOpt.isEmpty()) {
            return new Decision(true, 0);
        }
        Policy policy = policyOpt.get();
        String counterKey = policy.key() + ":" + subjectKey;
        Instant now = Instant.now();

        CounterWindow window =
                counters.compute(
                        counterKey,
                        (ignored, existing) -> {
                            if (existing == null
                                    || Duration.between(existing.windowStart(), now).getSeconds()
                                            >= policy.windowSeconds()) {
                                return new CounterWindow(new AtomicInteger(1), now);
                            }
                            existing.count().incrementAndGet();
                            return existing;
                        });

        int used = window.count().get();
        if (used <= policy.limitCount()) {
            return new Decision(true, 0);
        }
        long elapsed = Duration.between(window.windowStart(), now).getSeconds();
        long retryAfter = Math.max(1, policy.windowSeconds() - elapsed);
        return new Decision(false, retryAfter);
    }

    private synchronized void reloadPoliciesIfNeeded() {
        if (Duration.between(cacheLoadedAt, Instant.now()).compareTo(POLICY_CACHE_TTL) < 0) {
            return;
        }
        try {
            List<Policy> policies =
                    rateLimitPolicyRepository.findByEnabledTrue().stream()
                            .map(
                                    row ->
                                            new Policy(
                                                    row.getPolicyKey(),
                                                    row.getLimitCount(),
                                                    row.getWindowSeconds()))
                            .toList();
            Map<String, Policy> next = new ConcurrentHashMap<>();
            for (Policy policy : policies) {
                next.put(policy.key(), policy);
            }
            policyCache.clear();
            policyCache.putAll(next);
        } catch (DataAccessException ex) {
            // Fail open if DB is unavailable; preserve last good cache.
        } finally {
            cacheLoadedAt = Instant.now();
        }
    }
}
