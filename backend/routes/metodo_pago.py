from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from database import SessionLocal
from models import MetodoPago, Usuario
from schemas import MetodoPagoCreate, MetodoPagoUpdate
from auth import get_current_user  # Dependencia que obtiene usuario logueado desde JWT

router = APIRouter(prefix="/metodo_pago", tags=["MetodoPago"])

# Dependencia DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -----------------------
# Crear método de pago
# -----------------------
@router.post("/")
def create_metodo_pago(
    request: MetodoPagoCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    try:
        metodo = MetodoPago(**request.dict(), id_usuario=current_user.id_usuario)
        db.add(metodo)
        db.commit()
        db.refresh(metodo)
        return metodo
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# -----------------------
# Listar métodos de pago del usuario logueado
# -----------------------
@router.get("/")
def get_metodos_pago(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    return db.query(MetodoPago).filter(MetodoPago.id_usuario == current_user.id_usuario).all()

# -----------------------
# Obtener un método por ID (solo si pertenece al usuario)
# -----------------------
@router.get("/{metodo_id}")
def get_metodo_pago(
    metodo_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    metodo = db.query(MetodoPago).filter(
        MetodoPago.id_metodo_pago == metodo_id,
        MetodoPago.id_usuario == current_user.id_usuario
    ).first()
    if not metodo:
        raise HTTPException(status_code=404, detail="Método de pago no encontrado")
    return metodo

# -----------------------
# Actualizar método de pago (solo si pertenece al usuario)
# -----------------------
@router.put("/{metodo_id}")
def update_metodo_pago(
    metodo_id: int,
    request: MetodoPagoUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    metodo = db.query(MetodoPago).filter(
        MetodoPago.id_metodo_pago == metodo_id,
        MetodoPago.id_usuario == current_user.id_usuario
    ).first()
    if not metodo:
        raise HTTPException(status_code=404, detail="Método de pago no encontrado")

    for var, value in request.dict(exclude_unset=True).items():
        setattr(metodo, var, value)

    try:
        db.commit()
        db.refresh(metodo)
        return metodo
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# -----------------------
# Eliminar método de pago (solo si pertenece al usuario)
# -----------------------
@router.delete("/{metodo_id}")
def delete_metodo_pago(
    metodo_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    metodo = db.query(MetodoPago).filter(
        MetodoPago.id_metodo_pago == metodo_id,
        MetodoPago.id_usuario == current_user.id_usuario
    ).first()
    if not metodo:
        raise HTTPException(status_code=404, detail="Método de pago no encontrado")

    try:
        db.delete(metodo)
        db.commit()
        return {"detail": "Método de pago eliminado"}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
