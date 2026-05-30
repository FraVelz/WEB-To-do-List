# Sistema de diseño

Cómo están definidos los estilos visuales en **WEB To-Do List**.

## Tailwind CSS v4

Los estilos globales viven en `src/app/globals.css`:

- `@import "tailwindcss"` — carga el motor de Tailwind v4.
- `@theme inline { ... }` — define **tokens de diseño** (colores, variables CSS) consumidos por las utilidades de
  Tailwind y por CSS normal.

## Capas de tokens

1. **Primitivos** — valores base (grises, marca, acentos). No deben usarse directamente en componentes si existe un
   token semántico equivalente.
2. **Semánticos** — nombres según **rol** en la UI: superficies (`surface-app`, `surface-sidebar`), texto
   (`text-primary`, `text-accent`), interacción (`interactive-primary`, `interactive-hover-soft`), bordes
   (`border-subtle`), etc.

En componentes verás clases como:

- `bg-surface-app`, `bg-surface-sidebar`
- `text-text-primary`, `text-text-accent`
- `bg-interactive-primary`, `hover:bg-interactive-hover-soft`

Estas clases se generan a partir de las variables definidas en `@theme`.

## Tipografía

La fuente principal del layout raíz es **Geist** (Google Fonts), aplicada vía `next/font` en `layout.tsx` con la
variable `--font-geist-sans`.

## Temas claro y oscuro

Los tokens semánticos en `globals.css` leen variables `--theme-*` según `data-theme` en `<html>` (`dark` | `light`).

- **Oscuro:** fondos negros/gris neutro (`gray-950`, `gray-900`), acentos y botones en azul (`blue-400`–`blue-600`).
- **Claro:** fondos `slate-100` / blanco, texto `slate-900`, misma marca azul.

El cambio de tema se persiste en `localStorage` (`todo-theme`) y se aplica con [`ThemeToggle`](../../src/components/theme/ThemeToggle.tsx) (cabecera de la app y login) o el interruptor en Ajustes.

## Buenas prácticas

- Añade nuevos colores como variables en `@theme` y nómbralos por **significado**, no solo por matiz.
- Evita duplicar hex/rgb sueltos en muchos archivos; centraliza en tokens.
- Mantén **tailwindcss v4** y **@tailwindcss/postcss** alineados (ver [Desarrollo](development.md)).

## Documentación relacionada

- [Arquitectura](architecture.md)
- [Desarrollo](development.md)

[English version](../en/design-system.md)
