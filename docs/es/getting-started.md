# Primeros pasos

Guía para instalar y ejecutar **WEB To-Do List** en tu máquina.

## Requisitos

- **Node.js** 18 o superior (recomendado LTS actual).
- **pnpm** (gestor de paquetes usado en el proyecto). Alternativas: `npm` o `yarn`.
- **Proyecto Firebase** (solo para login real con cuenta de usuario).

## Instalación

Desde la raíz del repositorio:

```bash
pnpm install
```

### Modo demo (sin configuración)

1. `pnpm dev`
2. Abre [http://localhost:3000](http://localhost:3000) y pulsa **Probar en modo demo**.

No hace falta `.env` ni Firebase: los datos viven en `localStorage` del navegador.

### Login real (Firebase)

```bash
cp .env.example .env
```

Completa `.env` con las credenciales de Firebase Console (config web + service account).

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
2. Activa **Authentication → Email/Password**.
3. Crea **Firestore** y despliega `firestore.rules`.
4. Copia la config web a `NEXT_PUBLIC_FIREBASE_*` y la service account a `FIREBASE_SERVICE_ACCOUNT_JSON`.
5. (Opcional) Seed de datos para una cuenta real:

```bash
pnpm db:seed
```

## Scripts disponibles

| Comando             | Descripción                                                               |
| ------------------- | ------------------------------------------------------------------------- |
| `pnpm dev`          | Servidor de desarrollo en [http://localhost:3000](http://localhost:3000). |
| `pnpm build`        | Compilación de producción (Next.js optimizado).                           |
| `pnpm start`        | Sirve la build de producción (ejecutar tras `pnpm build`).                |
| `pnpm db:seed`      | Seed opcional en Firestore para cuentas reales.                          |
| `pnpm lint`         | ESLint sobre el proyecto.                                                 |
| `pnpm lint:fix`     | ESLint con correcciones automáticas cuando sea posible.                   |
| `pnpm format`       | Formatea con Prettier.                                                    |
| `pnpm format:check` | Comprueba formato sin escribir archivos.                                  |

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
