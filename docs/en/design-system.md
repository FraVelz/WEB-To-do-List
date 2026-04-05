# Design system

How visual styles are defined in **WEB To-Do List**.

## Tailwind CSS v4

Global styles live in `src/app/globals.css`:

- `@import "tailwindcss"` — loads Tailwind v4.
- `@theme inline { ... }` — defines **design tokens** (colors, CSS variables) used by Tailwind utilities and plain CSS.

## Token layers

1. **Primitives** — base values (grays, brand, accents). Prefer not to use them directly in components when a semantic token exists.
2. **Semantic** — names by **role** in the UI: surfaces (`surface-app`, `surface-sidebar`), text (`text-primary`, `text-accent`), interaction (`interactive-primary`, `interactive-hover-soft`), borders (`border-subtle`), etc.

You will see classes such as:

- `bg-surface-app`, `bg-surface-sidebar`
- `text-text-primary`, `text-text-accent`
- `bg-interactive-primary`, `hover:bg-interactive-hover-soft`

These map to variables declared in `@theme`.

## Typography

The root layout uses **Geist** (Google Fonts) via `next/font` in `layout.tsx` with the `--font-geist-sans` variable.

## Dark mode

The current palette targets a **dark** look (dark gray backgrounds, light text). If you add a light theme, extend tokens and/or `dark:` variants consistently.

## Good practices

- Add new colors as variables in `@theme` and name them by **meaning**, not only by hue.
- Avoid scattering raw hex/rgb across files; keep tokens as the single source of truth.
- Keep **tailwindcss v4** and **@tailwindcss/postcss** aligned (see [Development](development.md)).

## Related docs

- [Architecture](architecture.md)
- [Development](development.md)

[Versión en español](../es/design-system.md)
