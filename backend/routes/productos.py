from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Producto, Proveedor, Usuario
from schemas import ProductoCreate, ProductoUpdate
from auth import get_current_actor

router = APIRouter(prefix="/productos", tags=["Productos"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Listar todos los productos
@router.get("/")
def get_productos(db: Session = Depends(get_db)):
    return db.query(Producto).all()


# Crear producto (requiere actor: proveedor o admin usuario)
@router.post("/")
def create_producto(producto: ProductoCreate, actor=Depends(get_current_actor), db: Session = Depends(get_db)):
    data = producto.dict()
    # Si el actor es proveedor, forzamos id_proveedor
    if isinstance(actor, Proveedor):
        data['id_proveedor'] = actor.id_proveedor
    else:
        # actor is Usuario; allow only admins to create products for arbitrary providers
        if not (hasattr(actor, 'id_rol') and actor.id_rol == 1):
            raise HTTPException(status_code=403, detail="No autorizado para crear productos")

    nuevo_producto = Producto(**data)
    db.add(nuevo_producto)
    db.commit()
    db.refresh(nuevo_producto)
    return nuevo_producto


# Consultar producto por id
@router.get("/{producto_id}")
def get_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id_producto == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto


# Actualizar producto (proveedor solo puede actualizar su producto)
@router.put("/{producto_id}")
def update_producto(producto_id: int, data: ProductoUpdate, actor=Depends(get_current_actor), db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id_producto == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    if isinstance(actor, Proveedor):
        if producto.id_proveedor != actor.id_proveedor:
            raise HTTPException(status_code=403, detail="No autorizado para editar este producto")
    else:
        # usuario must be admin
        if not (hasattr(actor, 'id_rol') and actor.id_rol == 1):
            raise HTTPException(status_code=403, detail="No autorizado para editar productos")

    for key, value in data.dict(exclude_unset=True).items():
        setattr(producto, key, value)

    db.commit()
    db.refresh(producto)
    return producto


# Eliminar producto
@router.delete("/{producto_id}")
def delete_producto(producto_id: int, actor=Depends(get_current_actor), db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id_producto == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    if isinstance(actor, Proveedor):
        if producto.id_proveedor != actor.id_proveedor:
            raise HTTPException(status_code=403, detail="No autorizado para eliminar este producto")
    else:
        if not (hasattr(actor, 'id_rol') and actor.id_rol == 1):
            raise HTTPException(status_code=403, detail="No autorizado para eliminar productos")

    db.delete(producto)
    db.commit()
    return {"detail": "Producto eliminado"}
