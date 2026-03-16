# Railway Setup Guide

Step-by-step manual guide to set up the NestJS app and PostgreSQL on Railway, and migrate data from Vercel Postgres.

---

## Part 1 — Create Railway Project

1. Log in to Railway:
   ```bash
   railway login
   ```

2. From the project root, create and link a new project:
   ```bash
   railway init
   ```
   Follow the prompts (create new project, name it if desired). This creates a project and writes `RAILWAY_PROJECT_ID` (or similar) so the CLI is linked.

3. If you need to link an existing project later:
   ```bash
   railway link
   ```
   Select the project and environment (e.g. production).

---

## Part 2 — Add PostgreSQL to the Project

1. Open the [Railway Dashboard](https://railway.app/dashboard).

2. Open your project, then click **New** → **Database** → **PostgreSQL**.

3. Name the service (e.g. `cwc-db`) and confirm. Railway will provision PostgreSQL and expose connection variables.

---

## Part 2a — Add the Back-end (NestJS) Service

You need a **separate service** in the same project for the NestJS app. The deploy script (`railway up`) deploys to this service; it does not create it.

1. In the [Railway Dashboard](https://railway.app/dashboard), open your project (the one that has the PostgreSQL service).

2. Click **New** → **Empty Service** (or **GitHub Repo** if you prefer to connect the repo; for CLI deploys, Empty Service is enough).

3. Name the service (e.g. `nest-server` or `cwc-api`). This is the service that will run your app.

4. **Link the CLI to this service** before deploying. From your repo root:
   ```bash
   railway link
   ```
   Select the same project and the **environment** (e.g. production), then select **this app service** (not the PostgreSQL service).

5. From now on, when you run `./scripts/deploy.sh`, the CLI will deploy to this service. If you have multiple services and deploy goes to the wrong one, run `railway service` and choose the NestJS app service, then run the deploy script again.

---

## Part 3 — Get Railway DB Credentials and Update .env

1. In the dashboard, open the **PostgreSQL** service.

2. Go to the **Connect** or **Variables** tab and copy the connection details. Railway usually exposes:
   - `PGHOST` → use as `PG_HOST`
   - `PGPORT` → use as `PG_PORT`
   - `PGUSER` → use as `PG_USERNAME`
   - `PGPASSWORD` → use as `PG_PASSWORD`
   - `PGDATABASE` → use as `PG_DATABASE`

3. Copy the **Postgres connection URL** if shown (for `DATABASE_URL` and for `pg_restore`).

4. Update your **local `.env`** with these Railway values:
   - `PG_HOST`
   - `PG_PORT`
   - `PG_USERNAME`
   - `PG_PASSWORD`
   - `PG_DATABASE`
   - `DATABASE_URL` (e.g. `postgres://user:password@host:port/database?sslmode=require`)

   Leave other variables (JWT, Cloudinary, etc.) unchanged unless you want to switch them for production.

---

## Part 4 — Migrate Existing Data from Vercel Postgres (One-Time)

Do this only once, before the first deploy, to copy data from Vercel into Railway Postgres.

1. **Dump from Vercel** (use your actual Vercel credentials from your current `.env` or Vercel dashboard):
   ```bash
   pg_dump "postgres://default:<VERCEL_PASSWORD>@ep-falling-lab-56304030-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require" \
     --no-owner --no-acl -F c -f vercel_backup.dump
   ```

2. **Restore to Railway** (use the Railway Postgres URL from Part 3):
   ```bash
   pg_restore --no-owner --no-acl \
     -d "postgres://<RAILWAY_USER>:<RAILWAY_PASSWORD>@<RAILWAY_HOST>:<PORT>/<DATABASE>?sslmode=require" \
     vercel_backup.dump
   ```

3. **If the restore creates the schema**, TypeORM’s `migrations` table may not exist yet. Before running the deploy script for the first time you have two options:
   - **Option A:** Let the deploy script run `migration:run`. If the initial migration only contains small changes (e.g. index/constraint tweaks), it may apply cleanly. If it fails because tables already exist, use Option B.
   - **Option B:** Manually mark the initial migration as already executed so TypeORM skips it. Connect to the Railway DB and run (use the exact migration name from `src/database/migrations/`, e.g. `1773610324113-InitialSchema1773610324113`):
     ```sql
     CREATE TABLE IF NOT EXISTS migrations (
       id       SERIAL PRIMARY KEY,
       timestamp bigint NOT NULL,
       name     character varying NOT NULL
     );
     INSERT INTO migrations (timestamp, name) VALUES (1773610324113, 'InitialSchema1773610324113');
     ```
     Then run the deploy script; it will only run any newer migrations.

4. After a successful restore, your **production** DB is now on Railway. You can decommission Vercel Postgres when ready.

---

## Part 5 — First Deploy

1. Ensure your local `.env` has Railway DB credentials (from Part 3).

2. From the project root:
   ```bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh
   ```
   The script will: check Railway auth, build, sync `.env` to Railway, run migrations, deploy with `railway up`, and run seeds if the seeds directory and script exist.

3. If you have multiple services (e.g. app + DB), ensure the deploy targets the **NestJS service**. You can select the service with:
   ```bash
   railway service
   ```
   then run `./scripts/deploy.sh` again.

---

## Part 6 — Verify

1. Check logs:
   ```bash
   railway logs
   ```

2. Open the deployed app:
   ```bash
   railway open
   ```

3. Call your API (e.g. `GET /api/v1` or a health endpoint) to confirm the app and DB are working.

---

## Future Deploys

For every subsequent deploy (after code or env changes), run from the project root:

```bash
./scripts/deploy.sh
```

This will: sync any new or updated env vars from `.env` to Railway, run any pending migrations, deploy the app, and run seeds if present. No need to run pg_dump/pg_restore again; the database is already on Railway.
