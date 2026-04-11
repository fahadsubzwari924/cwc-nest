# Security notes — nest-server

Internal staff application — **not** a public consumer product. Document **assumptions** and **exposed surface** so changes are deliberate.

**Frontend:** `cvc-angular/docs/SECURITY_NOTES.md` (browser / token handling).

---

## Authentication model

- **JWT** in `Authorization: Bearer <token>` after `POST /auth/login`.
- **Global `AuthGuard`**; routes opt out with `@Public()` (`src/utils/decorators/no-intercept.decorator.ts`).
- Passwords for users are stored **hashed** (bcrypt) in `UserService` / auth flow.

---

## Public (unauthenticated) HTTP surface

These endpoints are intentionally reachable **without** a JWT. Verify in code before relying on this list:

| Area | Risk if misused |
|------|------------------|
| `POST /auth/login` | Expected public; rate-limit at edge in production if needed. |
| `POST /users` | **User creation is public** — anyone who can reach the API can create a user unless network rules block it. Treat as bootstrap only; restrict at network or add admin-only creation if requirements change. |
| `POST /files/upload` | **Public upload** — abuse could cause cost/storage issues; validate size at reverse proxy and monitor Cloudinary. |
| `GET /orders/:id/pdf` | **Public PDF** — order id may be enumerable; confirm this matches business risk (often should be authenticated or use signed URLs). |
| `GET /health` | Expected for probes. |

Any new `@Public()` route should be **reviewed** and listed here.

---

## CORS

`enableCors()` is applied **without** origin restriction in `main.ts`. Acceptable for many internal tools; for production on the public internet, prefer **explicit allowed origins** aligned with the Angular app URL.

---

## Transport and data

- PostgreSQL connection uses SSL options in `database.module.ts` (`rejectUnauthorized: false` style) — typical for managed DBs; align with your org’s TLS policy.
- Request body limit **10mb** for JSON and urlencoded (large payloads / uploads).

---

## File uploads

- Cloudinary `allowed_formats`: **pdf, png, jpg, tiff** (see `FileController`).
- Multer handles multipart parsing; validate business rules in service layer when extending.

---

## Authorization (roles)

- **No fine-grained RBAC** in the codebase as of this writing: any authenticated staff user can access protected business endpoints. Add roles/claims in JWT and guards if multi-tenant or separation-of-duty is required.

---

## Secrets

- Never commit `.env` or production credentials.
- Rotate `JWT_SECRET` and DB passwords on compromise; invalidate outstanding JWTs by changing secret (users must re-login).
