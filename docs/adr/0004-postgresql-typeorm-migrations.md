# ADR 0004: PostgreSQL with TypeORM and explicit migrations

- **Status:** Accepted
- **Date:** 2026-04-12

## Context

The product needs **relational integrity** (orders, customers, line items, many-to-many sources). Schema changes must be **reviewable** and **repeatable** across environments.

## Decision

Use **PostgreSQL** with **TypeORM**, **`synchronize: false`**, and **versioned migrations** under `src/database/migrations/`. Runtime migration execution is via CLI scripts targeting compiled `data-source` in `dist/`.

## Consequences

- **Positive:** Safe evolution of production schema; clear history in migration files.
- **Negative:** Developers must run **build** before some migration commands; local DB must match SSL/network expectations in `database.module.ts`.
- **Note:** The Nest module exporting TypeORM config is named **`DashboardModule`** — legacy naming; see `database.module.ts`.

## Alternatives considered

- **`synchronize: true`:** Rejected for production safety.
- **Prisma / Drizzle / raw SQL:** Viable but would be a large migration from current TypeORM investment.
