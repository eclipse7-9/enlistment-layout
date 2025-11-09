<<<<<<< HEAD
# enlistment-layout

[![CI](https://github.com/eclipse7-9/enlistment-layout/actions/workflows/ci.yml/badge.svg)](https://github.com/eclipse7-9/enlistment-layout/actions/workflows/ci.yml)
![Último commit](https://img.shields.io/github/last-commit/eclipse7-9/enlistment-layout)
# Pet Health Services — Fullstack (React + FastAPI)

Proyecto fullstack para gestión de servicios veterinarios y domicilios. Incluye frontend con React + Vite y backend con FastAPI + SQLAlchemy.

Este README resume cómo ejecutar el proyecto localmente, variables de entorno importantes, y notas sobre las funcionalidades recientes (modales, alertas y edición de perfil).

## Resumen rápido
- Frontend: React (Vite), Tailwind CSS, framer-motion.
- Backend: FastAPI, SQLAlchemy, Pydantic.
- BD: MySQL (u otra compatible; ajustar conexión en `backend/database.py`).

## Estructura importante
- `backend/` — código Python (FastAPI). Revisa `backend/main.py`, `backend/models.py`, `backend/routes/`.
- `src/` — frontend React. Componentes en `src/components/`, páginas en `src/pages/`.
- `public/`, `static/` — recursos estáticos y uploads.

## Requisitos
- Node.js >= 18 (para Vite)
- Python 3.10+
- MySQL (u otra BD) para el backend

## Variables de entorno (ejemplos)
- Backend (usar `.env` o variables del entorno):
  - `DATABASE_URL` = mysql+pymysql://user:pass@localhost:3306/dbname
  - `SECRET_KEY` = tu_secreto
  - `CORS_ORIGINS` = http://localhost:5173

## Ejecutar localmente

### Backend (virtualenv recomendado)

1. Crear entorno e instalar dependencias:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2. Ajusta variables de entorno (`DATABASE_URL`, `SECRET_KEY`) y ejecuta las migraciones si aplicas Alembic / scripts SQL.

3. Levantar backend:

```powershell
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

1. Instalar dependencias, installar pillow y levantar dev server:

```powershell
cd ..\src
npm install
npm run dev
```

2. Abrir `http://localhost:5173` (o el puerto que indique Vite).

## Notas sobre migraciones
- El backend fue actualizado para aceptar uploads de imagen en servicios y para soportar notificaciones; si la base de datos no tiene las columnas nuevas (por ejemplo `imagen_servicio`) debes ejecutar las migraciones o ajustar la tabla manualmente.

## Funcionalidades destacadas (recientes)
- Modal de reserva con blur en el fondo (mejora UX).
- Sistema de alertas animadas (toasts) globales usando `AlertContext` y `AnimatedAlert`.
- Las alertas de inicio de sesión mantienen modal (SweetAlert2) y ahora muestran un mensaje de bienvenida según el rol (Administrador, Veterinario, Domiciliario, Cliente).
- Edición de perfil por campo (vista de domiciliario): cada campo tiene un botón "Editar" que abre un modal con efecto blur y permite guardar solo ese campo.
- Asteriscos rojos añadidos a etiquetas de campos obligatorios.

## Testing y calidad
- Frontend: si hay tests configurados, ejecuta `npm run test` desde `src/`.
- Backend: ejecuta `pytest` desde `backend/` si hay pruebas.

## Problemas comunes y soluciones
- `imagen_servicio` o columnas nuevas: crea la columna manualmente o aplica la migración correspondiente.
- CORS: ajusta `CORS_ORIGINS` en la configuración del backend si ves errores de origen.

## Desarrollo y contribuciones
- Para cambios en modelos, añade migraciones (Alembic / SQL) y documenta en `db/migrations`.
- Mantén las dependencias actualizadas en `package.json` y `requirements.txt`.

## ¿Qué puedo hacer por ti?
- Puedo añadir scripts PowerShell para levantar backend+frontend en un solo comando.
- Puedo generar instrucciones de migraciones Alembic si quieres usar ese flujo.

---

Si quieres, actualizo el README con más detalles específicos sobre tu entorno (por ejemplo, credenciales de MySQL, comandos de migración exactos, o scripts de ayuda).
