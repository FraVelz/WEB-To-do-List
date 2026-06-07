# Architecture

High-level structure of **WEB To-Do List** (Next.js App Router).

## Core stack

- **Next.js 16** — routing via App Router (`src/app`).
- **React 19** — components and hooks.
- **TypeScript** — typing across the source tree.
- **Tailwind CSS 4** — styles via `@import "tailwindcss"` and CSS tokens.
- **Firebase** — Authentication + Firestore (per-user data).

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
| `/logout`       | Sign out (Firebase).     |

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
- **`@modal`** parallel slot and **`Toaster`**.

Routes under `(app)/` share this shell. APIs under `src/app/api/` do not use these UI layouts.

## Demo mode

At `/`, besides Firebase email/password sign-in, **“Try demo mode”** opens the UI without credentials or backend access.

- **Demo mode** — data in `localStorage` (`src/lib/demo/local-store.ts`); local UI only.
- **User mode** — Firebase Auth + Firestore via APIs.
- Mode is stored in `sessionStorage` via [`src/lib/auth-session.ts`](../src/lib/auth-session.ts) and [`useAuthSessionStore`](../src/stores/auth-session-store.ts).
- In demo mode, the `(app)` layout shows [`DemoModeBanner`](../src/features/auth/DemoModeBanner.tsx) and the sidebar profile reads “Demo user”.
- Signing out at `/logout` clears demo session only; real users also call Firebase `signOut`.

## Data (Firebase)

- **Firestore** stores tasks and notifications scoped by `userId` (user mode only).
- API routes under `src/app/api/` verify the Firebase JWT with Admin SDK and delegate to `src/lib/firebase/repositories/`.
- The client sends `Authorization: Bearer <token>` via [`src/services/auth-fetch.ts`](../src/services/auth-fetch.ts).

## Global state (Zustand)

| Store | Role |
| ----- | ---- |
| `useSidebarStore` | Sidebar open/close |
| `useThemeStore` | Light/dark theme |
| `useAuthSessionStore` | Demo / user session |
| `useTasksRefreshStore` | Task list refresh |

## Modals and URL (parallel routes)

Modals use the **`@modal`** slot in `(app)/layout.tsx` (`{ children, modal }`).

| URL | Modal |
| --- | ----- |
| `/add-task` | New task |
| `/search` | Search |
| `/pro` | Pro |

Intercepting routes `(.)add-task`, etc. keep the background page on in-app navigation; `router.back()` or Escape closes the modal. Hook: `useModalNavigation()`.

## Sidebar navigation

Linked menu items are defined in `src/components/layout/aside-bar/data.ts` (`asideItems`). Icons are imported as SVGs
from `aside-bar/icons/`.

## Related docs

- [Getting started](getting-started.md)
- [Design system](design-system.md)

[Versión en español](../es/architecture.md)
