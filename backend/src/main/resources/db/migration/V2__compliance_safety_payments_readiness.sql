ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS country_code CHAR(2) DEFAULT 'NG';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS language_preferences JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS kyc_tier VARCHAR(20) NOT NULL DEFAULT 'NONE';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS kyc_status VARCHAR(20) NOT NULL DEFAULT 'NOT_STARTED';

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY,
    actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(80) NOT NULL,
    target_type VARCHAR(80) NOT NULL,
    target_id VARCHAR(120),
    compliance_classification VARCHAR(40) NOT NULL DEFAULT 'PERSONAL_DATA',
    contains_personal_data BOOLEAN NOT NULL DEFAULT TRUE,
    retention_policy VARCHAR(40) NOT NULL DEFAULT 'STANDARD',
    ip_hash VARCHAR(128),
    metadata_jsonb JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_user_id ON audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_created_at ON audit_logs(action, created_at DESC);

CREATE TABLE IF NOT EXISTS data_subject_requests (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    request_type VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL,
    requested_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    request_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    result_location VARCHAR(500)
);
CREATE INDEX IF NOT EXISTS idx_data_subject_requests_user_id ON data_subject_requests(user_id);

CREATE TABLE IF NOT EXISTS device_sessions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_id UUID REFERENCES refresh_tokens(id) ON DELETE SET NULL,
    device_fingerprint VARCHAR(255),
    user_agent VARCHAR(500),
    ip_hash VARCHAR(128),
    country_code CHAR(2),
    city VARCHAR(120),
    created_at TIMESTAMPTZ NOT NULL,
    last_seen_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_device_sessions_user_id ON device_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_device_sessions_last_seen_at ON device_sessions(last_seen_at DESC);

CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY,
    slug VARCHAR(120) UNIQUE NOT NULL,
    name VARCHAR(120) NOT NULL,
    category VARCHAR(120) NOT NULL,
    subcategory VARCHAR(120),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS profile_skills (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE RESTRICT,
    proficiency_level VARCHAR(20) NOT NULL DEFAULT 'INTERMEDIATE',
    years_experience SMALLINT,
    created_at TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (user_id, skill_id)
);

CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY,
    compliance_classification VARCHAR(40) NOT NULL DEFAULT 'PERSONAL_DATA',
    contains_personal_data BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS portfolio_items (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(160) NOT NULL,
    description VARCHAR(1000),
    item_type VARCHAR(30) NOT NULL,
    external_url VARCHAR(500),
    visibility VARCHAR(20) NOT NULL DEFAULT 'PUBLIC',
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    deleted_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_user_id ON portfolio_items(user_id);

CREATE TABLE IF NOT EXISTS portfolio_item_files (
    id UUID PRIMARY KEY,
    portfolio_item_id UUID NOT NULL REFERENCES portfolio_items(id) ON DELETE CASCADE,
    storage_provider VARCHAR(30) NOT NULL DEFAULT 'S3',
    object_key VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(120),
    file_size_bytes BIGINT,
    checksum_sha256 VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_portfolio_item_files_item_id ON portfolio_item_files(portfolio_item_id);

CREATE TABLE IF NOT EXISTS portfolio_views (
    id UUID PRIMARY KEY,
    portfolio_item_id UUID NOT NULL REFERENCES portfolio_items(id) ON DELETE CASCADE,
    viewer_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    viewer_ip_hash VARCHAR(128),
    viewed_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_portfolio_views_item_id ON portfolio_views(portfolio_item_id);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL,
    channel VARCHAR(20) NOT NULL DEFAULT 'IN_APP',
    title VARCHAR(160) NOT NULL,
    body VARCHAR(1000),
    payload_jsonb JSONB NOT NULL DEFAULT '{}'::jsonb,
    delivery_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    retries SMALLINT NOT NULL DEFAULT 0,
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_created_at ON notifications(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    email_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    in_app_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    push_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    message_events BOOLEAN NOT NULL DEFAULT TRUE,
    match_events BOOLEAN NOT NULL DEFAULT TRUE,
    collab_events BOOLEAN NOT NULL DEFAULT TRUE,
    project_events BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS user_safety_scores (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL DEFAULT 100,
    risk_level VARCHAR(20) NOT NULL DEFAULT 'LOW',
    last_computed_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS reported_content (
    id UUID PRIMARY KEY,
    reporter_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    content_type VARCHAR(40) NOT NULL,
    content_id VARCHAR(120),
    reason_code VARCHAR(40) NOT NULL,
    details VARCHAR(1000),
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMPTZ NOT NULL,
    resolved_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_reported_content_status_created_at ON reported_content(status, created_at DESC);

CREATE TABLE IF NOT EXISTS moderation_actions (
    id UUID PRIMARY KEY,
    moderator_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    target_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    report_id UUID REFERENCES reported_content(id) ON DELETE SET NULL,
    action_type VARCHAR(40) NOT NULL,
    reason VARCHAR(500),
    metadata_jsonb JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS user_flags (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    flag_type VARCHAR(40) NOT NULL,
    score_delta INTEGER NOT NULL DEFAULT 0,
    metadata_jsonb JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_user_flags_user_id_created_at ON user_flags(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS wallet_accounts (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    currency_code CHAR(3) NOT NULL,
    available_balance_minor BIGINT NOT NULL DEFAULT 0,
    held_balance_minor BIGINT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    UNIQUE (user_id, currency_code)
);

CREATE TABLE IF NOT EXISTS ledger_entries (
    id UUID PRIMARY KEY,
    wallet_account_id UUID NOT NULL REFERENCES wallet_accounts(id) ON DELETE RESTRICT,
    entry_type VARCHAR(30) NOT NULL,
    amount_minor BIGINT NOT NULL,
    balance_after_minor BIGINT NOT NULL,
    reference_type VARCHAR(40),
    reference_id VARCHAR(120),
    metadata_jsonb JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_wallet_created_at ON ledger_entries(wallet_account_id, created_at DESC);

CREATE TABLE IF NOT EXISTS payment_intents (
    id UUID PRIMARY KEY,
    payer_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    payee_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    currency_code CHAR(3) NOT NULL,
    amount_minor BIGINT NOT NULL,
    status VARCHAR(30) NOT NULL,
    escrow_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS disputes (
    id UUID PRIMARY KEY,
    payment_intent_id UUID NOT NULL REFERENCES payment_intents(id) ON DELETE CASCADE,
    raised_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    reason_code VARCHAR(40) NOT NULL,
    details VARCHAR(1000),
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
    resolution_note VARCHAR(1000),
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_disputes_status_created_at ON disputes(status, created_at DESC);

CREATE TABLE IF NOT EXISTS rate_limit_policies (
    id UUID PRIMARY KEY,
    policy_key VARCHAR(80) UNIQUE NOT NULL,
    scope VARCHAR(20) NOT NULL,
    limit_count INTEGER NOT NULL,
    window_seconds INTEGER NOT NULL,
    burst_count INTEGER NOT NULL DEFAULT 0,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

