# OpenAPI artifacts

## Canonical interactive docs

With the API running locally (default port **3000**):

- **Swagger UI:** `http://localhost:3000/api`
- **OpenAPI JSON** (Nest default for `SwaggerModule.setup('api', …)`): `http://localhost:3000/api-json`

Use these when exploring paths, trying requests, or exporting the latest document from a **running** server.

## Generated snapshot (`openapi.json`)

Regenerate the committed JSON **after** meaningful API changes (so PRs can show contract diffs):

```bash
# From repo root; requires working PostgreSQL + env (see docs/OPERATIONS.md)
npm run docs:openapi
```

Output: `docs/openapi/openapi.json`.

If the command fails (e.g. DB unreachable or SSL mismatch), fix env or run the API and save `api-json` manually to `docs/openapi/openapi.json`.

## Hand-maintained envelope (`openapi.yaml`)

`openapi.yaml` documents **cross-cutting** contract pieces (success/error envelope, JWT security) that are easy to miss in per-route annotations. **Path-level detail** may lag behind code; prefer Swagger UI or a fresh `openapi.json` for exhaustive paths.
