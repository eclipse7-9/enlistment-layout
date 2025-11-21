from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import DetallePedido
from schemas import DetallePedidoCreate, DetallePedidoUpdate
from sqlalchemy.exc import SQLAlchemyError
from decimal import Decimal

router = APIRouter(prefix="/detalle_pedido", tags=["DetallePedido"])

# Dependencia DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Crear detalle de pedido
@router.post("/")
def create_detalle(request: DetallePedidoCreate, db: Session = Depends(get_db)):
    try:
        detalle = DetallePedido(
            id_pedido=request.id_pedido,
            id_producto=request.id_producto,
            cantidad=request.cantidad,
            subtotal=Decimal(request.subtotal)
        )
        db.add(detalle)
        db.commit()
        db.refresh(detalle)
        return detalle
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# Listar todos los detalles
@router.get("/")
def get_detalles(db: Session = Depends(get_db)):
    return db.query(DetallePedido).all()

# Obtener detalle por ID
@router.get("/{detalle_id}")
def get_detalle(detalle_id: int, db: Session = Depends(get_db)):
    detalle = db.query(DetallePedido).filter(DetallePedido.id_detalle_pedido == detalle_id).first()
    if not detalle:
        raise HTTPException(status_code=404, detail="Detalle no encontrado")
    return detalle

# Actualizar detalle
@router.put("/{detalle_id}")
def update_detalle(detalle_id: int, request: DetallePedidoUpdate, db: Session = Depends(get_db)):
    detalle = db.query(DetallePedido).filter(DetallePedido.id_detalle_pedido == detalle_id).first()
    if not detalle:
        raise HTTPException(status_code=404, detail="Detalle no encontrado")

    for var, value in vars(request).items():
        if value is not None:
            if var == "subtotal":
                setattr(detalle, var, Decimal(value))
            else:
                setattr(detalle, var, value)
    try:
        db.commit()
        db.refresh(detalle)
        return detalle
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# Eliminar detalle
@router.delete("/{detalle_id}")
def delete_detalle(detalle_id: int, db: Session = Depends(get_db)):
    detalle = db.query(DetallePedido).filter(DetallePedido.id_detalle_pedido == detalle_id).first()
    if not detalle:
        raise HTTPException(status_code=404, detail="Detalle no encontrado")
    try:
        db.delete(detalle)
        db.commit()
        return {"detail": "Detalle eliminado"}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
