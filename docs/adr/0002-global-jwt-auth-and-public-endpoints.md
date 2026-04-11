# ADR 0002: Global JWT authentication with explicit public endpoints

- **Status:** Accepted
- **Date:** 2026-04-12

## Context

Staff need authenticated access to most business APIs. A few flows (login, health, selected utilities) must stay reachable without a token.

## Decision

Apply **`AuthGuard` globally** in `main.ts` and mark exceptions with **`@Public()`** metadata (`IS_PUBLIC_KEY`), read by the guard via `Reflector`.

## Consequences

- **Positive:** New controllers are **secure by default**; forgetting a guard on a new route is less likely.
- **Negative:** Developers must remember `@Public()` for login, health, and any intentional anonymous endpoints. **Security reviews** should include grep for `@Public()`.
- **Note:** Some public routes (e.g. user creation, file upload) carry **abuse risk** — document in `SECURITY_NOTES.md` and restrict at network layer if needed.

## Alternatives considered

- **Per-route guards only:** Higher risk of missing auth on new endpoints.
- **Separate public API app:** Clearer isolation but higher operational cost for a small team.
