# Auditoría global de problemas (`/problems-search`)

## Cuándo ejecutar

- El usuario invoca **`/problems-search`** o pide una **búsqueda / auditoría global** de problemas que puedan afectar la
  web.
- No implica corregir nada salvo que el usuario lo pida después; el objetivo primero es **inventariar y priorizar**.

## Objetivo

Recorrer el proyecto de forma **sistemática**, desde lo **más global y crítico** hasta lo **más local y menor impacto**,
y entregar un informe ordenado por **prioridad** (no por carpeta al azar).

Considerar siempre el **impacto en producción** (usuarios, seguridad, build/CI, base de datos, API, rendimiento,
accesibilidad) y la **probabilidad** de que el problema ocurra en la web desplegada.

## Qué debe hacer el asistente

1. **Ejecutar comprobaciones automáticas** cuando sea posible (sin saltar hooks ni alterar git config):
   - `pnpm run lint`
   - `pnpm run test:run` (como en CI)
   - `pnpm run build` (como en CI; requiere `DATABASE_URL` válida o mock si el build la exige)
   - Opcional si aporta valor: `pnpm run format:check`, `pnpm run react:doctor`
2. **Revisar el código y la configuración** según las áreas del apartado «Factores y prioridades» (abajo).
3. **No inventar problemas**: cada hallazgo debe citar archivo/ruta o salida de comando; si algo es hipótesis, marcarlo
   como _posible_ y qué comprobaría.
4. **Respetar reglas del repo** al evaluar estructura (p. ej. `.cursor/rules/component-scope.mdc`).
5. **No commitear ni pushear** salvo petición explícita del usuario.

## Factores y prioridades (de mayor a menor)

Usar esta escala en el informe:

| Nivel  | Etiqueta | Criterio orientativo                                                                                                          |
| ------ | -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **P0** | Crítico  | Rompe build, CI, tests, despliegue, API o pérdida de datos; seguridad grave en rutas server.                                  |
| **P1** | Alto     | Prisma/schema desalineado, auth/sesión rota, errores runtime probables, accesibilidad que bloquea uso, regresión clara de UX. |
| **P2** | Medio    | Lint/types, tests frágiles o sin cubrir flujos críticos, rendimiento, deuda que facilita bugs.                                |
| **P3** | Bajo     | Estilo, nombres, docs desactualizadas, mejoras opcionales, nitpicks sin impacto inmediato en usuarios.                        |

### 1. Global e infraestructura (P0–P1)

- **Build y CI**: `.github/workflows/ci.yml`, scripts en `package.json`, lockfile.
- **Config Next**: `next.config.ts`, `prisma.config.ts`, rutas bajo `src/app/`, `not-found`.
- **Base de datos**: `prisma/schema.prisma`, migraciones, seed, `DATABASE_URL` / `DIRECT_URL` en `.env.example`.
- **Secretos y env**: `.env` en git, `.env.example` vs uso real.
- **Dependencias**: versiones obsoletas con CVE conocidos (mencionar solo si hay evidencia razonable).

### 2. API routes y capa de datos (P0–P1)

- Rutas en `src/app/api/`: tasks, notifications, task-labels; validación de entrada, códigos HTTP, manejo de errores.
- Tests colocados (`*.route.test.ts`): cobertura vs comportamiento real; tests que pasan en CI pero no reflejan
  producción.
- Prisma: consultas N+1, transacciones, borrados en cascada, tipos generados desactualizados.

### 3. Rutas, App Router y flujos de usuario (P0–P1)

- Vistas de tareas: `today`, `next`, `inbox`, `completed`, `filters`, `notification`.
- Configuración: `settings`, `profile`, `billing`, `logout`.
- Estado global (Zustand) vs datos del servidor: inconsistencias, race conditions.

### 4. Auth, sesión y seguridad (P1)

- Protección de rutas y APIs; exposición de datos entre usuarios si aplica.
- Variables sensibles solo en servidor, nunca en `NEXT_PUBLIC_*` innecesarias.

### 5. Rendimiento y experiencia (P1–P2)

- React Compiler / hidratación innecesaria (`"use client"` de más).
- Listas de tareas largas, re-fetch excesivo, toasts (`sonner`) sin feedback de error.

### 6. Accesibilidad (P1–P2)

- Contraste, foco visible, teclado, `aria-*`, formularios y controles Radix UI.

### 7. UI, layout y arquitectura (P2)

- Componentes en `src/components/` que solo usa una feature (regla **component-scope**).
- Design system (CVA, Radix) usado de forma consistente.
- Estilos globales (`globals.css`) vs módulos por feature.

### 8. Calidad de código y mantenimiento (P2–P3)

- ESLint/TypeScript (vía lint y build).
- Vitest: tests rotos, mocks desactualizados, cobertura engañosa.
- Inconsistencias con `docs/es/architecture.md` y documentación EN/ES.

### 9. Detalle y pulido (P3)

- Prettier/formato, nombres de archivos, comentarios obsoletos, pequeñas mejoras de copy o UX sin riesgo.

## Formato del informe (obligatorio)

Responder en **español**, con esta estructura:

```markdown
## Resumen ejecutivo

- X críticos (P0), Y altos (P1), …
- 1–3 frases: qué duele más y qué conviene atacar primero.

## P0 — Crítico

- [ ] **Título breve** — archivo/ruta — impacto — sugerencia de fix (1 línea)

## P1 — Alto

…

## P2 — Medio

…

## P3 — Bajo

…

## Comprobaciones ejecutadas

- Lista de comandos corridos y si pasaron o fallaron.

## Sin hallazgos relevantes

- Áreas revisadas donde no se detectó nada (opcional, breve).
```

- Máximo **~15–25 ítems** con impacto real; agrupar nitpicks en un solo bullet en P3 si hay muchos.
- Si no hay P0/P1, decirlo explícitamente y destacar el siguiente paso recomendado (p. ej. solo P2 de estructura).

## Resumen para el agente

- Auditoría **de lo global a lo específico**, multi-factor, priorizada P0→P3.
- Evidencia con rutas y salidas de comandos; hipótesis marcadas como tales.
- Informe estructurado; **no** aplicar fixes masivos sin que el usuario lo pida.
