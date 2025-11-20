# Domicilios — Guía práctica

Endpoints:
- `GET /domicilios/` — listar domicilios del usuario (o todos si admin)
- `POST /domicilios/` — crear domicilio
- `GET /domicilios/{id}` — obtener domicilio
- `PUT /domicilios/{id}` — actualizar domicilio
- `DELETE /domicilios/{id}` — eliminar domicilio

Campos relevantes:
- `direccion_completa`, `codigo_postal`, `estado_domicilio` (`Pendiente`, `En-entrega`, `Entregado`, `Cancelado`), `id_region`, `id_ciudad`, `id_usuario`.

Notas prácticas:
- El frontend enriquece domicilios con `region` y `ciudad` (nombres) usando los endpoints de `/ubicaciones`.
- En checkout puedes enviar `id_domicilio` para reutilizar una dirección guardada.
- No se solicita `alias` ni `es_principal` (campos removidos del UI).

Ejemplo curl (crear):

```bash
curl -X POST http://localhost:8000/domicilios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"direccion_completa":"Calle 9 #8-10","codigo_postal":"110111","id_region":1,"id_ciudad":5}'
```
