# Servicios — Guía práctica

Endpoints principales:
- `GET /servicios/` — listar servicios
- `GET /servicios/{id}` — obtener servicio
- `POST /servicios/` — crear servicio (soporta `multipart/form-data` para imagen)
- `PUT /servicios/{id}` — actualizar servicio (propietario o admin)
- `DELETE /servicios/{id}` — eliminar servicio

Campos comunes:
- `tipo_servicio`, `descripcion_servicio`, `precio_servicio`, `estado_servicio`, `imagen_servicio`, `id_usuario`.

Notas sobre creación con imagen (multipart):
Ejemplo curl multipart:

```bash
curl -X POST http://localhost:8000/servicios \
  -H "Authorization: Bearer $TOKEN" \
  -F "tipo_servicio=consulta" \
  -F "descripcion_servicio=Revisión general" \
  -F "precio_servicio=35000.00" \
  -F "imagen_servicio=@./foto.jpg"
```

Si tu frontend no subir imágenes, puedes usar `POST` con JSON si el backend lo soporta; sin embargo, el endpoint del backend acepta multipart por si necesitas `UploadFile`.

Permisos:
- Crear/editar: propietario (dueño del servicio) o admin.
