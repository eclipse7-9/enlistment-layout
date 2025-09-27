# routes/servicios.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Servicio
from database import SessionLocal
from schemas import ServicioCreate

router = APIRouter(prefix="/servicios", tags=["Servicios"])

# Dependencia para la sesión de DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Crear un servicio
@router.post("/")
def create_servicio(servicio: ServicioCreate, db: Session = Depends(get_db)):
    nuevo_servicio = Servicio(**servicio.dict())
    db.add(nuevo_servicio)
    db.commit()
    db.refresh(nuevo_servicio)
    return nuevo_servicio

# Listar todos los servicios
@router.get("/")
def get_servicios(db: Session = Depends(get_db)):
    servicios = db.query(Servicio).all()
    return servicios

# Obtener un servicio por ID
@router.get("/{servicio_id}")
def get_servicio(servicio_id: int, db: Session = Depends(get_db)):
    servicio = db.query(Servicio).filter(Servicio.id_servicio == servicio_id).first()
    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    return servicio

# Eliminar un servicio
@router.delete("/{servicio_id}")
def delete_servicio(servicio_id: int, db: Session = Depends(get_db)):
    servicio = db.query(Servicio).filter(Servicio.id_servicio == servicio_id).first()
    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    db.delete(servicio)
    db.commit()
    return {"detail": "Servicio eliminado"}
