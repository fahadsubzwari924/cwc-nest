# ADR 0001: Record architecture decisions

- **Status:** Accepted
- **Date:** 2026-04-12

## Context

The API will evolve (auth, contracts, persistence). Without a lightweight log, reasoning is buried in PRs and chat.

## Decision

Use **Architecture Decision Records** in `docs/adr/` for decisions that are non-obvious or costly to change.

## Consequences

- **Positive:** Onboarding and AI-assisted work can cite stable rationale.
- **Negative:** Small overhead to write ADRs; avoid documenting trivial choices.
