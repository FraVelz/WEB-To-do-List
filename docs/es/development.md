# Desarrollo

Prácticas y herramientas para trabajar en el código de **WEB To-Do List**.

## Calidad de código

- **ESLint** — configuración Next.js (`eslint-config-next`) y reglas adicionales en el proyecto.
- **Prettier** — formato unificado; el plugin `prettier-plugin-tailwindcss` ordena clases de Tailwind.

Antes de un commit razonable:

```bash
pnpm lint
pnpm format:check
```

## Alias de importación

El proyecto usa el alias `@/` apuntando a `src/` (ver `tsconfig.json`). Ejemplo:

```ts
import { ContextWrapper } from '@/context/context-wrapper'
```

## Tailwind y build

- La versión de **`tailwindcss`** debe ser **v4** junto con **`@tailwindcss/postcss`**, alineada con
  `@import "tailwindcss"` en `globals.css`.
- Si el build falla con _Can't resolve 'tailwindcss'_, revisa que no haya mezcla de Tailwind v3 y v4 en `package.json`.

## React Compiler

El proyecto tiene el **React Compiler** activado en `next.config.ts` (`reactCompiler: true`). Mantén componentes
predecibles para aprovechar las optimizaciones.

## Componentes UI

Hay primitivos basados en utilidades comunes del ecosistema (por ejemplo `Button`, menús). Al añadir componentes:

- Prefiere composición y props tipadas.
- Reutiliza tokens semánticos del sistema de diseño (clases `text-text-primary`, `bg-surface-app`, etc.).

## Solución de problemas

| Síntoma                                  | Qué revisar                                                                                            |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Error al resolver `tailwindcss` en build | Versión de `tailwindcss` en v4 y `@tailwindcss/postcss` instalados.                                    |
| Estilos que no aplican                   | Clases en archivos bajo `src/`; tokens en `@theme` dentro de `globals.css`.                            |
| Contexto `undefined` en cliente          | El componente debe estar bajo `ContextWrapper` y marcado como `'use client'` si usa hooks de contexto. |

## Documentación relacionada

- [Primeros pasos](getting-started.md)
- [Arquitectura](architecture.md)

[English version](../en/development.md)
