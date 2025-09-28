from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Recibo
from schemas import ReciboCreate, ReciboUpdate
from sqlalchemy.exc import SQLAlchemyError
from decimal import Decimal

router = APIRouter(prefix="/recibos", tags=["Recibos"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Crear recibo
@router.post("/")
def create_recibo(request: ReciboCreate, db: Session = Depends(get_db)):
    try:
        nuevo_recibo = Recibo(
            monto_pagado=Decimal(request.monto_pagado),
            estado_recibo=request.estado_recibo,
            id_pedido=request.id_pedido
        )
        db.add(nuevo_recibo)
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
