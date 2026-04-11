# CWC — API (NestJS)

**Customize With Class** backend: REST API (`/api/v1`), PostgreSQL via TypeORM, JWT auth, Swagger at `/api`.

## Quick start

```bash
cp .env.example .env   # then edit with real values
npm install
npm run start:dev
```

## Documentation

| Doc | Purpose |
|-----|---------|
| [`AGENTS.md`](AGENTS.md) | Setup, commands, layout — **start here for devs & AI agents** |
| [`docs/PROJECT_OVERVIEW.md`](docs/PROJECT_OVERVIEW.md) | Business context |
| [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md) | HTTP contract, envelope, pagination |
| [`docs/DOMAIN_MODEL.md`](docs/DOMAIN_MODEL.md) | Entities and enums |
| [`docs/OPERATIONS.md`](docs/OPERATIONS.md) | Env vars, migrations, deploy notes |
| [`docs/SECURITY_NOTES.md`](docs/SECURITY_NOTES.md) | Auth and public surface |
| [`docs/openapi/`](docs/openapi/) | OpenAPI YAML + how to export JSON |
| [`docs/adr/`](docs/adr/) | Architecture Decision Records |

**Frontend repo:** `cvc-angular` (sibling).

## Useful commands

```bash
npm run build
npm run start:prod
npm run migration:run    # after build; see docs/OPERATIONS.md
npm run docs:openapi     # needs working DB — see docs/openapi/README.md
```

Live API docs: **`http://localhost:3000/api`** (when server is running).

---

<p align="center">
  <a href="http://nestjs.com/" target="_blank">NestJS</a> powers this service.
</p>
