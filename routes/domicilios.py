from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Domicilio
from schemas import DomicilioCreate

router = APIRouter(prefix="/domicilios", tags=["Domicilios"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Crear domicilio
@router.post("/")
def create_domicilio(domicilio: DomicilioCreate, db: Session = Depends(get_db)):
    nuevo_domicilio = Domicilio(**domicilio.dict())
    db.add(nuevo_domicilio)
    db.commit()
    db.refresh(nuevo_domicilio)
    return nuevo_domicilio

# Listar todos los domicilios
@router.get("/")
def get_domicilios(db: Session = Depends(get_db)):
    return db.query(Domicilio).all()

# Obtener un domicilio por ID
@router.get("/{id_domicilio}")
def get_domicilio(id_domicilio: int, db: Session = Depends(get_db)):
    domicilio = db.query(Domicilio).filter(Domicilio.id_domicilio == id_domicilio).first()
    if not domicilio:
        raise HTTPException(status_code=404, detail="Domicilio no encontrado")
    return domicilio

# Actualizar domicilio
@router.put("/{id_domicilio}")
def update_domicilio(id_domicilio: int, domicilio: DomicilioCreate, db: Session = Depends(get_db)):
    db_domicilio = db.query(Domicilio).filter(Domicilio.id_domicilio == id_domicilio).first()
    if not db_domicilio:
        raise HTTPException(status_code=404, detail="Domicilio no encontrado")
    for key, value in domicilio.dict().items():
        setattr(db_domicilio, key, value)
    db.commit()
    db.refresh(db_domicilio)
    return db_domicilio

# Eliminar domicilio
@router.delete("/{id_domicilio}")
def delete_domicilio(id_domicilio: int, db: Session = Depends(get_db)):
    domicilio = db.query(Domicilio).filter(Domicilio.id_domicilio == id_domicilio).first()
    if not domicilio:
        raise HTTPException(status_code=404, detail="Domicilio no encontrado")
    db.delete(domicilio)
    db.commit()
    return {"detail": "Domicilio eliminado"}
