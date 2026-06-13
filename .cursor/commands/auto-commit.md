# Autocommit — WEB-To-do-List (Next.js + Prisma)

Usar cuando el usuario pida **hacer commit** del trabajo actual. Mensajes **Conventional Commits**, coherentes con
`git log` de este repo. **No** hacer `git push` salvo petición explícita.

## Cuándo ejecutar

- Invocación de **`/auto-commit`** o petición explícita de **commit** / **autocommit**.
- **No** commitear si el usuario no lo pidió.

## Antes de commitear

1. `git status` — staged y unstaged.
2. `git diff` — qué entra en el commit.
3. `git log -15 --oneline` — tono reciente.
4. **Respetar borrados:** si el diff elimina líneas o archivos, **no restaurarlos** ni "arreglar" el contenido antes del commit salvo petición explícita del usuario. Un borrado suele ser intencional.

**No** incluir `.env`, `DATABASE_URL` ni `.next/` salvo petición explícita.

## Ámbitos (`scope`) habituales en este repo

`tasks`, `api`, `prisma`, `db`, `account`, `inbox`, `today`, `filters`, `notification`, `ui`, `modal`, `layout`,
`readme`, `docs`, `cursor`, `ci`, `test`, `deps`.

Rutas de referencia: `src/app/api/`, `src/features/`, `src/components/`, `src/services/`, `prisma/`, `README.md` /
`README.EN.md`, `docs/`, `.cursor/`.

## Formas de mensaje

### A) Formato lista — varias áreas (preferido frente al estilo antiguo encadenado)

```text
feat(tasks): add label filter on inbox view

fix(api): align task patch validation with prisma schema
test(tasks): cover task row completion toggle
```

### B) Formato clásico — un tema

```text
fix: align task modals with react compiler and tame react-doctor
```

**Evitar** una sola línea con varios `feat:` / `docs:` pegados (patrón antiguo de este repo).

## Tipos

| Tipo       | Uso aquí                         |
| ---------- | -------------------------------- |
| `feat`     | Páginas, modales, API, cuenta    |
| `fix`      | Bugs UI/API                      |
| `test`     | Vitest (`*.test.ts`, `vitest`)   |
| `docs`     | README, `docs/`, comandos Cursor |
| `refactor` | Features, stores, contextos      |
| `chore`    | Prettier, ESLint, deps           |

## Commit

```bash
git commit -m "$(cat <<'EOF'
feat(notification): add row actions on notification page

chore(cursor): add auto-commit and update-docs commands
EOF
)"
```

## Reglas

- Mensaje en **inglés**; respuesta al chat en **español**.
- Cumplir `.cursor/rules/git-commits.mdc` (sin coautoría IA).
- Hook rechazado → nuevo commit; sin `--no-verify` salvo petición explícita.
- Enmendar si aparece `Co-authored-by: Cursor` (commit no publicado).

## Comandos relacionados

- Documentación: **`/update-docs`**.
