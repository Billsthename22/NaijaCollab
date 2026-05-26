# Flyway Migration Roadmap

This file is the table-to-migration checklist used to prevent schema drift between code and Flyway.

## V1__init.sql (Auth Core)
- `users`
- `profiles`
- `refresh_tokens`

## V2__compliance_safety_payments_readiness.sql (Compliance + Product Readiness)
- `audit_logs`
- `data_subject_requests`
- `device_sessions`
- `skills`
- `profile_skills`
- `conversations`
- `portfolio_items`
- `portfolio_item_files`
- `portfolio_views`
- `notifications`
- `notification_preferences`
- `user_safety_scores`
- `reported_content`
- `moderation_actions`
- `user_flags`
- `wallet_accounts`
- `ledger_entries`
- `payment_intents`
- `disputes`
- `rate_limit_policies`

Alterations in V2:
- `users.deleted_at`
- `profiles.deleted_at`
- `profiles.country_code`
- `profiles.language_preferences`
- `profiles.kyc_tier`
- `profiles.kyc_status`

## V3__idempotency_and_safety_constraints.sql (Execution Safety)
- `idempotency_keys`
- `reported_content.idempotency_key`
- unique index on `(reporter_user_id, idempotency_key)` for idempotent moderation intake

## V4__optimistic_lock_columns.sql (Concurrency Control)
- `users.version`
- `profiles.version`
- `reported_content.version`

## V5__seed_rate_limit_policies.sql (Operational Baseline)
- seed entries for:
  - `auth_login_ip`
  - `auth_login_user`
  - `auth_register_ip`
  - `moderation_report_ip`
  - `moderation_report_user`

## Rules
1. No production schema change without Flyway migration.
2. `spring.jpa.hibernate.ddl-auto` must stay `validate` outside test/local quick profile.
3. Every new entity must be mapped to exactly one migration entry here before merge.
