from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Recibo, Pedido, Usuario
from schemas import ReciboCreate, ReciboUpdate
from sqlalchemy.exc import SQLAlchemyError
from decimal import Decimal
from auth import get_current_user

router = APIRouter(prefix="/recibos", tags=["Recibos"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Crear recibo
@router.post("/")
def create_recibo(request: ReciboCreate, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    try:
        # Validar que el pedido existe y pertenece al usuario (o admin)
        pedido = db.query(Pedido).filter(Pedido.id_pedido == request.id_pedido).first()
        if not pedido:
            raise HTTPException(status_code=404, detail="Pedido no encontrado")
        if pedido.id_usuario != current_user.id_usuario and getattr(current_user, "id_rol", None) != 1:
            raise HTTPException(status_code=403, detail="No autorizado para crear recibo para este pedido")

        # Si no se especifica estado, asumir 'pagado' cuando monto_pagado > 0
        estado = request.estado_recibo if getattr(request, "estado_recibo", None) else ("pagado" if Decimal(request.monto_pagado) > 0 else "emitido")
        nuevo_recibo = Recibo(
            monto_pagado=Decimal(request.monto_pagado),
            estado_recibo=estado,
            id_pedido=request.id_pedido
        )
        db.add(nuevo_recibo)

        # marcar pedido como pagado
        pedido.estado_pedido = 'pagado'

        db.commit()
        db.refresh(nuevo_recibo)
        return nuevo_recibo
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# Listar todos los recibos
@router.get("/")
def get_recibos(db: Session = Depends(get_db)):
    return db.query(Recibo).all()

# Consultar recibo por ID
@router.get("/{recibo_id}")
def get_recibo(recibo_id: int, db: Session = Depends(get_db)):
    recibo = db.query(Recibo).filter(Recibo.id_recibo == recibo_id).first()
    if not recibo:
        raise HTTPException(status_code=404, detail="Recibo no encontrado")
    return recibo

# Actualizar recibo
@router.put("/{recibo_id}")
def update_recibo(recibo_id: int, request: ReciboUpdate, db: Session = Depends(get_db)):
    recibo = db.query(Recibo).filter(Recibo.id_recibo == recibo_id).first()
    if not recibo:
        raise HTTPException(status_code=404, detail="Recibo no encontrado")
    for var, value in vars(request).items():
        if value is not None:
            if var == "monto_pagado":
                setattr(recibo, var, Decimal(value))
            else:
                setattr(recibo, var, value)
    try:
        db.commit()
        db.refresh(recibo)
        return recibo
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# Eliminar recibo
@router.delete("/{recibo_id}")
def delete_recibo(recibo_id: int, db: Session = Depends(get_db)):
    recibo = db.query(Recibo).filter(Recibo.id_recibo == recibo_id).first()
    if not recibo:
        raise HTTPException(status_code=404, detail="Recibo no encontrado")
    try:
        db.delete(recibo)
        db.commit()
        return {"detail": "Recibo eliminado"}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
