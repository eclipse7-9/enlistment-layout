# Ubicaciones — Uso para frontend

Endpoints:
- `GET /ubicaciones/regiones` — lista regiones: `{ id_region, nombre_region }`
- `GET /ubicaciones/ciudades` — lista ciudades; acepta `region_id` como filtro; devuelve `{ id_ciudad, nombre_ciudad, id_region }`
- `GET /ubicaciones/ciudades/{id_ciudad}` — obtener ciudad

Uso común:
- Poblar selects de `region` y `ciudad` en formularios (p.ej. en creación de domicilio y checkout).
- En el frontend, al mostrar domicilios se hace una segunda llamada para resolver `id_region`/`id_ciudad` → nombres y enriquecer la UI.

Ejemplo curl (obtener regiones):

```bash
curl http://localhost:8000/ubicaciones/regiones
```
