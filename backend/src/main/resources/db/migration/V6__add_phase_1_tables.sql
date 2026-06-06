CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY,
    owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    name VARCHAR(120) NOT NULL,
    description VARCHAR(1000),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    read_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id_created_at ON messages(conversation_id, created_at ASC);

CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY,
    user_id_a UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_id_b UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score DOUBLE PRECISION NOT NULL,
    reasons_jsonb JSONB,
    created_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_matches_user_a ON matches(user_id_a);
CREATE INDEX IF NOT EXISTS idx_matches_user_b ON matches(user_id_b);

-- Ensure conversations table has project_id and is_group from our Entity
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id) ON DELETE CASCADE;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS is_group BOOLEAN NOT NULL DEFAULT FALSE;
