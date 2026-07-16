# ADR 0001 — Camino A Lab (no productize)

- **Status:** Accepted
- **Date:** 2026-07-15
- **Ticket:** L6-1
- **Decision makers:** Fravelz (Lab agent plan 12 Oleada 4)

## Context

Guide `06-web-todo-list.md` offers two paths:

| Path                   | Intent                                                                           |
| ---------------------- | -------------------------------------------------------------------------------- |
| **Camino A — Lab**     | Explicit learning lab (stack, UX densas, tests). No collaborative product pitch. |
| **Camino B — Product** | Workspaces, membership roles, invites, activity log, authz.                      |

Oleada 4 (plan 12 §6.L) caps labs at an honest ~7–8 scorecard. Shipping Camino B half-done (invites without roles, sharing without authz) would inflate “producto” without evidence.

## Decision

**Camino A only.** This repo is a **Lab / Demo** for task UI + Firebase/local dual storage craft.

### Frozen (out of scope)

- Workspace / membership / roles (`owner | editor | viewer`)
- Sharing, invites, assignees
- Activity log / audit feed
- Soft-delete recovery product flows
- Billing / “Pro” as a real monetization path (UI demo copy only)
- Pitching this app as a hired flagship beside ICFES / Marcadores

### In scope (Lab craft)

- Inbox / Today / Next task views
- Labels on tasks
- Demo mode with **browser-local** store (never prod Firestore)
- Domain tests, empty states, basic list keyboard a11y
- README and docs that say **Lab** explicitly

## Consequences

- **Positive:** Hiring managers see an honest lab in ~2 minutes; no half-authz traps.
- **Positive:** Effort goes to tests, empties, demo isolation, a11y — not feature packing.
- **Negative:** Scorecard domain/ops/hired stay below product tracks by design (techo ~7–8).
- **Revisit:** Only with a new ADR that opens Camino B and a full authz design.

## Alternatives considered

| Option                              | Why not                                                            |
| ----------------------------------- | ------------------------------------------------------------------ |
| Camino B now                        | Exceeds Oleada 4 lab charter; needs membership + invite invariants |
| Soft Camino B (share without roles) | Explicit antipattern in guide §4                                   |
| Keep ambiguous README               | Misleads portfolio / scorecard honesty                             |

## References

- Plan 12 §6.L To-Do L6-1…L6-5
- Guide `06-web-todo-list.md` §3–§5 Camino A
- Demo store: `src/lib/demo/local-store.ts`
