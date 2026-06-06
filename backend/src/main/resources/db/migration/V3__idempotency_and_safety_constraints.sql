CREATE TABLE IF NOT EXISTS idempotency_keys (
    id UUID PRIMARY KEY,
    scope VARCHAR(80) NOT NULL,
    actor_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    idempotency_key VARCHAR(120) NOT NULL,
    request_hash VARCHAR(128) NOT NULL,
    resource_type VARCHAR(80),
    resource_id VARCHAR(120),
    response_code INTEGER,
    created_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    UNIQUE (scope, actor_user_id, idempotency_key)
);
CREATE INDEX IF NOT EXISTS idx_idempotency_keys_expires_at ON idempotency_keys(expires_at);

ALTER TABLE reported_content ADD COLUMN IF NOT EXISTS idempotency_key VARCHAR(120);
CREATE UNIQUE INDEX IF NOT EXISTS uq_reported_content_reporter_idempotency
    ON reported_content(reporter_user_id, idempotency_key)
    WHERE idempotency_key IS NOT NULL;

