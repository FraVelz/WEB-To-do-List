# Development

Practices and tooling for working on **WEB To-Do List**.

## Code quality

- **ESLint** — Next.js config (`eslint-config-next`) plus project rules.
- **Prettier** — consistent formatting; `prettier-plugin-tailwindcss` sorts Tailwind classes.

Before a reasonable commit:

```bash
pnpm lint
pnpm format:check
```

## Import aliases

The project uses the `@/` alias pointing at `src/` (see `tsconfig.json`). Example:

```ts
import { ContextWrapper } from '@/context/context-wrapper'
```

## Tailwind and builds

- **`tailwindcss`** must be **v4** together with **`@tailwindcss/postcss`**, matching `@import "tailwindcss"` in
  `globals.css`.
- If the build fails with _Can't resolve 'tailwindcss'_, ensure Tailwind v3 and v4 are not mixed in `package.json`.

## React Compiler

**React Compiler** is enabled in `next.config.ts` (`reactCompiler: true`). Keep components predictable to benefit from
optimizations.

## UI components

There are primitives aligned with common patterns (e.g. `Button`, menus). When adding components:

- Prefer composition and typed props.
- Reuse semantic design tokens (`text-text-primary`, `bg-surface-app`, etc.).

## Troubleshooting

| Symptom                            | What to check                                                                      |
| ---------------------------------- | ---------------------------------------------------------------------------------- |
| Build cannot resolve `tailwindcss` | `tailwindcss` on v4 and `@tailwindcss/postcss` installed.                          |
| Styles not applying                | Classes in files under `src/`; tokens in `@theme` inside `globals.css`.            |
| Context is `undefined` on client   | Tree under `ContextWrapper`; component is `'use client'` if it uses context hooks. |

## Related docs

- [Getting started](getting-started.md)
- [Architecture](architecture.md)

[Versión en español](../es/development.md)
