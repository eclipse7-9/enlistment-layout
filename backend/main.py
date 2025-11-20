from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os
from routes import usuarios, mascotas, domicilios, servicios, citas, resultados, tratamientos, proveedores, productos, metodo_pago, pedidos, detalle_pedido, recibos, checkout, ubicaciones, notifications, denuncias
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # En desarrollo restringimos a los orígenes del frontend Vite
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],  # permitir todos los métodos (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # permitir todos los headers
)

@app.get("/")
def root():
    return {"message": "olo wol"}


# Servir archivos estáticos (imágenes subidas)
static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(os.path.join(static_dir, "uploads"), exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# --- rutas ---
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
app.include_router(checkout.router)
app.include_router(ubicaciones.router)
app.include_router(notifications.router)
app.include_router(denuncias.router)
