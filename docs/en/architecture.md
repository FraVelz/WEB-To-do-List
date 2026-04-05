# Architecture

High-level structure of **WEB To-Do List** (Next.js App Router).

## Core stack

- **Next.js 16** — routing via App Router (`src/app`).
- **React 19** — components and hooks.
- **TypeScript** — typing across the source tree.
- **Tailwind CSS 4** — styles via `@import "tailwindcss"` and CSS tokens.

## Folder layout (`src/`)

| Folder | Role |
|--------|------|
| `app/` | Routes, layouts, and global styles (`globals.css`). |
| `components/` | Reusable UI: layout (aside, header), primitives (`ui/`). |
| `features/` | Domain-oriented screens or sections (e.g. inbox, notifications). |
| `context/` | React Context providers (modals, sidebar). |
| `hooks/` | Custom hooks (`usePathLink`, etc.). |
| `lib/` | Shared utilities (`utils.ts`). |

## Routes (App Router)

Current routes with a defined page:

| Route | Notes |
|-------|--------|
| `/` | Home / landing. |
| `/inbox` | Inbox. |
| `/today` | “Today” view. |
| `/next` | “Upcoming” view. |
| `/filters` | Filters and labels. |
| `/completed` | Completed tasks. |
| `/notification` | Notifications. |

The sidebar exposes “Add task” and “Search” as buttons; they may be wired to routes or modals as the product evolves.

## Root layout

`src/app/layout.tsx` wraps the app with:

- **Geist** font (CSS variable).
- **`ContextWrapper`** — nests context providers.
- **`Aside`** — collapsible sidebar navigation.
- **`ModalPro`** — global modal layer.

## React contexts

`ContextWrapper` composes (outer → inner):

1. `ModalSearchProvider` — modal search state.
2. `ModalAddTaskProvider` — new-task modal state.
3. `ModalProProvider` — main modal coordination.
4. `AsidebarProvider` — sidebar open/close state.

Client components consume these via dedicated hooks.

## Sidebar navigation

Linked menu items are defined in `src/components/layout/aside-bar/data.ts` (`asideItems`). Icons are imported as SVGs from `aside-bar/icons/`.

## Related docs

- [Getting started](getting-started.md)
- [Design system](design-system.md)

[Versión en español](../es/architecture.md)
