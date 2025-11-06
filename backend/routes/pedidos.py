from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Pedido, DetallePedido, Recibo
from schemas import PedidoCreate, PedidoUpdate
from sqlalchemy.exc import SQLAlchemyError
from decimal import Decimal

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])

# Dependencia DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Crear pedido
@router.post("/")
def create_pedido(request: PedidoCreate, db: Session = Depends(get_db)):
    try:
        pedido = Pedido(
            total=Decimal(request.total),
            id_metodo_pago=request.id_metodo_pago,
            estado_pedido=request.estado_pedido
        )
        db.add(pedido)
        db.commit()
        db.refresh(pedido)
        return pedido
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# Listar pedidos
@router.get("/")
def get_pedidos(db: Session = Depends(get_db)):
    return db.query(Pedido).all()

# Obtener por ID
@router.get("/{pedido_id}")
def get_pedido(pedido_id: int, db: Session = Depends(get_db)):
    pedido = db.query(Pedido).filter(Pedido.id_pedido == pedido_id).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return pedido

# Actualizar pedido
@router.put("/{pedido_id}")
def update_pedido(pedido_id: int, request: PedidoUpdate, db: Session = Depends(get_db)):
    pedido = db.query(Pedido).filter(Pedido.id_pedido == pedido_id).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")

    for var, value in vars(request).items():
        if value is not None:
            if var == "total":
                setattr(pedido, var, Decimal(value))
            else:
                setattr(pedido, var, value)
    try:
        db.commit()
        db.refresh(pedido)
        return pedido
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# Eliminar pedido
@router.delete("/{pedido_id}")
def delete_pedido(pedido_id: int, db: Session = Depends(get_db)):
    pedido = db.query(Pedido).filter(Pedido.id_pedido == pedido_id).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    try:
        # Eliminar primero los registros dependientes para evitar errores de integridad referencial
        db.query(DetallePedido).filter(DetallePedido.id_pedido == pedido_id).delete()
        db.query(Recibo).filter(Recibo.id_pedido == pedido_id).delete()
        db.delete(pedido)
        db.commit()
        return {"detail": "Pedido eliminado"}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
