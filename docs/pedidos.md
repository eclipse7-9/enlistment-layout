# Pedidos — Guía rápida

Endpoints principales:
- `GET /pedidos/` — listar pedidos (admin ve todos; domiciliario y cliente ven los suyos/filtrados)
- `POST /pedidos/` — crear pedido (usualmente mediante `checkout`)
- `GET /pedidos/{id}` — obtener pedido
- `PUT /pedidos/{id}` — actualizar pedido (por ejemplo, cambiar estado)
- `DELETE /pedidos/{id}` — eliminar pedido

Estados comunes: `pendiente`, `en-proceso`, `cancelado`, `pagado`.

Ejemplo: cambiar estado (PUT):

```bash
curl -X PUT http://localhost:8000/pedidos/123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"estado_pedido":"en-proceso"}'
```

Notas:
- Validar permisos antes de cambiar estado (solo admin o dueño del pedido según lógica del backend).
- El `checkout` crea el pedido y los `detalle_pedido` automáticamente; evita crear pedidos directamente si usas checkout.
