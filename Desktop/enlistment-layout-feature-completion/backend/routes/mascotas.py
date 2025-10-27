from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Mascota
from schemas import MascotaCreate

router = APIRouter(prefix="/mascotas", tags=["Mascotas"])

# Dependencia para DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Listar todas las mascotas
@router.get("/")
def listar_mascotas(db: Session = Depends(get_db)):
    return db.query(Mascota).all()

# Crear mascota
@router.post("/")
def crear_mascota(mascota: MascotaCreate, db: Session = Depends(get_db)):
    nueva_mascota = Mascota(**mascota.dict())
    db.add(nueva_mascota)
    db.commit()
    db.refresh(nueva_mascota)
    return nueva_mascota

# Obtener una mascota por ID
@router.get("/{id_mascota}")
def obtener_mascota(id_mascota: int, db: Session = Depends(get_db)):
    mascota = db.query(Mascota).filter(Mascota.id_mascota == id_mascota).first()
    if not mascota:
        raise HTTPException(status_code=404, detail="Mascota no encontrada")
    return mascota

#  Actualizar mascota
@router.put("/{id_mascota}")
def actualizar_mascota(id_mascota: int, mascota: MascotaCreate, db: Session = Depends(get_db)):
    mascota_db = db.query(Mascota).filter(Mascota.id_mascota == id_mascota).first()
    if not mascota_db:
        raise HTTPException(status_code=404, detail="Mascota no encontrada")
    
    for key, value in mascota.dict().items():
        setattr(mascota_db, key, value)

    db.commit()
    db.refresh(mascota_db)
    return mascota_db

# Eliminar  mascota
@router.delete("/{id_mascota}")
def eliminar_mascota(id_mascota: int, db: Session = Depends(get_db)):
    mascota = db.query(Mascota).filter(Mascota.id_mascota == id_mascota).first()
    if not mascota:
        raise HTTPException(status_code=404, detail="Mascota no encontrada")
    db.delete(mascota)
    db.commit()
    return {"msg": "Mascota eliminada con éxito"}