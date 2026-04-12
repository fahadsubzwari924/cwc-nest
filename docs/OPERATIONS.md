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
| `PG_SSL` | Optional. Set to **`false`** (or `0`, `no`, `off`, `disable`) if Postgres **does not** use TLS. If unset or truthy, the app uses SSL (`rejectUnauthorized: false`) and `sslmode=require`, which matches many hosted databases but fails on plain Postgres without SSL. |

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

Ensure PostgreSQL is reachable. Use **`PG_SSL=false`** in `.env` when the server does not support SSL (see env table above).

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

Scripts use `dist/src/database/data-source.js` (Nest’s compile output) — **build before running** `migration:run` / `migration:revert`. The data source loads **`.env` from the current working directory** (run commands from the `nest-server` repo root so `PG_*` and `PG_SSL` apply).

**Historical dashboard totals:** migration `BackfillOrderTotalsFromLineItems1774100000000` first creates **full row snapshots** in the same database: **`orders_backup_before_1774100000000`** and **`order-items_backup_before_1774100000000`** (data only, no indexes/FKs). If either table already exists, the migration **fails** until you drop it (so an accidental re-run does not overwrite a backup). It then recomputes each order’s **`amount`** and **`quantity`** from **`order-items`**, and sets **`unitCostSnapshot`** where null from **`product.cost`**. Run with `npm run build && npm run migration:run`. This does not correct wrong **per-line quantities** in old rows—only headers and missing snapshots.

**Restore from those backups** (maintenance window, no app traffic). `order_to_sources` is **not** copied; export that table first if you must preserve channel links, or re-attach sources after restore.

```sql
BEGIN;
DELETE FROM order_to_sources;
DELETE FROM "order-items";
DELETE FROM orders;
INSERT INTO orders SELECT * FROM orders_backup_before_1774100000000;
INSERT INTO "order-items" SELECT * FROM "order-items_backup_before_1774100000000";
COMMIT;
```

Then verify data, re-seed `order_to_sources` if needed, and drop the `*_backup_before_*` tables when you no longer need them.

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
