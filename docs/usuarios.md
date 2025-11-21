# Usuarios — Guía rápida

Descripción: endpoints principales para autenticación y gestión de usuarios.

Endpoints clave
- `POST /usuarios/login` — login
  - Body: `{ "correo_usuario": "user@example.com", "password_usuario": "pass" }`
  - Respuesta: `{ "access_token": "...", "id_usuario": X, "id_rol": Y }`
  - Uso: obtener token JWT para peticiones autenticadas.

- `GET /usuarios/` — listar usuarios (requiere rol admin)
- `POST /usuarios/` — crear usuario (admin o flujos de registro)
- `GET /usuarios/{usuario_id}` — obtener datos de un usuario
- `PUT /usuarios/{usuario_id}` — actualizar usuario (parcial)
- `PUT /usuarios/{usuario_id}/password` — cambiar contraseña

Permisos y roles
- `id_rol` comúnmente usado: 1=Admin, 2=Emprendedor, 3=Domiciliario, 4=Cliente.

Ejemplo curl (login):

```bash
curl -X POST http://localhost:8000/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"correo_usuario":"juan@correo.com","password_usuario":"secret"}'
```

Notas
- Después del login guarda `access_token` y úsalo como `Authorization: Bearer <token>`.
- Para pruebas, crea un usuario con rol admin para listar/gestionar otros usuarios.
