from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Cita
from schemas import CitaCreate, CitaUpdateEstado

router = APIRouter(prefix="/citas", tags=["Citas"])

# Dependencia para la sesión DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Listar todas las citas
@router.get("/")
def get_citas(db: Session = Depends(get_db)):
    return db.query(Cita).all()

# Crear una nueva cita
@router.post("/")
def create_cita(cita: CitaCreate, db: Session = Depends(get_db)):
    nueva_cita = Cita(**cita.dict())
    db.add(nueva_cita)
    db.commit()
    db.refresh(nueva_cita)
    return nueva_cita

# Consultar una cita por id
@router.get("/{cita_id}")
def get_cita(cita_id: int, db: Session = Depends(get_db)):
    cita = db.query(Cita).filter(Cita.id_cita == cita_id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    return cita

# Actualizar el estado de una cita
@router.put("/{cita_id}")
def update_cita_estado(cita_id: int, estado: CitaUpdateEstado, db: Session = Depends(get_db)):
    cita = db.query(Cita).filter(Cita.id_cita == cita_id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    cita.estado_cita = estado.estado_cita
    db.commit()
    db.refresh(cita)
    return cita

# Eliminar una cita
@router.delete("/{cita_id}")
def delete_cita(cita_id: int, db: Session = Depends(get_db)):
    cita = db.query(Cita).filter(Cita.id_cita == cita_id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    db.delete(cita)
    db.commit()
    return {"detail": "Cita eliminada"}
