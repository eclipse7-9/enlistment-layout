 # Documentación de la API

 Este documento describe la API del backend provista en `backend/` para la aplicación de Servicios de Salud para Mascotas. Cubre autenticación, endpoints principales, ejemplos de peticiones/respuestas y notas comunes para ejecutar y probar la API localmente.

 ---

 ## Tabla de contenidos

 - Resumen
 - Ejecutar el servidor
 - Autenticación
 - Cabeceras comunes
 - Endpoints
	 - Autenticación y Usuarios (`/usuarios`)
	 - Productos (`/productos`)
	 - Servicios (`/servicios`)
	 - Pedidos (`/pedidos`)
	 - Checkout (`/checkout`)
	 - Domicilios (`/domicilios`)
	 - Ubicaciones (`/ubicaciones`)
	 - Métodos de pago (`/metodo_pago`)
	 - Notificaciones (`/notificaciones`)
	 - Recibos (`/recibos`)
	 - Detalle Pedido (`/detalle_pedido`)
	 - Citas, Mascotas, Proveedores, Denuncias (resumen)

 ---

 ## Resumen

 El backend es una aplicación FastAPI que usa SQLAlchemy como ORM. Las rutas se encuentran en `backend/routes/*.py`. La aplicación expone endpoints para usuarios, productos, servicios, pedidos, domicilios, notificaciones y otros módulos.

 URL base (desarrollo local): `http://localhost:8000`

 ---

 ## Ejecutar el servidor

 Desde la raíz del proyecto, asegúrate de tener el entorno Python y las dependencias instaladas (ver `backend/requirements.txt`). Pasos típicos:

 ```powershell
 # crear entorno virtual (Windows PowerShell)
 python -m venv .venv
 .\.venv\Scripts\Activate.ps1
 pip install -r backend/requirements.txt
 # ejecutar uvicorn
 cd backend
 uvicorn main:app --reload --host 0.0.0.0 --port 8000
 ```

 La aplicación provee una interfaz interactiva OpenAPI en `http://localhost:8000/docs` cuando está en ejecución.

 ---

 ## Autenticación

 La autenticación utiliza tokens JWT (Bearer). El endpoint de login devuelve un `access_token` que debes incluir en las peticiones que requieran autenticación.

 Formato del header:

 ```
 Authorization: Bearer <access_token>
 ```

 Algunos endpoints requieren roles específicos:
 - `id_rol == 1` → Admin
 - `id_rol == 2` → Emprendedor
 - `id_rol == 3` → Domiciliario
 - `id_rol == 4` → Cliente

 Usa el endpoint `/usuarios/login` para obtener un token (ver sección Usuarios).

 ---

 ## Cabeceras comunes

 - `Content-Type: application/json` para peticiones JSON.
 - `Authorization: Bearer <token>` cuando sea necesario.

 Los endpoints que aceptan subida de archivos usan `multipart/form-data` y aceptan `UploadFile`.

 ---

 ## Endpoints

 Esta sección resume las rutas principales. Para listas de parámetros detalladas consulta los archivos de rutas en `backend/routes/` o la UI OpenAPI en ejecución.

 ### Usuarios (Autenticación y gestión de usuarios)

 Prefijo: `/usuarios`

 - POST `/usuarios/login`
	 - Body: `{ "correo_usuario": "user@example.com", "password_usuario": "pass" }`
	 - Respuesta: `{ "access_token": "...", "token_type": "bearer", "id_usuario": 1, "id_rol": 4, "nombre_usuario": "...", ... }`

 - GET `/usuarios/` — listar usuarios (admin)
 - POST `/usuarios/` — crear usuario (admin o flujos automatizados)
 - GET `/usuarios/{usuario_id}` — obtener un usuario
 - PUT `/usuarios/{usuario_id}` — actualizar usuario (parcial)
 - PUT `/usuarios/{usuario_id}/password` — cambiar contraseña (requiere la actual)
 - DELETE `/usuarios/{id_usuario}` — eliminar usuario

 - POST `/usuarios/request-verification` — enviar código de verificación por correo (usado en registro)
 - POST `/usuarios/verify-and-register` — verificar código y registrar
 - POST `/usuarios/request-password-recovery` — solicitar código de recuperación
 - POST `/usuarios/verify-and-reset-password` — verificar código y restablecer contraseña
 - GET `/usuarios/check-role/{email}` — devuelve `{id_rol: X}`
 - Helpers especiales de registro (usar con precaución):
	 - POST `/usuarios/register-admin` — crear admin (requiere `admin_key`)
	 - POST `/usuarios/register-domiciliario` — crear domiciliario (requiere clave)

 Ejemplo de petición de login:

 ```http
 POST /usuarios/login
 Content-Type: application/json

 { "correo_usuario": "juan@correo.com", "password_usuario": "secret" }
 ```

 Ejemplo de respuesta de login (parcial):

 ```json
 {
	 "access_token": "eyJ...",
	 "token_type": "bearer",
	 "id_usuario": 12,
	 "id_rol": 4,
	 "nombre_usuario": "Juan"
 }
 ```

 ### Productos

 Prefijo: `/productos`

 - GET `/productos/` — listar productos
 - POST `/productos/` — crear producto (requiere rol adecuado: proveedor/admin)
 - GET `/productos/{id}` — obtener producto
 - PUT `/productos/{id}` — actualizar producto
 - DELETE `/productos/{id}` — eliminar producto

 Campos de payload comúnmente usados: `nombre_producto`, `descripcion_producto`, `precio_producto` (DECIMAL 10,2), `categoria_producto` (ej.: `comida`, `accesorios`, `salud`), `id_proveedor`, `estado_producto`.

 Ejemplo de creación de producto (JSON):

 ```json
 POST /productos
 Content-Type: application/json
 Authorization: Bearer <token>

 {
	 "nombre_producto": "Alimento Super",
	 "descripcion_producto": "Bolsa 5kg",
	 "precio_producto": 25000.00,
	 "categoria_producto": "comida",
	 "id_proveedor": 7
 }
 ```

 ### Servicios

 Prefijo: `/servicios`

 - GET `/servicios/` — listar servicios
 - POST `/servicios/` — crear servicio (soporta `multipart/form-data` para imagen)
 - GET `/servicios/{id}` — obtener servicio
 - PUT `/servicios/{id}` — actualizar servicio (propietario o admin)
 - DELETE `/servicios/{id}` — eliminar servicio

 Campos: `tipo_servicio`, `descripcion_servicio`, `precio_servicio`, `estado_servicio`, `imagen_servicio`, `id_usuario`.

 Nota: `POST /servicios/` en el backend acepta campos de formulario y un `UploadFile` opcional (`imagen_servicio`). El frontend actualmente usa JSON para crear servicios; considera alinear ambos si necesitas subir imágenes.

 ### Pedidos

 Prefijo: `/pedidos`

 - GET `/pedidos/` — listar pedidos (el admin ve todos; el domiciliario ve `pendiente`/`en-proceso`; los clientes ven los suyos)
 - POST `/pedidos/` — crear pedido (usuario autenticado)
 - GET `/pedidos/{id}` — obtener pedido
 - PUT `/pedidos/{id}` — actualizar pedido (propietario o admin)
 - DELETE `/pedidos/{id}` — eliminar pedido (propietario o admin)

 El modelo Pedido incluye: `id_pedido`, `fecha_pedido`, `estado_pedido` (`pendiente`, `en-proceso`, `cancelado`, `pagado`), `total`, `id_usuario`, `id_metodo_pago`, `id_domicilio`.

 Ejemplo para actualizar estado:

 ```http
 PUT /pedidos/123
 Authorization: Bearer <token>
 Content-Type: application/json

 { "estado_pedido": "en-proceso" }
 ```

 ### Checkout

 Prefijo: `/checkout`

 El endpoint `POST /checkout/` orquesta la creación del pedido, los detalles de línea y opcionalmente crea un domicilio. La estructura del payload depende de la implementación del frontend, pero generalmente contiene:
 - `pedido`: datos a nivel de pedido (total, id_metodo_pago, etc.)
 - `detalles`: lista de ítems (id_producto, cantidad, subtotal)
 - `domicilio` (opcional): o bien referencia un `id_domicilio` existente o provee `direccion_completa`, `codigo_postal`, `id_region`, `id_ciudad` para crear un domicilio nuevo.

 Ejemplo (simplificado):

 ```json
 POST /checkout
 Authorization: Bearer <token>
 Content-Type: application/json

 {
	 "pedido": { "total": 30000, "id_metodo_pago": 5 },
	 "detalles": [{ "id_producto": 1, "cantidad": 2, "subtotal": 20000 }],
	 "domicilio": { "id_domicilio": 12, "direccion_completa": "Calle 123 #45-67", "codigo_postal": "110111" }
 }
 ```

 ### Domicilios

 Prefijo: `/domicilios`

 - GET `/domicilios/` — listar domicilios
 - POST `/domicilios/` — crear domicilio
 - GET `/domicilios/{id}` — obtener domicilio
 - PUT `/domicilios/{id}` — actualizar domicilio (estado, dirección, etc.)
 - DELETE `/domicilios/{id}` — eliminar domicilio

 Campos del domicilio: `id_domicilio`, `direccion_completa`, `codigo_postal`, `estado_domicilio` (`Pendiente`, `En-entrega`, `Entregado`, `Cancelado`), `id_region`, `id_ciudad`, `id_usuario`.

 Nota: el frontend enriquece los domicilios al leerlos con los nombres de `region` y `ciudad` obtenidos desde los endpoints de `/ubicaciones`.

 ### Ubicaciones

 Prefijo: `/ubicaciones`

 - GET `/ubicaciones/regiones` — devuelve la lista de regiones `{ id_region, nombre_region }`
 - GET `/ubicaciones/ciudades` — opcionalmente filtrado por el parámetro `region_id`; devuelve `{ id_ciudad, nombre_ciudad, id_region }`
 - GET `/ubicaciones/ciudades/{id_ciudad}` — obtener ciudad

 Estos endpoints son usados por el frontend para poblar selectores de región/ciudad.

 ### Métodos de pago

 Prefijo: `/metodo_pago`

 - GET `/metodo_pago/` — listar métodos de pago del usuario
 - POST `/metodo_pago/` — crear método de pago
 - GET `/metodo_pago/{id}` — obtener un método de pago
 - PUT `/metodo_pago/{id}` — actualizar
 - DELETE `/metodo_pago/{id}` — eliminar

 Campos típicos: `tipo_metodo` (enum), `numero_cuenta`, `titular`, `id_usuario`.

 ### Notificaciones

 Prefijo: `/notificaciones`

 - GET `/notificaciones/` — listar notificaciones
 - POST `/notificaciones/` — crear notificación
 - PUT `/notificaciones/{id}` — marcar como leída/actualizar

 Usado por el admin y el sistema para notificar a usuarios sobre actualizaciones de pedidos/entregas.

 ### Recibos

 Prefijo: `/recibos`

 - GET `/recibos/` — listar recibos
 - GET `/recibos/{id}` — obtener recibo
 - POST, PUT, DELETE disponibles según uso del backend

 ### Detalle Pedido

 Prefijo: `/detalle_pedido`

 Gestiona las líneas de pedido. Normalmente administrado automáticamente por `checkout`.

 ### Citas, Mascotas, Proveedores, Denuncias, Resultados, Tratamientos

 Cada uno de estos módulos tiene un archivo de rutas en `backend/routes/`. Siguen el patrón CRUD: listar, crear, obtener por id, actualizar y eliminar. Ver archivos:
 - `backend/routes/citas.py`
 - `backend/routes/mascotas.py`
 - `backend/routes/proveedores.py`
 - `backend/routes/denuncias.py`
 - `backend/routes/resultados.py`
 - `backend/routes/tratamientos.py`

 ---

 ## Manejo de errores

 - Los códigos 4xx corresponden a errores del cliente (validación, no autorizado, prohibido)
 - Los códigos 5xx son errores del servidor

 Las respuestas suelen devolver JSON con `detail` o un mensaje que describe el error.

 ---

 ## Notas y detalles operativos

 - CORS: El frontend (Vite) se ejecuta en `http://localhost:5173` (u otra URL similar). Confirma que `backend/main.py` incluye `CORSMiddleware` permitiendo el origen del frontend.
 - Migraciones de base de datos: hay artefactos SQL en `backend/` (por ejemplo `database.txt` y archivos SQL de migración manual). Aplica estos cambios en tu instancia MySQL si modificaste esquemas.
 - OpenAPI: Ejecutando la app con `uvicorn` se expone el spec OpenAPI en `/openapi.json` y la UI en `/docs`.

 ---

 ## Contribuir / Extender la documentación

 Este `docs/API.md` se generó a partir de los archivos de rutas actuales. Si añades o cambias endpoints, actualiza este archivo o usa la UI OpenAPI autogenerada.

 Si quieres, también puedo generar:
 - Un archivo Swagger YAML/JSON guardado en `docs/openapi.json` llamando a `GET /openapi.json` del servidor en ejecución.
 - Una colección de Postman exportada a partir del spec OpenAPI.

 ---

 Fin del archivo.
