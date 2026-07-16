# WEB To-Do List — Lab

This document is in English. [Versión en español](./README.md)

**Lab / Demo** (Path A). A dense task-UI learning lab with Next.js, Vitest, and a browser-local
demo store — **not** a collaborative product (no sharing, roles, or workspaces).

Decision: [docs/adr/0001-camino-a-lab.md](docs/adr/0001-camino-a-lab.md) · Demo isolation:
[docs/adr/0002-demo-store-isolation.md](docs/adr/0002-demo-store-isolation.md)

<p align="center">
  <img
    src="docs/assets/opengraph-preview.svg"
    alt="To-do Open Graph preview when sharing the link"
    width="720"
  />
</p>

## What it is / is not

| Yes (Lab)                                    | No (frozen)               |
| -------------------------------------------- | ------------------------- |
| Inbox / Today / Next, labels, local projects | Sharing, invites, roles   |
| Demo mode in `localStorage` (no Firestore)   | Hired flagship pitch      |
| ≥10 task/label domain tests                  | Real billing / paid “Pro” |

## Try it

```bash
pnpm install
pnpm dev
```

On `/`, choose **Try demo mode** — browser-local data; the “Lab / Demo mode” banner should stay
visible.

```bash
pnpm test:run
pnpm lint
pnpm build
```

## Docs

- Index: [docs/README.md](docs/README.md)
- ADRs: [docs/adr/README.md](docs/adr/README.md)

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind 4 · Firebase (optional, signed-in mode) · Vitest ·
Radix · Zustand

## License

Apache 2.0 — [Fravelz](https://github.com/fravelz)
