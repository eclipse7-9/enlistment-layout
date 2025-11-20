# enlistment-layout

Pet Health Services — Fullstack (React + FastAPI)

Proyecto fullstack para gestión de servicios veterinarios, productos y domicilios. Este README contiene instrucciones rápidas para ejecutar la app en desarrollo, variables de entorno y enlaces a la documentación en `docs/`.

## Resumen rápido
- Frontend: React (Vite), Tailwind CSS, framer-motion.
- Backend: FastAPI, SQLAlchemy, Pydantic.
- Base de datos: MySQL (ajustable en `backend/database.py`).

## Estructura principal
- `backend/` — código Python (FastAPI). Revisa `backend/main.py`, `backend/models.py`, `backend/routes/`.
- `src/` — frontend React (Vite). Componentes en `src/components/`, páginas en `src/pages/`.
- `docs/` — documentación en español (endpoints y guías prácticas).

## Requisitos
- Node.js >= 16
- Python 3.10+
- MySQL (u otra BD compatible)

## Variables de entorno (ejemplos)
- Backend (usa `.env` o variables del entorno):
  - `DATABASE_URL` = mysql+pymysql://user:pass@localhost:3306/dbname
  - `SECRET_KEY` = tu_secreto_para_jwt
  - `CORS_ORIGINS` = http://localhost:5173

## Ejecutar localmente

### Backend (recomendado virtualenv)

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
# ajustar variables de entorno, p.ej. asignar DATABASE_URL y SECRET_KEY
# ejecutar el servidor (http://localhost:8000)
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

La UI de OpenAPI estará disponible en `http://localhost:8000/docs`.

### Frontend (Vite)

```powershell
cd src
npm install
npm run dev
# abrir http://localhost:5173
```

## Documentación de la API
- `docs/API.md` — documentación general (resumen de endpoints y cómo ejecutar).
- Guías prácticas (en español) en `docs/`: `usuarios.md`, `productos.md`, `servicios.md`, `checkout.md`, `domicilios.md`, `pedidos.md`, `ubicaciones.md`, `notificaciones.md`.

## Migraciones y base de datos
- Hay SQL y artefactos en `backend/` para cambios de esquema; aplica estas migraciones en tu instancia MySQL.
- Recomendación: usar Alembic para gestionar migraciones en el futuro.

## OpenAPI / Postman
- El spec OpenAPI está disponible en `http://localhost:8000/openapi.json` cuando el backend está corriendo.
- Puedo guardar `openapi.json` en `docs/openapi.json` o generar una colección Postman si lo deseas.

## Pruebas y datos de ejemplo
- Añadir seeds o cuentas de prueba agiliza pruebas manuales (recomendado crear `tests/` y `fixtures/`).

## Sugerencias y próximos pasos
- Añadir `docs/openapi.json` (export desde el servidor en ejecución).
- Crear `.env.example` con variables mínimas.
- Añadir scripts de arranque (PowerShell) para levantar backend + frontend juntos.

---

Si quieres, actualizo este README con instrucciones específicas de tu entorno (por ejemplo, comandos de migración exactos, `.env.example`, o scripts de ayuda).
