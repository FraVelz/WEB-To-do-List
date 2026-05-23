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

| Ruta            | Notas                       |
| --------------- | --------------------------- |
| `/`             | Página de inicio / landing. |
| `/inbox`        | Bandeja de entrada.         |
| `/today`        | Vista “Hoy”.                |
| `/next`         | Vista “Próximo”.            |
| `/filters`      | Filtros y etiquetas.        |
| `/completed`    | Completado.                 |
| `/notification` | Notificaciones.             |

La barra lateral incluye acciones “Agregar tarea” y “Buscar” como botones; pueden enlazarse a rutas o modales según
evolucione el producto.

## Layout raíz

`src/app/layout.tsx` envuelve la aplicación con:

- Fuente **Geist** (variable CSS).
- **`ContextWrapper`** — anida los proveedores de contexto.
- **`Aside`** — navegación lateral colapsable.
- **`ModalPro`** — capa de modales global.

## Contextos React

`ContextWrapper` compone (orden exterior → interior):

1. `ModalSearchProvider` — estado del buscador modal.
2. `ModalAddTaskProvider` — estado del modal de nueva tarea.
3. `ModalProProvider` — coordinación del modal principal.
4. `AsidebarProvider` — apertura/cierre de la barra lateral.

Los componentes cliente consumen estos contextos con hooks dedicados.

## Navegación lateral

Los ítems de menú con enlace están definidos en `src/components/layout/aside-bar/data.ts` (`asideItems`). Los iconos se
importan como SVG desde la misma carpeta `aside-bar/icons/`.

## Documentación relacionada

- [Primeros pasos](getting-started.md)
- [Sistema de diseño](design-system.md)

[English version](../en/architecture.md)
