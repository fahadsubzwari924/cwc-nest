# API contract — nest-server

**Canonical machine-readable artifacts**

- **Interactive:** Swagger UI at `/api` (base URL = server root, e.g. `http://localhost:3000/api`).
- **OpenAPI JSON:** `http://localhost:3000/api-json` when the server is running.
- **Repo:** [`openapi/openapi.yaml`](openapi/openapi.yaml) (envelope + shared schemas), [`openapi/README.md`](openapi/README.md) (generation and drift).

**Frontend mirror:** `cvc-angular/docs/API_CONTRACT.md` (integration-focused summary).

---

## Base URL and versioning

- All REST controllers are under **`/api/v1`**.
- Example local base: `http://localhost:3000/api/v1`.

---

## Authentication

- **Scheme:** HTTP Bearer JWT.
- **Header:** `Authorization: Bearer <accessToken>`
- **Token issuance:** `POST /auth/login` with email + password (public). Response includes `accessToken` (and user), then wrapped by the global response envelope.

**Global guard:** Unless the handler or class is marked `@Public()`, requests without a valid JWT receive `401 Unauthorized`.

---

## Success response envelope

Controllers typically return an object `{ data: T, metadata?: object }`. The global **`ResponseInterceptor`** converts this to `GenericResponseDto`:

| Internal construction | Client JSON field |
|----------------------|-------------------|
| `data` | `payload` (internally mapped via constructor `records`) |
| `metadata` | `metadata` |
| — | `error` usually absent or null on success |

Clients (including the Angular app) sometimes read **`response.payload` or `response.data`** for historical compatibility — preserve consistency when changing either tier.

---

## Error response envelope

`CustomExceptionFilter` responds with the same DTO shape and HTTP status from the exception (e.g. 400, 401, 404, 500). The **`error`** field carries a message string; inspect status code for semantics.

---

## Pagination and sorting (list endpoints)

Query parameters (see `PaginationAndSortingDTO`):

| Parameter | Default | Notes |
|-----------|---------|--------|
| `page` | `1` | 1-based |
| `pageSize` | `10` | |
| `sortBy` | `createdAt` | Column name (entity-specific) |
| `sortOrder` | `DESC` | `ASC` or `DESC` |
| `filters` | optional | String; interpretation depends on module |

List responses that use the shared pagination helper expose metadata including **`totalItems`**, **`page`**, **`pageSize`**, **`sortBy`**, **`sortOrder`** (`IPaginationResponseMeta`).

---

## Public endpoints (no JWT)

Exact list is defined in code via `@Public()`. As of the spec authoring pass, these include:

| Method | Path (under `/api/v1`) | Purpose |
|--------|-------------------------|---------|
| POST | `/auth/login` | Staff login |
| POST | `/users` | Create user (bootstrap) |
| GET | `/orders/:id/pdf` | Order PDF download (implementation currently minimal) |
| POST | `/files/upload` | Upload to Cloudinary |
| GET | `/health` | Health check |

**Security note:** Treat changes to this set as high-risk; see [`SECURITY_NOTES.md`](SECURITY_NOTES.md).

---

## Bodies and validation

- **Content-Type:** `application/json` unless uploading files (`multipart/form-data`).
- **Validation:** `class-validator` on DTOs; unknown properties are stripped (`whitelist: true`).

---

## Related modules (quick map)

| Prefix | Module |
|--------|--------|
| `/auth` | Auth |
| `/users` | User |
| `/customers` | Customer |
| `/products` | Product |
| `/orders` | Order |
| `/order-sources` | OrderSource |
| `/reports` | Reports (+ `GET .../dashboard/stats`) |
| `/files` | File |
| `/health` | Health |

For field-level schemas, prefer Swagger or generated OpenAPI JSON.
