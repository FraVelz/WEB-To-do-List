# 📋 WEB To-Do List

[English version](README.EN.md)

Aplicación de gestión de tareas moderna construida con Next.js. Organiza tu vida y tu trabajo con una interfaz intuitiva y un diseño limpio.

![Captura de pantalla](public/images/screenshot.png)

## ✨ Características

- **Bandeja de entrada** — Todas tus tareas en un solo lugar
- **Hoy** — Tareas programadas para el día actual
- **Próximo** — Vista de tareas pendientes
- **Buscador** — Encuentra tareas rápidamente
- **Filtros y etiquetas** — Organiza y categoriza tus tareas
- **Completado** — Historial de tareas finalizadas
- **Modales** — Interfaz fluida para crear y editar tareas
- **Barra lateral** — Navegación cómoda y accesible
- **Modo oscuro** — Soporte para temas claro y oscuro (Tailwind)

## 🛠️ Tecnologías

- [Next.js 16](https://nextjs.org/) — Framework React
- [React 19](https://react.dev/) — Biblioteca UI
- [TypeScript](https://www.typescriptlang.org/) — Tipado estático
- [Tailwind CSS 4](https://tailwindcss.com/) — Estilos utilitarios

## 📁 Estructura del proyecto

``` text
src/
├── app/                    # Rutas de la aplicación (App Router)
│   ├── add-task/          # Crear nueva tarea
│   ├── completed/         # Tareas completadas
│   ├── filters/           # Filtros y etiquetas
│   ├── inbox/             # Bandeja de entrada
│   ├── next/              # Próximas tareas
│   ├── search/            # Buscador
│   └── today/             # Tareas de hoy
├── components/
│   ├── layout/            # Aside, Header
│   └── ui/                # ModalPro y otros componentes
├── context/               # Contextos de React (Modal, Asidebar)
└── hooks/                 # Hooks personalizados (usePathLink)
```

## 📄 Información

Proyecto de uso educativo.

Licencia Apache 2.0

**Autor:** [Fravelz](https://github.com/fravelz)
