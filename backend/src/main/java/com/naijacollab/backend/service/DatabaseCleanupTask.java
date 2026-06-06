package com.naijacollab.backend.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DatabaseCleanupTask {

    private static final Logger log = LoggerFactory.getLogger(DatabaseCleanupTask.class);

    private final JdbcTemplate jdbcTemplate;

    public DatabaseCleanupTask(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void purgeExpiredData() {
        // Retention policies:
        // - idempotency_keys: delete once key expiry has passed (typically <= 24h)
        // - data_subject_requests (EXPORT): retain completed records for 7 days, then purge
        // - user hard-delete: deferred until full cross-table purge policy is implemented
        int deletedIdempotency =
                jdbcTemplate.update(
                        "DELETE FROM idempotency_keys WHERE expires_at < ?", Instant.now());
        int deletedOldExports =
                jdbcTemplate.update(
                        """
                        DELETE FROM data_subject_requests
                        WHERE request_type = 'EXPORT'
                          AND completed_at IS NOT NULL
                          AND completed_at < ?
                        """,
                        Instant.now().minus(7, ChronoUnit.DAYS));

        // User hard-purge after retention window is intentionally deferred until
        // full dependency graph delete policy is implemented for projects/messages.
        log.info(
                "Database cleanup completed: idempotencyDeleted={}, exportRequestsDeleted={}",
                deletedIdempotency,
                deletedOldExports);
    }
}
