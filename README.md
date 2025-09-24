<<<<<<< HEAD
# enlistment-layout

[![CI](https://github.com/eclipse7-9/enlistment-layout/actions/workflows/ci.yml/badge.svg)](https://github.com/eclipse7-9/enlistment-layout/actions/workflows/ci.yml)
![Último commit](https://img.shields.io/github/last-commit/eclipse7-9/enlistment-layout)

**Estructura organizada de las carpetas del proyecto**

```texto
proyecto/
│
├── backend/                 # Backend con FastAPI (Python)
│   ├── app/                  # Código principal
│   │   ├── api/              # Rutas/Endpoints
│   │   ├── core/             # Configuraciones y utilidades
│   │   ├── models/           # Modelos de datos (SQLAlchemy)
│   │   ├── schemas/          # Esquemas Pydantic
│   │   ├── services/         # Lógica de negocio
│   │   ├── db.py             # Conexión a MySQL
│   │   ├── main.py           # Punto de entrada FastAPI
│   ├── tests/                # Pruebas unitarias
│   ├── requirements.txt      # Dependencias Python
│   └── README.md
│
├── frontend/                 # Frontend con React
│   ├── public/               # Archivos estáticos
│   ├── src/                  # Código fuente
│   │   ├── components/       # Componentes reutilizables
│   │   ├── pages/            # Páginas
│   │   ├── services/         # Llamadas a la API
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json          # Dependencias JS
│   └── README.md
│
├── db/                       # Scripts y migraciones de MySQL
│   ├── migrations/           # Archivos de migración
│   ├── init.sql              # Script inicial de base de datos
│   └── README.md
│
├── docs/                     # Documentación del proyecto
│   ├── arquitectura.md
│   ├── api.md
│   └── README.md
│
├── docker-compose.yml        # Configuración para levantar todo el stack
└── README.md
=======
# Buscador de Usuarios

Este proyecto es una aplicación web construida con React que permite buscar usuarios de manera interactiva. Utiliza una API simulada con JSON Server y muestra los resultados en tarjetas, cada una con un botón de "Seguir" reutilizable.

## Características principales

- **Búsqueda en tiempo real:** Filtra usuarios por nombre, correo, perfil o intereses mientras escribes.
- **Interfaz amigable:** Los usuarios se muestran en tarjetas organizadas en 3 columnas.
- **Botón de seguir:** Cada tarjeta incluye un botón de seguir, reutilizando el componente `TwFollowCard`.
- **Indicador de carga:** Muestra un círculo de carga mientras se realiza la búsqueda.

## Instalación y uso

1. Instala las dependencias:
	```bash
	npm install
	```
2. Inicia el servidor de la API simulada:
	```bash
	npm run server-api
	```
	Esto levantará JSON Server en `http://localhost:3001` usando el archivo `db.json`.
3. Inicia la aplicación React:
	```bash
	npm run dev
	```
4. Abre tu navegador en `http://localhost:5173` (o el puerto que indique Vite).

## Estructura del proyecto

- `src/App.jsx`: Componente principal, maneja la búsqueda y muestra los usuarios.
- `src/components/Card.jsx`: Tarjeta de usuario.
- `src/components/TwFollowCard.jsx`: Botón de seguir reutilizable.
- `src/components/SearchInput.jsx`: Input de búsqueda.
- `db.json`: Base de datos simulada para los usuarios.

## Personalización

Puedes modificar los campos de búsqueda o el diseño de las tarjetas editando los componentes en la carpeta `src/components`.

---

¡Listo! Ahora tienes un buscador de usuarios moderno y fácil de usar.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
>>>>>>> 0759b72 (avance con fastapi y react)
