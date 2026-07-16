# ADR 0002 — Demo store isolated from prod Firebase

- **Status:** Accepted
- **Date:** 2026-07-15
- **Ticket:** L6-4
- **Depends on:** [0001 — Camino A Lab](0001-camino-a-lab.md)

## Context

Antipattern in guide §4: a demo that pollutes the production database (same Firebase project / same user collection as real accounts).

This app has two data paths:

1. **User mode** — Firebase Auth + Firestore via `/api/*` (requires `.env` credentials).
2. **Demo mode** — in-browser `localStorage` key `todo-demo-data-v2` (`src/lib/demo/local-store.ts`).

Client services (`src/services/tasks.ts`, `projects.ts`, `notifications.ts`) short-circuit to the demo store when `isDemoMode()` is true and **must not** call `fetch` / Firestore.

## Decision

- Demo data lives **only** in the browser (`localStorage`). It never writes to Firestore.
- Demo session flag lives in `sessionStorage` (`todo-auth-mode=demo`).
- Firebase Admin / client env vars are **optional** for Lab demos; missing config must not block demo mode.
- No shared `DATABASE_URL`-style prod connection for demo (N/A — Firebase; isolation is mode-gated, not a second project).

## Verification

- Unit tests assert demo `fetchTasks` / mutations do not invoke `fetch`.
- Manual: open DevTools → Application → Local Storage; mutate tasks in demo; confirm no Firestore writes in Network.

## Consequences

- **Positive:** Safe classroom / portfolio demos without scrubbing prod.
- **Negative:** Demo data is device-local and not multi-device sync (acceptable for Lab).

## References

- `src/lib/demo/is-demo-mode.ts`
- `src/lib/demo/local-store.ts`
- `src/services/tasks.ts`
