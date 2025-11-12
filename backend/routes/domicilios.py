from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Domicilio, Pedido, DetallePedido, Producto
from schemas import DomicilioCreate, DomicilioUpdate

router = APIRouter(prefix="/domicilios", tags=["Domicilios"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Crear domicilio
@router.post("/")
def create_domicilio(domicilio: DomicilioCreate, db: Session = Depends(get_db)):
    nuevo_domicilio = Domicilio(**domicilio.dict())
    db.add(nuevo_domicilio)
    db.commit()
    db.refresh(nuevo_domicilio)
    return nuevo_domicilio

# Listar todos los domicilios
@router.get("/")
def get_domicilios(db: Session = Depends(get_db)):
    domicilios = db.query(Domicilio).all()
    result = []
    for d in domicilios:
        # obtener pedidos asociados a este domicilio
        pedidos = db.query(Pedido).filter(Pedido.id_domicilio == d.id_domicilio).all()
        pedidos_serialized = []
        for p in pedidos:
            detalles = db.query(DetallePedido).filter(DetallePedido.id_pedido == p.id_pedido).all()
            productos = []
            for det in detalles:
                prod = db.query(Producto).filter(Producto.id_producto == det.id_producto).first()
                productos.append({
                    "id_producto": det.id_producto,
                    "nombre_producto": getattr(prod, 'nombre_producto', None),
                    "cantidad": det.cantidad,
                    "subtotal": float(det.subtotal) if det.subtotal is not None else None,
                })
            pedidos_serialized.append({
                "id_pedido": p.id_pedido,
                "estado_pedido": getattr(p, 'estado_pedido', None),
                "total": float(p.total) if p.total is not None else None,
                "productos": productos,
            })

        result.append({
            "id_domicilio": d.id_domicilio,
            "alias_domicilio": d.alias_domicilio,
            "direccion_completa": d.direccion_completa,
            "codigo_postal": d.codigo_postal,
            "es_principal": d.es_principal,
            "id_region": d.id_region,
            "id_ciudad": d.id_ciudad,
            "id_usuario": d.id_usuario,
            "estado_domicilio": getattr(d, 'estado_domicilio', None),
            "pedidos": pedidos_serialized,
        })

    return result

# Obtener un domicilio por ID
@router.get("/{id_domicilio}")
def get_domicilio(id_domicilio: int, db: Session = Depends(get_db)):
    domicilio = db.query(Domicilio).filter(Domicilio.id_domicilio == id_domicilio).first()
    if not domicilio:
        raise HTTPException(status_code=404, detail="Domicilio no encontrado")
    # incluir pedidos y productos para este domicilio
    pedidos = db.query(Pedido).filter(Pedido.id_domicilio == domicilio.id_domicilio).all()
    pedidos_serialized = []
    for p in pedidos:
        detalles = db.query(DetallePedido).filter(DetallePedido.id_pedido == p.id_pedido).all()
        productos = []
        for det in detalles:
            prod = db.query(Producto).filter(Producto.id_producto == det.id_producto).first()
            productos.append({
                "id_producto": det.id_producto,
                "nombre_producto": getattr(prod, 'nombre_producto', None),
                "cantidad": det.cantidad,
                "subtotal": float(det.subtotal) if det.subtotal is not None else None,
            })
        pedidos_serialized.append({
            "id_pedido": p.id_pedido,
            "estado_pedido": getattr(p, 'estado_pedido', None),
            "total": float(p.total) if p.total is not None else None,
            "productos": productos,
        })

    return {
        "id_domicilio": domicilio.id_domicilio,
        "alias_domicilio": domicilio.alias_domicilio,
        "direccion_completa": domicilio.direccion_completa,
        "codigo_postal": domicilio.codigo_postal,
        "es_principal": domicilio.es_principal,
        "id_region": domicilio.id_region,
        "id_ciudad": domicilio.id_ciudad,
        "id_usuario": domicilio.id_usuario,
        "estado_domicilio": getattr(domicilio, 'estado_domicilio', None),
        "pedidos": pedidos_serialized,
    }

# Actualizar domicilio
@router.put("/{id_domicilio}")
def update_domicilio(id_domicilio: int, domicilio: DomicilioUpdate, db: Session = Depends(get_db)):
    db_domicilio = db.query(Domicilio).filter(Domicilio.id_domicilio == id_domicilio).first()
    if not db_domicilio:
        raise HTTPException(status_code=404, detail="Domicilio no encontrado")
    for key, value in domicilio.dict(exclude_unset=True).items():
        if hasattr(db_domicilio, key):
            setattr(db_domicilio, key, value)
    db.commit()
    db.refresh(db_domicilio)
    return db_domicilio

# Eliminar domicilio
@router.delete("/{id_domicilio}")
def delete_domicilio(id_domicilio: int, db: Session = Depends(get_db)):
    domicilio = db.query(Domicilio).filter(Domicilio.id_domicilio == id_domicilio).first()
    if not domicilio:
        raise HTTPException(status_code=404, detail="Domicilio no encontrado")
    db.delete(domicilio)
    db.commit()
    return {"detail": "Domicilio eliminado"}
