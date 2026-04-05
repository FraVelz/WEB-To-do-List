# Primeros pasos

Guía para instalar y ejecutar **WEB To-Do List** en tu máquina.

## Requisitos

- **Node.js** 18 o superior (recomendado LTS actual).
- **pnpm** (gestor de paquetes usado en el proyecto). Alternativas: `npm` o `yarn`.

## Instalación

Desde la raíz del repositorio:

```bash
pnpm install
```

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo en [http://localhost:3000](http://localhost:3000). |
| `pnpm build` | Compilación de producción (Next.js optimizado). |
| `pnpm start` | Sirve la build de producción (ejecutar tras `pnpm build`). |
| `pnpm lint` | ESLint sobre el proyecto. |
| `pnpm lint:fix` | ESLint con correcciones automáticas cuando sea posible. |
| `pnpm format` | Formatea con Prettier. |
| `pnpm format:check` | Comprueba formato sin escribir archivos. |

## Desarrollo local

1. Instala dependencias: `pnpm install`.
2. Arranca el servidor: `pnpm dev`.
3. Abre el navegador en la URL que indique la terminal (por defecto puerto 3000).

## Build de producción

```bash
pnpm build
pnpm start
```

Útil para comprobar que la aplicación compila y se comporta como en despliegue.

## Documentación relacionada

- [Arquitectura](architecture.md)
- [Desarrollo](development.md)

[English version](../en/getting-started.md)
