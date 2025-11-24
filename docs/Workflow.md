# Documentación del Workflow GitHub Actions: CI

Este workflow de GitHub Actions automatiza la integración continua (CI) para un proyecto con backend en Python (FastAPI) y frontend en Node.js (Vite).

---

## Desencadenadores (Triggers)

El workflow se ejecuta en los siguientes eventos:

- `push` en las ramas `main` o `master`.
- `pull_request` abierto hacia las ramas `main` o `master`.

---

## Jobs (Trabajos)

### 1. Backend (Python)

- **Runner:** ubuntu-latest
- **Versión Python:** 3.12 (definida en una matriz para posibles futuras versiones)
- **Pasos:**
  1. **Checkout:** Clona el repositorio en el runner.
  2. **Set up Python:** Configura la versión de Python.
  3. **Cache pip:** Guarda en caché las dependencias instaladas para acelerar futuras ejecuciones, usando el hash del archivo `backend/requirements.txt`.
  4. **Instalar dependencias:** Ejecuta `pip install -r backend/requirements.txt` si el archivo existe.
  5. **Ejecutar tests:** Si `pytest` está disponible, corre los tests; si no, se muestra un mensaje indicando que se omiten.

---

### 2. Frontend (Node / Vite)

- **Runner:** ubuntu-latest
- **Versión Node.js:** 18.x (definida en una matriz para posibles futuras versiones)
- **Pasos:**
  1. **Checkout:** Clona el repositorio en el runner.
  2. **Set up Node.js:** Configura la versión de Node.js y habilita caché para dependencias npm.
  3. **Instalar dependencias:** Prefiere `npm ci` (instalación limpia basada en lockfile), si falla, hace `npm install`. Si no existe lockfile, ejecuta `npm install`.
  4. **Ejecutar tests:** Si existe script de tests, corre `npm test` en modo silencioso; si no, muestra un mensaje indicando que se omiten.
  5. **Construir frontend:** Si existe script `build`, lo ejecuta con `npm run build`; si no, muestra mensaje indicando que se omite.

---

## Resumen

Este workflow garantiza que:

- El backend de Python instala sus dependencias y pasa sus tests.
- El frontend de Node/Vite instala dependencias, pasa tests y se construye correctamente.
- Todo esto sucede automáticamente en cada push o PR en las ramas principales (`main` o `master`).

---

## Archivo completo del workflow

Puedes ver el archivo completo en:

![Workflow file](sandbox:/mnt/data/1550f1e4-ec49-4655-89c7-b68340660c00.png)

---

¿Quieres ayuda para extender este workflow? Por ejemplo:

- Añadir pasos para construir y subir imágenes Docker.
- Desplegar automáticamente en servicios como Render, Fly.io o Netlify.
- Añadir notificaciones de errores o resultados.
