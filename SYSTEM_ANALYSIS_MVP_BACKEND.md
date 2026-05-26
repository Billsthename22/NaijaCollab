# NaijaCollab MVP Backend System Analysis (Revised for Production Risk)

## 1) Executive Position
This backend is now defined as a **Java Spring Boot monolith** for MVP speed with strong foundations for compliance, safety, and payment-readiness.

Non-negotiable launch priorities:
1. Compliance and data governance (NDPR-first, GDPR-compatible).
2. Trust and safety (reporting + moderation actions from Week 1).
3. Payment-readiness in schema (wallet/ledger/disputes in Phase 2 design, not afterthought).
4. Practical performance and operability for Nigerian usage patterns.

## 2) Product Scope (MVP vs Phase 2)
### MVP (Build Now)
- Auth/session management with refresh rotation and multi-device tracking.
- Profile onboarding and portfolio.
- Explore, matching, collaboration requests.
- Projects and messaging (polling-based).
- Notifications (in-app baseline).
- Reporting/moderation intake.
- Data export request workflow.

### Phase 2 (Schema Ready, APIs staged)
- Escrow-capable payment workflows.
- Dispute operations tooling.
- Advanced moderation automation.
- Real-time messaging transport upgrade.

## 3) Regulatory and Data Residency Posture
### Regulatory baseline
- **NDPR**: Nigerian user personal data protection, subject rights, deletion/export controls.
- **GDPR compatibility**: for EU-resident users collaborating on platform.

### Residency posture
- Default primary region: Nigeria/Africa data region where provider supports it.
- If specific regulated partners require stricter localization, isolate workloads by tenant/program.
- Cross-region replication (if used) must exclude restricted classes flagged as local-only.

### Data classification model
Applied to auditable domains (`audit_logs`, `conversations`, moderation and payments metadata):
- `compliance_classification`: `PERSONAL_DATA | SENSITIVE | NON_PERSONAL`
- `contains_personal_data`: boolean
- `retention_policy`: e.g. `STANDARD | LEGAL_HOLD | SHORT_LIVED`

### Subject rights
- Export request endpoint: `POST /api/v1/users/me/export`
- Export request tracking: `GET /api/v1/users/me/export`
- Deletion handled through soft-delete + purge workflow.

## 4) Technology Decision (Implemented Direction)
- Runtime: Spring Boot 3.5, Java 21
- DB: PostgreSQL + Flyway migrations
- Auth: JWT access token + refresh token rotation
- Cache/limits: Redis (rate limits, queue support)
- Storage: S3-compatible object storage for portfolio media
- Queue: Redis-backed worker (Spring scheduled + queue adapter) for async jobs

Rationale: lowest operational complexity with enough structure for growth.

## 5) Domain Model (Updated)
Core baseline already includes and now extends to:

1. Identity/session:
- `users`, `profiles`, `refresh_tokens`, `device_sessions`

2. Discovery and collaboration:
- `skills`, `profile_skills`, `matches`, `collab_requests`

3. Project and communication:
- `projects`, `project_members`, `conversations`, `conversation_members`, `messages`

4. Safety and governance:
- `reported_content`, `moderation_actions`, `user_flags`, `user_safety_scores`, `audit_logs`

5. Portfolio:
- `portfolio_items`, `portfolio_item_files`, `portfolio_views`

6. Notifications:
- `notifications`, `notification_preferences`

7. Compliance and portability:
- `data_subject_requests`

8. Payment-readiness:
- `wallet_accounts`, `ledger_entries`, `payment_intents`, `disputes`

9. Runtime controls:
- `rate_limit_policies`

### Soft-delete and audit strategy
- Soft-delete columns: `deleted_at` on user/profile/portfolio domains.
- High-risk mutations must write `audit_logs`.
- Restoration window policy applies before hard purge.

## 6) API Contract (Current + Required MVP Additions)
### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/logout-all`
- `GET /api/v1/auth/me`

### Compliance and user rights
- `POST /api/v1/users/me/export`
- `GET /api/v1/users/me/export`

### Moderation (Week 1)
- `POST /api/v1/moderation/reports`
- `GET /api/v1/moderation/reports/mine`

### Core product APIs
- Profiles, explore, matches, collab-requests, projects, messages, dashboard (as planned).

## 7) Matching Algorithm (MVP Heuristic, Explicit)
### Candidate filter
Drop users if any is true:
- `status != ACTIVE`
- suspended/risk-blocked by safety score
- inactive beyond threshold (e.g. no activity in 45 days)
- blocked relationship exists

### Score formula (0-100)
- Skill overlap: 35%
- Role compatibility: 20%
- Location preference compatibility: 15%
- Activity freshness: 10%
- Portfolio completeness/quality proxy: 10%
- Collaboration responsiveness history: 10%

### Fairness controls
- New creator boost for low-history users (time-decayed).
- Diversity cap to avoid same top creators always dominating results.
- Language preference alignment (`language_preferences`) included in role/location compatibility.

### Delivery
- Recompute daily batch + incremental recompute on profile updates.
- Store reasons in `matches.reasons_jsonb` for transparent UX.

## 8) Messaging UX Contract (Polling MVP)
- Poll interval: **5 seconds** default.
- Adaptive fallback: 10-15 seconds on background/inactive tabs.
- Read receipts: persist `read_at` per message.
- Presence: lightweight `last_seen_at` exposure, not live websocket presence in MVP.
- Typing indicator: deferred to Phase 1.5 unless UX testing says mandatory.

This must be explicit in frontend contract so latency feels intentional, not broken.

## 9) Safety, Abuse and Platform Trust
### Abuse surfaces addressed now
- Collab-request spam
- Scam/catfishing patterns
- Harassment and abusive messaging reports
- IP theft reporting workflow

### Minimum Week-1 controls
- Reporting endpoint live.
- `reported_content` intake + status lifecycle.
- `user_flags` and `user_safety_scores` updated by rule engine hooks.
- Rate limits per user/per IP/per route policy.

### Enforcement hooks
- Auto-throttle on high-risk behavior score.
- Moderator action writes: `moderation_actions`.
- All moderation actions auditable.

## 10) Payments Phase 2 (Not Optional, Designed Now)
### Scope stance
Payments are **Phase 2 implementation**, but schema is already present to avoid core table rewrites.

### Model rules
- Multi-currency in minor units (`NGN`, `USD`, etc).
- Immutable double-entry-friendly `ledger_entries`.
- `payment_intents` state machine supports escrow flag.
- `disputes` linked to intents with workflow statuses.

### Integrations
- Provider adapter abstraction for Paystack/Flutterwave/interswitch.
- Webhook idempotency and signature verification mandatory in Phase 2.

## 11) Authentication and Session Security
- Argon2id password hashing.
- Access JWT short TTL + refresh rotation.
- `device_sessions` records phone/desktop sessions.
- `logout-all` endpoint implemented for account compromise response.
- Anomalous login detection plan:
  - geovelocity mismatch risk flag
  - unusual device fingerprint
  - rapid failed auth attempts

## 12) Rate Limit Strategy (Config-driven)
No hardcoded limits in business logic. Use `rate_limit_policies`.

Initial policy examples:
- `auth_login_ip`: 10/min
- `auth_login_user`: 5/min
- `auth_register_ip`: 5/10min
- `messages_send_user`: 120/hour
- `collab_request_user`: 30/day
- `collab_request_target_user`: 10/day per target

Shared-IP handling:
- combine IP + account limits to reduce cybercafe false positives.
- step-up challenge path for high-volume legitimate recruiters.

## 13) Portfolio and Media Contract
Portfolio is first-class:
- `portfolio_items` metadata
- `portfolio_item_files` object references
- `portfolio_views` analytics

S3 object key convention:
- `{user_id}/{portfolio_item_id}/{uuid}-{sanitized_filename}`

CDN required for media delivery once public traffic begins.

## 14) Notifications and Delivery State
Tables cover:
- user preferences (`notification_preferences`)
- event payload and lifecycle (`notifications`)

Delivery states:
- `PENDING -> SENT -> DELIVERED -> READ`
- retries tracked with capped backoff; dead-letter on repeated failure

## 15) Infrastructure and Scaling Triggers
### Launch baseline
- 1 app service + managed Postgres + managed Redis + object storage + CDN.

### Operational thresholds
- Slow query threshold: 200ms (log + triage).
- Trigger read-replica evaluation: sustained >1000 concurrent users or primary CPU saturation.
- Queue lag alarm threshold defined per job type.

### Caching focus
- Explore and matches query responses
- Skill taxonomy lookups
- Notification counts

## 16) Testing Strategy (Concrete)
### Functional
- Unit + integration + API contract tests.
- E2E critical journeys: register/login/onboard/match/request/message/report/export.

### Security
- IDOR, auth bypass, token replay, rate-limit bypass, injection payloads.

### Performance
- Load tests for `/explore` and messaging polling endpoints.
- Staging synthetic load target: 10K users simulation with realistic request distribution.

### Regional correctness
- Currency formatting and minor-unit handling (NGN primary).
- Nigerian state/city validation.
- Language preference parsing and filtering behavior.

## 17) Skill Taxonomy Governance
Policy:
- Admin-curated base taxonomy + controlled user suggestions.
- Versioned skill records (`slug`, category/subcategory, active flag).
- Backward-compatible renames via mapping table (Phase 1.5 if needed).

Initial seed set must include Nigerian creative roles and tooling vocabulary.

## 18) Username/Identity Lifecycle Policy
- Unique username retained for **30 days** after deletion request.
- During retention window: cannot be claimed by new account.
- After retention expiry and purge: reclaim eligible.
- Email reuse rules follow deletion/legal-hold state and fraud safeguards.

## 19) Delivery Timeline (First to End)
### Day 1-2: Kickoff and contract freeze
- Confirm scope, risk register, acceptance criteria.
- Freeze API and schema v1 + critical v2 compliance/safety extensions.

### Week 1: Security, compliance, moderation minimum
- Auth/session + device sessions + logout-all.
- Reporting endpoint and moderation intake model.
- Data export request pipeline.
- Audit logging coverage for identity and moderation actions.

### Week 2: Discovery and matching quality
- Explore/match/collab endpoints.
- Implement explicit heuristic and seed-data validation.
- Dashboard/activity integration.

### Week 3: Projects, messaging, notifications
- Projects and membership lifecycle.
- Messaging APIs with polling contract + read receipts.
- Notification preference and delivery state integration.

### Week 4: Hardening sprint
- Rate-limit policy enforcement end-to-end.
- Perf tests (`/explore`, `/messages`) and DB tuning.
- Abuse rules tuning and incident runbooks.
- Compliance checklist signoff (NDPR rights, deletion/export pathways).

### Week 5-6: Controlled launch and stabilization
- Canary rollout, daily SRE/QA triage.
- Fix top-severity defects and scale bottlenecks.
- Lock Phase 2 payments implementation backlog with schema already in place.

## 20) Go/No-Go Checklist
Do not launch unless all are green:
1. NDPR/GDPR controls documented and test-verified.
2. Moderation report flow operational.
3. Matching quality baseline validated with seed users.
4. Rate limits enforced with policy table.
5. Export request flow working.
6. Multi-device session revoke (`logout-all`) working.
7. Audit trails present for critical actions.
