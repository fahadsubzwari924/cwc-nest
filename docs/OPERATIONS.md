# Operations — nest-server

Runbook for **local development** and **deployment** of the API. Frontend deploy notes: `cvc-angular/docs/OPERATIONS.md` and `cvc-angular/docs/DEPLOYMENT_SETUP.md`.

---

## Environment variables

Copy **`.env.example`** to **`.env`** and fill in values (do not commit `.env`).

### Required at startup (validated in `app.module.ts`)

| Variable | Purpose |
|----------|---------|
| `PG_HOST` | PostgreSQL host |
| `PG_PORT` | PostgreSQL port (number) |
| `PG_USERNAME` | DB user |
| `PG_PASSWORD` | DB password |
| `PG_DATABASE` | Database name |

### Required for auth

| Variable | Purpose |
|----------|---------|
| `JWT_SECRET` | Symmetric key for signing JWTs |
| `JWT_EXPIRY` | Expiry string for `JwtModule` (e.g. `7d`) |

### Optional / runtime

| Variable | Purpose |
|----------|---------|
| `PORT` | HTTP port (default **3000** if unset) |

### Cloudinary (file uploads)

Used by `CloudinaryProvider` (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`). Required when exercising `POST /files/upload` and product flows that store images.

---

## Local development

```bash
npm install
npm run start:dev
```

Ensure PostgreSQL is reachable and SSL settings in `database.module.ts` match your environment (hosted DBs often require SSL; local Postgres may not).

---

## Build and production process

```bash
npm run build
npm run start:prod
```

---

## Database migrations

Migrations are configured in TypeORM; **`synchronize` is false** — apply schema changes via migrations.

```bash
npm run build
npm run migration:run
```

Scripts use `dist/database/data-source.js` — **build before running** `migration:run` / `migration:revert`.

Authoring:

- `npm run migration:generate -- -n YourMigrationName` (after build, with DB connection)
- `npm run migration:create -- src/database/migrations/YourMigrationName`

---

## Health check

- **`GET /api/v1/health`** (public) — use for load balancers or uptime monitors.

---

## API documentation

- **Swagger UI:** `{origin}/api`
- **OpenAPI JSON:** `{origin}/api-json`

Regenerate committed snapshot: `npm run docs:openapi` (see `docs/openapi/README.md`). Requires a successful app bootstrap (working DB).

---

## Observability

- Global exception filter and interceptor **log to console** in several places; adjust for production log aggregation as needed.
