from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Resultado
from schemas import ResultadoCreate, ResultadoUpdate

router = APIRouter(prefix="/resultados", tags=["Resultados"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Listar todos los resultados
@router.get("/")
def get_resultados(db: Session = Depends(get_db)):
    return db.query(Resultado).all()

# Crear un resultado
@router.post("/")
def create_resultado(resultado: ResultadoCreate, db: Session = Depends(get_db)):
    nuevo_resultado = Resultado(**resultado.dict())
    db.add(nuevo_resultado)
    db.commit()
    db.refresh(nuevo_resultado)
    return nuevo_resultado

# Consultar resultado por id
@router.get("/{resultado_id}")
def get_resultado(resultado_id: int, db: Session = Depends(get_db)):
    resultado = db.query(Resultado).filter(Resultado.id_resultado == resultado_id).first()
    if not resultado:
        raise HTTPException(status_code=404, detail="Resultado no encontrado")
    return resultado

# Actualizar un resultado
@router.put("/{resultado_id}")
def update_resultado(resultado_id: int, data: ResultadoUpdate, db: Session = Depends(get_db)):
    resultado = db.query(Resultado).filter(Resultado.id_resultado == resultado_id).first()
    if not resultado:
        raise HTTPException(status_code=404, detail="Resultado no encontrado")
    
    if data.diagnostico is not None:
        resultado.diagnostico = data.diagnostico
    if data.observaciones is not None:
        resultado.observaciones = data.observaciones
    if data.requiere_tratamiento is not None:
        resultado.requiere_tratamiento = data.requiere_tratamiento

    db.commit()
    db.refresh(resultado)
    return resultado

# Eliminar un resultado
@router.delete("/{resultado_id}")
def delete_resultado(resultado_id: int, db: Session = Depends(get_db)):
    resultado = db.query(Resultado).filter(Resultado.id_resultado == resultado_id).first()
    if not resultado:
        raise HTTPException(status_code=404, detail="Resultado no encontrado")
    db.delete(resultado)
    db.commit()
    return {"detail": "Resultado eliminado"}
