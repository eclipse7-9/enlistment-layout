from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Region, Ciudad

router = APIRouter(prefix="/ubicaciones", tags=["Ubicaciones"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/regiones")
def get_regiones(db: Session = Depends(get_db)):
    regiones = db.query(Region).all()
    # serializar a lista de dicts para evitar problemas de serialización de ORM
    return [{"id_region": r.id_region, "nombre_region": r.nombre_region} for r in regiones]


@router.get("/ciudades")
def get_ciudades(region_id: int | None = None, db: Session = Depends(get_db)):
    if region_id:
        ciudades = db.query(Ciudad).filter(Ciudad.id_region == region_id).all()
    else:
        ciudades = db.query(Ciudad).all()

    return [
        {"id_ciudad": c.id_ciudad, "nombre_ciudad": c.nombre_ciudad, "id_region": c.id_region}
        for c in ciudades
    ]


@router.get("/ciudades/{id_ciudad}")
def get_ciudad(id_ciudad: int, db: Session = Depends(get_db)):
    ciudad = db.query(Ciudad).filter(Ciudad.id_ciudad == id_ciudad).first()
    if not ciudad:
        raise HTTPException(status_code=404, detail="Ciudad no encontrada")
    return ciudad
