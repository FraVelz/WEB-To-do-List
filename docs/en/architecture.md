# Architecture

High-level structure of **WEB To-Do List** (Next.js App Router).

## Core stack

- **Next.js 16** — routing via App Router (`src/app`).
- **React 19** — components and hooks.
- **TypeScript** — typing across the source tree.
- **Tailwind CSS 4** — styles via `@import "tailwindcss"` and CSS tokens.

## Folder layout (`src/`)

| Folder        | Role                                                             |
| ------------- | ---------------------------------------------------------------- |
| `app/`        | Routes, layouts, and global styles (`globals.css`).              |
| `components/` | Reusable UI: layout (aside, header), primitives (`ui/`).         |
| `features/`   | Domain-oriented screens or sections (e.g. inbox, notifications). |
| `context/`    | React Context providers (modals, sidebar).                       |
| `hooks/`      | Custom hooks (`usePathLink`, etc.).                              |
| `lib/`        | Shared utilities (`utils.ts`).                                   |

## Routes (App Router)

Current routes with a defined page:

| Route           | Notes                    |
| --------------- | ------------------------ |
| `/`             | Sign-in or demo mode (public zone). |
| `/inbox`        | Inbox.                   |
| `/today`        | “Today” view.            |
| `/next`         | “Upcoming” view.         |
| `/filters`      | Filters and labels.      |
| `/completed`    | Completed tasks.         |
| `/notification` | Notifications.           |
| `/profile`      | Account profile.         |
| `/billing`      | Billing.                 |
| `/settings`     | Settings.                |
| `/logout`       | Sign out (simulated).    |

The sidebar exposes “Add task” and “Search” as buttons; they may be wired to routes or modals as the product evolves.

## Layouts

The **`(public)`** and **`(app)`** route groups organize layouts without changing URLs.

### Root layout — `src/app/layout.tsx`

- **Geist** font (CSS variable).
- `globals.css` and global metadata.
- Wraps `{children}` only; no sidebar or app modals.

### Public layout — `src/app/(public)/layout.tsx`

- Centered screen for login at `/`.
- No `Aside`, `ContextWrapper`, or app modals.

### App layout — `src/app/(app)/layout.tsx`

- **`ContextWrapper`** — context providers.
- **`Aside`** — collapsible sidebar navigation.
- **`ModalPro`**, **`ModalAddTask`**, **`ModalSearch`**, **`Toaster`**.

Routes under `(app)/` share this shell. APIs under `src/app/api/` do not use these UI layouts.

## Demo mode

At `/`, besides the simulated sign-in form, **“Try demo mode”** opens `/inbox` without credentials.

- Mode (`demo` or `user`) is stored in `sessionStorage` via [`src/lib/auth-session.ts`](../src/lib/auth-session.ts) and [`useAuthSessionStore`](../src/stores/auth-session-store.ts).
- In demo mode, the `(app)` layout shows [`DemoModeBanner`](../src/features/auth/DemoModeBanner.tsx) and the sidebar profile reads “Demo user”.
- Signing out at `/logout` clears the stored mode.

## React contexts

`ContextWrapper` (app layout only) composes:

1. `ModalProProvider` — main modal coordination.
2. `AsidebarProvider` — sidebar open/close state.

Task and search modals are driven by `ui-store` (Zustand). Client components consume contexts and the store via dedicated
hooks.

## Sidebar navigation

Linked menu items are defined in `src/components/layout/aside-bar/data.ts` (`asideItems`). Icons are imported as SVGs
from `aside-bar/icons/`.

## Related docs

- [Getting started](getting-started.md)
- [Design system](design-system.md)

[Versión en español](../es/architecture.md)
