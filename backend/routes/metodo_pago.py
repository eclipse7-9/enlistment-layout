from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import MetodoPago
from schemas import MetodoPagoCreate, MetodoPagoUpdate
from sqlalchemy.exc import SQLAlchemyError

router = APIRouter(prefix="/metodo_pago", tags=["MetodoPago"])

# Dependencia de DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Crear método de pago
@router.post("/")
def create_metodo_pago(request: MetodoPagoCreate, db: Session = Depends(get_db)):
    try:
        metodo = MetodoPago(**request.dict())
        db.add(metodo)
        db.commit()
        db.refresh(metodo)
        return metodo
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# Listar todos
@router.get("/")
def get_metodos_pago(db: Session = Depends(get_db)):
    return db.query(MetodoPago).all()

# Obtener por ID
@router.get("/{metodo_id}")
def get_metodo_pago(metodo_id: int, db: Session = Depends(get_db)):
    metodo = db.query(MetodoPago).filter(MetodoPago.id_metodo_pago == metodo_id).first()
    if not metodo:
        raise HTTPException(status_code=404, detail="Método de pago no encontrado")
    return metodo

# Actualizar método de pago
@router.put("/{metodo_id}")
def update_metodo_pago(metodo_id: int, request: MetodoPagoUpdate, db: Session = Depends(get_db)):
    metodo = db.query(MetodoPago).filter(MetodoPago.id_metodo_pago == metodo_id).first()
    if not metodo:
        raise HTTPException(status_code=404, detail="Método de pago no encontrado")

    for var, value in vars(request).items():
        if value is not None:
            setattr(metodo, var, value)
    try:
        db.commit()
        db.refresh(metodo)
        return metodo
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# Eliminar método de pago
@router.delete("/{metodo_id}")
def delete_metodo_pago(metodo_id: int, db: Session = Depends(get_db)):
    metodo = db.query(MetodoPago).filter(MetodoPago.id_metodo_pago == metodo_id).first()
    if not metodo:
        raise HTTPException(status_code=404, detail="Método de pago no encontrado")
    try:
        db.delete(metodo)
        db.commit()
        return {"detail": "Método de pago eliminado"}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
