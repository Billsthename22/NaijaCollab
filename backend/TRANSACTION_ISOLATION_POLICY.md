# Transaction Isolation Policy (MVP)

This document defines the minimum transaction policy by endpoint to avoid lost updates and duplicate critical actions.

## Isolation Levels
- Default: `READ_COMMITTED`
- Safety-critical write paths: `REPEATABLE_READ`
- Payments (Phase 2): `SERIALIZABLE` for ledger mutation paths

## Endpoint Policy
- `POST /api/v1/auth/register`: `REPEATABLE_READ` + unique constraints on email/username
- `POST /api/v1/auth/login`: `READ_COMMITTED`
- `POST /api/v1/auth/refresh`: `READ_COMMITTED` + token revocation write
- `POST /api/v1/auth/logout-all`: `READ_COMMITTED` + bulk revoke
- `PATCH /api/v1/profiles/me`: `REPEATABLE_READ` + `@Version` optimistic locking
- `POST /api/v1/moderation/reports`: `REPEATABLE_READ` + idempotency key + unique guard
- `POST /api/v1/users/me/export`: `READ_COMMITTED` + async job handoff

## Conflict Handling
- Optimistic lock conflicts should return `409 CONFLICT`.
- Duplicate idempotency key with different payload returns `409 CONFLICT`.
- Duplicate idempotency key with same payload returns previous resource.
