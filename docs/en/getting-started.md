# Getting started

How to install and run **WEB To-Do List** on your machine.

## Requirements

- **Node.js** 18 or newer (current LTS recommended).
- **pnpm** (package manager used in this repo). Alternatives: `npm` or `yarn`.
- A **Firebase** project with Authentication (Email/Password) and Firestore.

## Installation

From the repository root:

```bash
pnpm install
cp .env.example .env
```

Fill in `.env` with your Firebase web config and Admin service account credentials.

### Firebase — minimum setup

1. Create a project in [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication → Email/Password**.
3. Create **Firestore** and deploy `firestore.rules` (client access denied; the app uses Admin SDK on the server).
4. Copy web config to `NEXT_PUBLIC_FIREBASE_*` and the service account to `FIREBASE_SERVICE_ACCOUNT_JSON` (or separate fields).

> **Demo mode:** does not require Firebase. It uses browser `localStorage` to explore the UI.

## Available scripts

| Command             | Description                                                           |
| ------------------- | --------------------------------------------------------------------- |
| `pnpm dev`          | Development server at [http://localhost:3000](http://localhost:3000). |
| `pnpm build`        | Production build (optimized Next.js output).                          |
| `pnpm start`        | Serves the production build (run after `pnpm build`).                 |
| `pnpm lint`         | Run ESLint across the project.                                        |
| `pnpm lint:fix`     | ESLint with auto-fixes where possible.                                |
| `pnpm format`       | Format with Prettier.                                                 |
| `pnpm format:check` | Check formatting without writing files.                               |

## Local development

1. Install dependencies: `pnpm install`.
2. Start the dev server: `pnpm dev`.
3. Open the URL shown in the terminal (default port 3000).

## Production build

```bash
pnpm build
pnpm start
```

Use this to verify the app compiles and behaves like a deployed environment.

## Related docs

- [Architecture](architecture.md)
- [Development](development.md)

[Versión en español](../es/getting-started.md)
