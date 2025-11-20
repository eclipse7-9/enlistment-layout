# Notificaciones — Guía rápida

Endpoints:
- `GET /notificaciones/` — listar notificaciones del usuario (o todas si admin)
- `POST /notificaciones/` — crear notificación (usado por el sistema/admin)
- `PUT /notificaciones/{id}` — actualizar (p.ej. marcar como leída)

Ejemplo crear notificación (curl):

```bash
curl -X POST http://localhost:8000/notificaciones \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"id_usuario":12,"titulo":"Pedido actualizado","mensaje":"Su pedido #123 está en proceso."}'
```

Notas:
- Notificaciones usadas para avisos de pedidos, domicilios y mensajes del sistema.
- El frontend muestra notificaciones en el perfil/área de usuario.
