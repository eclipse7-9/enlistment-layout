from fastapi import FastAPI
from routes import usuarios, mascotas, domicilios, servicios, citas, resultados, tratamientos, proveedores, productos, metodo_pago, pedidos, detalle_pedido, recibos
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # prueba abierto, luego restringe a ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],  # permitir todos los métodos (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # permitir todos los headers
)

@app.get("/")
def root():
    return {"message": "olo wol"}

# --- Incluye routers ---
app.include_router(usuarios.router)
app.include_router(mascotas.router)
app.include_router(domicilios.router)
app.include_router(servicios.router)
app.include_router(citas.router)
app.include_router(resultados.router)
app.include_router(tratamientos.router)
app.include_router(proveedores.router)
app.include_router(productos.router)
app.include_router(metodo_pago.router)
app.include_router(pedidos.router)
app.include_router(detalle_pedido.router)
app.include_router(recibos.router)
