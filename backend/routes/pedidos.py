from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Pedido, DetallePedido, Recibo, Usuario, MetodoPago
from schemas import PedidoCreate, PedidoUpdate
from sqlalchemy.exc import SQLAlchemyError
from decimal import Decimal
from auth import get_current_user

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
def create_pedido(request: PedidoCreate, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    try:
        # validar que el método de pago pertenece al usuario
        metodo = db.query(MetodoPago).filter(MetodoPago.id_metodo_pago == request.id_metodo_pago).first()
        if not metodo:
            raise HTTPException(status_code=404, detail="Método de pago no encontrado")
        if metodo.id_usuario != current_user.id_usuario and getattr(current_user, "id_rol", None) != 1:
            raise HTTPException(status_code=403, detail="Método de pago no pertenece al usuario")

        pedido = Pedido(
            total=Decimal(request.total),
            id_metodo_pago=request.id_metodo_pago,
            estado_pedido=request.estado_pedido,
            id_usuario=current_user.id_usuario
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
def get_pedidos(db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    # Si es admin (id_rol == 1) devolver todos, si no devolver solo los del usuario
    if getattr(current_user, "id_rol", None) == 1:
        return db.query(Pedido).all()
    return db.query(Pedido).filter(Pedido.id_usuario == current_user.id_usuario).all()

# Obtener por ID
@router.get("/{pedido_id}")
def get_pedido(pedido_id: int, db: Session = Depends(get_db)):
    pedido = db.query(Pedido).filter(Pedido.id_pedido == pedido_id).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return pedido

# Actualizar pedido
@router.put("/{pedido_id}")
def update_pedido(pedido_id: int, request: PedidoUpdate, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    pedido = db.query(Pedido).filter(Pedido.id_pedido == pedido_id).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")

    # Solo el dueño o admin puede actualizar
    if pedido.id_usuario != current_user.id_usuario and getattr(current_user, "id_rol", None) != 1:
        raise HTTPException(status_code=403, detail="No autorizado")

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
def delete_pedido(pedido_id: int, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    pedido = db.query(Pedido).filter(Pedido.id_pedido == pedido_id).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")

    # Solo el dueño o admin puede eliminar
    if pedido.id_usuario != current_user.id_usuario and getattr(current_user, "id_rol", None) != 1:
        raise HTTPException(status_code=403, detail="No autorizado")

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
