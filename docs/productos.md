# Productos — Guía práctica

Principales endpoints:
- `GET /productos/` — listar productos (público)
- `GET /productos/{id}` — obtener producto por id
- `POST /productos/` — crear producto (requiere token y rol proveedor/admin)
- `PUT /productos/{id}` — actualizar producto (propietario o admin)
- `DELETE /productos/{id}` — eliminar producto

Payload típico (crear/editar):
```json
{
  "nombre_producto": "Alimento Super",
  "descripcion_producto": "Bolsa 5kg",
  "precio_producto": 25000.00,
  "categoria_producto": "comida",
  "id_proveedor": 7
}
```

Notas prácticas:
- `precio_producto` usa DECIMAL (2 decimales). En frontend enviar número con 2 decimales.
- `categoria_producto` debe ser una de: `comida`, `accesorios`, `salud`.
- Asegura enviar `Authorization: Bearer <token>` para crear/editar.

Ejemplo curl (crear):

```bash
curl -X POST http://localhost:8000/productos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"nombre_producto":"Alimento","descripcion_producto":"Bolsa","precio_producto":12000.00,"categoria_producto":"comida","id_proveedor":7}'
```
