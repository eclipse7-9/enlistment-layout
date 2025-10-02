from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Tratamiento
from schemas import TratamientoCreate, TratamientoUpdate

router = APIRouter(prefix="/tratamientos", tags=["Tratamientos"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Listar todos los tratamientos
@router.get("/")
def get_tratamientos(db: Session = Depends(get_db)):
    return db.query(Tratamiento).all()

# Crear un tratamiento
@router.post("/")
def create_tratamiento(tratamiento: TratamientoCreate, db: Session = Depends(get_db)):
    nuevo_tratamiento = Tratamiento(**tratamiento.dict())
    db.add(nuevo_tratamiento)
    db.commit()
    db.refresh(nuevo_tratamiento)
    return nuevo_tratamiento

# Consultar tratamiento por id
@router.get("/{tratamiento_id}")
def get_tratamiento(tratamiento_id: int, db: Session = Depends(get_db)):
    tratamiento = db.query(Tratamiento).filter(Tratamiento.id_tratamiento == tratamiento_id).first()
    if not tratamiento:
        raise HTTPException(status_code=404, detail="Tratamiento no encontrado")
    return tratamiento

# Actualizar tratamiento
@router.put("/{tratamiento_id}")
def update_tratamiento(tratamiento_id: int, data: TratamientoUpdate, db: Session = Depends(get_db)):
    tratamiento = db.query(Tratamiento).filter(Tratamiento.id_tratamiento == tratamiento_id).first()
    if not tratamiento:
        raise HTTPException(status_code=404, detail="Tratamiento no encontrado")
    
    if data.tipo_tratamiento is not None:
        tratamiento.tipo_tratamiento = data.tipo_tratamiento
    if data.descripcion_tratamiento is not None:
        tratamiento.descripcion_tratamiento = data.descripcion_tratamiento
    if data.fecha_inicio is not None:
        tratamiento.fecha_inicio = data.fecha_inicio
    if data.fecha_fin is not None:
        tratamiento.fecha_fin = data.fecha_fin
    if data.estado_tratamiento is not None:
        tratamiento.estado_tratamiento = data.estado_tratamiento

    db.commit()
    db.refresh(tratamiento)
    return tratamiento

# Eliminar tratamiento
@router.delete("/{tratamiento_id}")
def delete_tratamiento(tratamiento_id: int, db: Session = Depends(get_db)):
    tratamiento = db.query(Tratamiento).filter(Tratamiento.id_tratamiento == tratamiento_id).first()
    if not tratamiento:
        raise HTTPException(status_code=404, detail="Tratamiento no encontrado")
    db.delete(tratamiento)
    db.commit()
    return {"detail": "Tratamiento eliminado"}
