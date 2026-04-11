# ADR 0003: Uniform HTTP success envelope via interceptor

- **Status:** Accepted
- **Date:** 2026-04-12

## Context

Clients benefit from a **consistent JSON shape** for successes (data + optional metadata). Hand-writing the same structure in every controller is error-prone.

## Decision

Use a global **`ResponseInterceptor`** that wraps controller results in **`GenericResponseDto`**, mapping controller `{ data, metadata }` to client fields **`payload`** and **`metadata`** (implementation maps through an internal `records` property in the DTO constructor).

Errors are shaped similarly via **`CustomExceptionFilter`** with an `error` field.

## Consequences

- **Positive:** Predictable parsing for SPA and scripts; metadata can carry pagination or contextual ids.
- **Negative:** Controllers must return `{ data, metadata }` consistently; some client code uses **`data` or `payload`** interchangeably — coordinate changes across **nest-server** and **cvc-angular**.
- **Note:** Raw responses (e.g. some `@Res()` PDF handlers) bypass the interceptor for the body stream.

## Alternatives considered

- **Per-endpoint wrapping:** More explicit but repetitive.
- **Standard only on subset of routes:** Inconsistent client experience.
