# Arquitectura

Visión general de la estructura de **WEB To-Do List** (Next.js App Router).

## Stack principal

- **Next.js 16** — enrutamiento con App Router (`src/app`).
- **React 19** — componentes y hooks.
- **TypeScript** — tipado en todo el código fuente.
- **Tailwind CSS 4** — estilos con `@import "tailwindcss"` y tokens en CSS.

## Organización de carpetas (`src/`)

| Carpeta       | Rol                                                                 |
| ------------- | ------------------------------------------------------------------- |
| `app/`        | Rutas, layouts y estilos globales (`globals.css`).                  |
| `components/` | UI reutilizable: layout (aside, header), primitivos (`ui/`).        |
| `features/`   | Pantallas o bloques de dominio (por ejemplo inbox, notificaciones). |
| `context/`    | Proveedores de React Context (modales, barra lateral).              |
| `hooks/`      | Hooks personalizados (`usePathLink`, etc.).                         |
| `lib/`        | Utilidades compartidas (`utils.ts`).                                |

## Rutas (App Router)

Rutas actuales con página definida:

| Ruta            | Notas                                      |
| --------------- | ------------------------------------------ |
| `/`             | Inicio de sesión o modo demo (zona pública). |
| `/inbox`        | Bandeja de entrada.                        |
| `/today`        | Vista “Hoy”.                               |
| `/next`         | Vista “Próximo”.                           |
| `/filters`      | Filtros y etiquetas.                       |
| `/completed`    | Completado.                                |
| `/notification` | Notificaciones.                            |
| `/profile`      | Perfil de cuenta.                          |
| `/billing`      | Facturación.                               |
| `/settings`     | Ajustes.                                   |
| `/logout`       | Cerrar sesión (simulado).                  |

La barra lateral incluye acciones “Agregar tarea” y “Buscar” como botones; pueden enlazarse a rutas o modales según
evolucione el producto.

## Layouts

Los **route groups** `(public)` y `(app)` organizan layouts sin cambiar la URL.

### Layout raíz — `src/app/layout.tsx`

- Fuente **Geist** (variable CSS).
- `globals.css` y metadatos globales.
- Solo envuelve `{children}`; sin sidebar ni modales.

### Layout público — `src/app/(public)/layout.tsx`

- Pantalla centrada para login en `/`.
- Sin `Aside`, `ContextWrapper` ni modales de la app.

### Layout de aplicación — `src/app/(app)/layout.tsx`

- **`ContextWrapper`** — proveedores de contexto.
- **`Aside`** — navegación lateral colapsable.
- Slot **`@modal`** (parallel routes) y **`Toaster`**.

Las rutas bajo `(app)/` comparten este shell. Las APIs en `src/app/api/` no usan estos layouts de UI.

## Modo demo

En `/`, además del formulario de login simulado, existe **“Probar en modo demo”**: entra a `/inbox` sin credenciales.

- El modo (`demo` o `user`) se guarda en `sessionStorage` vía [`src/lib/auth-session.ts`](../src/lib/auth-session.ts) y [`useAuthSessionStore`](../src/stores/auth-session-store.ts).
- En modo demo, el layout `(app)` muestra [`DemoModeBanner`](../src/features/auth/DemoModeBanner.tsx) y el perfil del sidebar indica “Usuario demo”.
- Al cerrar sesión en `/logout` se borra el modo guardado.

## Estado global (Zustand)

| Store | Uso |
| ----- | --- |
| `useSidebarStore` | Apertura/cierre de la barra lateral |
| `useThemeStore` | Tema claro/oscuro |
| `useAuthSessionStore` | Sesión demo / usuario |
| `useTasksRefreshStore` | Refresco de listas de tareas |

## Modales y URL (parallel routes)

Los modales usan el slot **`@modal`** en `(app)/layout.tsx` (`{ children, modal }`).

| URL | Modal |
| --- | ----- |
| `/add-task` | Nueva tarea |
| `/search` | Búsqueda |
| `/pro` | Pro |

Rutas interceptadas `(.)add-task`, etc. mantienen la página de fondo al navegar desde la app; `router.back()` o Escape cierra el modal. Hook: `useModalNavigation()`.

## Navegación lateral

Los ítems de menú con enlace están definidos en `src/components/layout/aside-bar/data.ts` (`asideItems`). Los iconos se
importan como SVG desde la misma carpeta `aside-bar/icons/`.

## Documentación relacionada

- [Primeros pasos](getting-started.md)
- [Sistema de diseño](design-system.md)

[English version](../en/architecture.md)
