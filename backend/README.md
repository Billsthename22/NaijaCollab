# NaijaCollab Backend (Spring Boot)

This module implements the first backend slice for NaijaCollab:
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/logout-all`
- `GET /api/v1/auth/me`
- `GET /api/v1/profiles/me`
- `PATCH /api/v1/profiles/me`
- `POST /api/v1/moderation/reports`
- `GET /api/v1/moderation/reports/mine`
- `POST /api/v1/users/me/export`
- `GET /api/v1/users/me/export`
- `GET /actuator/health`

## Stack
- Java 21
- Spring Boot 3.5
- Spring Security (JWT filter + stateless auth)
- Spring Data JPA
- Flyway migrations
- PostgreSQL (default profile)
- H2 in-memory (local profile for quick start)

## Run

### 1) Local quick start (H2, no external DB required)
```powershell
cd backend
.\mvnw.cmd -Dspring-boot.run.profiles=local spring-boot:run
```

### 2) PostgreSQL mode (default profile)
Set env vars:
```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/naijacollab"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="your_password"
$env:APP_JWT_SECRET="replace-with-32+char-secret"
cd backend
.\mvnw.cmd spring-boot:run
```

## Test
```powershell
cd backend
.\mvnw.cmd test
```

`AuthFlowIntegrationTest` is configured with Testcontainers and runs automatically when Docker is available (`disabledWithoutDocker=true`).

Current test suite includes:
- API contract test (`AuthApiContractTest`)
- Security header assertions (`SecurityHeadersTest`)
- CORS preflight policy assertion (`CorsPolicyTest`)
- Soft-delete behavior assertion (`SoftDeleteBehaviorTest`)
- Integration flow template on PostgreSQL Testcontainers (`AuthFlowIntegrationTest`)

## API Smoke Examples

Register:
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "password":"StrongPass123",
    "username":"naijacreator",
    "displayName":"Naija Creator"
  }'
```

Login:
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "password":"StrongPass123"
  }'
```

Use access token:
```bash
curl http://localhost:8080/api/v1/auth/me \
  -H "Authorization: Bearer <access_token>"
```

Update profile:
```bash
curl -X PATCH http://localhost:8080/api/v1/profiles/me \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "primaryRole":"Producer",
    "stateCode":"LAG",
    "city":"Lagos",
    "onboardingCompleted":true
  }'
```

## Notes
- Access and refresh tokens are returned in response body and also set as HTTP-only cookies.
- Device sessions are tracked in `device_sessions`; `logout-all` revokes active sessions and refresh tokens.
- Moderation report endpoint supports `Idempotency-Key` header for safe retries.
- Security headers include HSTS, CSP, frame options, content-type options, and referrer policy.
- Production-specific CORS origin settings are in `application-prod.properties`.
- Default profile expects PostgreSQL and runs Flyway migrations `V1` through `V5`.
- Migration checklist lives in `backend/MIGRATION_ROADMAP.md`.
- Transaction isolation policy is documented in `backend/TRANSACTION_ISOLATION_POLICY.md`.
- `local` profile uses H2 and disables Flyway for fast local iteration.
