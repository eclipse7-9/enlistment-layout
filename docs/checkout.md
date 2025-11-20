# Checkout — Ejemplos prácticos

Endpoint principal:
- `POST /checkout/` — crea pedido + detalle(s) y opcionalmente un domicilio.

Estructura común del payload (JSON):

```json
{
  "pedido": { "total": 30000, "id_metodo_pago": 5 },
  "detalles": [ { "id_producto": 1, "cantidad": 2, "subtotal": 20000 } ],
  "domicilio": {
    "id_domicilio": 12,
    "direccion_completa": "Calle 123 #45-67",
    "codigo_postal": "110111"
  }
}
```

Comportamientos importantes:
- Si incluyes `id_domicilio`, el backend reutiliza el domicilio guardado; aun así puedes enviar `direccion_completa` y `codigo_postal` para editar la dirección en la orden.
- Si no envías `id_domicilio`, debes proveer `direccion_completa`, `id_region` y `id_ciudad` para crear un domicilio nuevo.
- Incluye `Authorization: Bearer <token>`.

Ejemplo curl:

```bash
curl -X POST http://localhost:8000/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d @payload.json
```

Donde `payload.json` contiene la estructura descrita arriba.
