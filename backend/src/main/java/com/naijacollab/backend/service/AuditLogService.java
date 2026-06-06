package com.naijacollab.backend.service;

import java.time.Instant;
import java.util.UUID;
import javax.sql.DataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class AuditLogService {

    private static final Logger log = LoggerFactory.getLogger(AuditLogService.class);

    private final JdbcTemplate jdbcTemplate;
    private final boolean postgresDatabase;
    private final boolean auditLogTableAvailable;

    public AuditLogService(JdbcTemplate jdbcTemplate, DataSource dataSource) {
        this.jdbcTemplate = jdbcTemplate;
        this.postgresDatabase = detectPostgres(dataSource);
        this.auditLogTableAvailable = detectAuditLogTable(dataSource);
    }

    public void logEvent(UUID actorUserId, String action, String targetType, String targetId) {
        if (!auditLogTableAvailable) {
            return;
        }
        try {
            String sql =
                    postgresDatabase
                            ? """
                    INSERT INTO audit_logs (
                        id, actor_user_id, action, target_type, target_id,
                        compliance_classification, contains_personal_data, retention_policy,
                        metadata_jsonb, created_at
                    ) VALUES (?, ?, ?, ?, ?, 'PERSONAL_DATA', TRUE, 'STANDARD', CAST(? AS jsonb), ?)
                    """
                            : """
                    INSERT INTO audit_logs (
                        id, actor_user_id, action, target_type, target_id,
                        compliance_classification, contains_personal_data, retention_policy,
                        metadata_jsonb, created_at
                    ) VALUES (?, ?, ?, ?, ?, 'PERSONAL_DATA', TRUE, 'STANDARD', ?, ?)
                    """;
            jdbcTemplate.update(
                    sql,
                    UUID.randomUUID(),
                    actorUserId,
                    action,
                    targetType,
                    targetId,
                    "{}",
                    Instant.now());
        } catch (DataAccessException ex) {
            // Do not fail user flow if audit log storage has a transient issue.
            log.warn("Audit log write skipped: action={} targetType={} reason={}", action, targetType, ex.getMessage());
        }
    }

    private boolean detectPostgres(DataSource dataSource) {
        try (var connection = dataSource.getConnection()) {
            String productName = connection.getMetaData().getDatabaseProductName();
            return productName != null && productName.toLowerCase().contains("postgres");
        } catch (Exception ex) {
            log.warn("Could not detect database product type for audit logs: {}", ex.getMessage());
            return false;
        }
    }

    private boolean detectAuditLogTable(DataSource dataSource) {
        try (var connection = dataSource.getConnection();
                var resultSet =
                        connection.getMetaData().getTables(
                                connection.getCatalog(), null, "AUDIT_LOGS", new String[] {"TABLE"})) {
            return resultSet.next();
        } catch (Exception ex) {
            log.warn("Could not determine audit_logs table availability: {}", ex.getMessage());
            return false;
        }
    }
}
