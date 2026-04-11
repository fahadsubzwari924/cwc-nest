# Architecture Decision Records (ADR)

Short, dated records of **significant** technical decisions for this repo. Format follows common ADR practice (context → decision → consequences).

## Index

| ADR | Title |
|-----|--------|
| [0001](0001-record-architecture-decisions.md) | Record architecture decisions |
| [0002](0002-global-jwt-auth-and-public-endpoints.md) | Global JWT auth and public endpoints |
| [0003](0003-http-response-envelope-via-interceptor.md) | HTTP response envelope via interceptor |
| [0004](0004-postgresql-typeorm-migrations.md) | PostgreSQL with TypeORM migrations |

## When to add an ADR

- A choice is **hard to reverse**, affects **multiple modules**, or **confuses new contributors**.
- Prefer **one decision per file**; keep to about one page.

## Status values

**Proposed** → **Accepted** → **Deprecated** / **Superseded** (link the replacing ADR).
