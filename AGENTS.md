# AGENTS.md — nest-server (API)

Instructions for **AI coding agents** and developers working in this repository.

## Product context

Business-oriented overview: [`docs/PROJECT_OVERVIEW.md`](docs/PROJECT_OVERVIEW.md).  
Full spec index: this file + [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md), [`docs/DOMAIN_MODEL.md`](docs/DOMAIN_MODEL.md), [`docs/SECURITY_NOTES.md`](docs/SECURITY_NOTES.md), [`docs/OPERATIONS.md`](docs/OPERATIONS.md), [`docs/adr/`](docs/adr/).

**Sibling frontend repo:** `cvc-angular` (same doc layout under `docs/`).

## Stack

- NestJS 9, TypeORM 0.3, PostgreSQL
- JWT auth (`@nestjs/jwt`), global guard + `@Public()` opt-out
- Swagger at `/api` (global route prefix for REST: `/api/v1`)

## Setup

```bash
npm install
```

Provide PostgreSQL and required env vars (see [`docs/OPERATIONS.md`](docs/OPERATIONS.md)). Minimum validated at startup: `PG_HOST`, `PG_PORT`, `PG_USERNAME`, `PG_PASSWORD`, `PG_DATABASE`. Also set `JWT_SECRET`, `JWT_EXPIRY` for auth.

## Commands

| Command | Purpose |
|--------|---------|
| `npm run start:dev` | Dev server with watch |
| `npm run build` | Compile to `dist/` |
| `npm run start:prod` | Run `dist/main` |
| `npm test` | Unit tests |
| `npm run migration:run` | Run migrations (uses `dist/database/data-source.js`; build first) |
| `npm run docs:openapi` | Generate `docs/openapi/openapi.json` (needs working DB connection) |

## Layout

| Path | Role |
|------|------|
| `src/main.ts` | Bootstrap, global prefix, Swagger, pipes, filters, global `AuthGuard` |
| `src/app.module.ts` | Root module, env validation (Joi) |
| `src/database/` | TypeORM module (**exported class name:** `DashboardModule` — legacy naming) |
| `src/entities/` | TypeORM entities |
| `src/modules/*` | Feature modules (order, product, customer, auth, user, file, reports, order-source, health) |
| `src/core/` | Interceptors, filters, pagination, shared DTOs/interfaces |

## Conventions

- **Responses:** Controllers return `{ data, metadata }`. `ResponseInterceptor` maps to `GenericResponseDto` (`payload` ← `data`, `metadata` preserved). Frontend often reads `payload` or `data`; keep both sides aligned when changing this.
- **Validation:** `ValidationPipe` global — `whitelist`, `transform`.
- **Public routes:** Use `@Public()` from `src/utils/decorators/no-intercept.decorator.ts`. Changing public vs protected routes is **security-sensitive** (see [`docs/SECURITY_NOTES.md`](docs/SECURITY_NOTES.md)).
- **Database:** `synchronize: false` — use **migrations** only; do not enable sync against shared DBs without explicit approval.

## Testing changes

- Run `npm run build` before `migration:*` scripts that read `dist/`.
- Add or update tests under `*.spec.ts` near the code when behavior changes.

## References

- Postman: `docs/postman_collection`
- OpenAPI: `docs/openapi/` (YAML envelope + README; JSON via `docs:openapi` or `/api-json`)
