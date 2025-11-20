# routes/servicios.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from models import Servicio, Usuario
from auth import get_current_user
from fastapi import Depends
from database import SessionLocal
from typing import Optional
import os
import shutil
import time

router = APIRouter(prefix="/servicios", tags=["Servicios"])

# Dependencia para la sesión de DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Crear un servicio (acepta multipart/form-data con archivo opcional)
@router.post("/")
def create_servicio(
    tipo_servicio: str = Form(...),
    descripcion_servicio: str = Form(...),
    estado_servicio: str = Form(...),
    precio_servicio: float = Form(...),
    id_usuario: int = Form(...),
    imagen_servicio: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    # Guardar el archivo si fue enviado
    imagen_path = None
    if imagen_servicio is not None:
        # Determinar directorio de uploads en backend/static/uploads
        base_dir = os.path.dirname(os.path.dirname(__file__))
        uploads_dir = os.path.join(base_dir, "static", "uploads")
        os.makedirs(uploads_dir, exist_ok=True)
        # Generar nombre único
        timestamp = int(time.time())
        safe_filename = f"{timestamp}_{imagen_servicio.filename}"
        dest_path = os.path.join(uploads_dir, safe_filename)
        try:
            with open(dest_path, "wb") as buffer:
                shutil.copyfileobj(imagen_servicio.file, buffer)
        finally:
            # Asegurar cerrar el archivo subido
            try:
                imagen_servicio.file.close()
            except Exception:
                pass
        # Ruta relativa que se puede guardar en la BD
        imagen_path = f"/static/uploads/{safe_filename}"

    nuevo_servicio = Servicio(
        tipo_servicio=tipo_servicio,
        descripcion_servicio=descripcion_servicio,
        estado_servicio=estado_servicio,
        precio_servicio=precio_servicio,
        imagen_servicio=imagen_path,
        id_usuario=id_usuario,
    )
    db.add(nuevo_servicio)
    db.commit()
    db.refresh(nuevo_servicio)
    return nuevo_servicio

# Listar todos los servicios
@router.get("/")
def get_servicios(db: Session = Depends(get_db)):
    servicios = db.query(Servicio).all()
    return servicios


# Listar servicios del usuario autenticado (propios)
@router.get("/mine")
def get_my_servicios(db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    servicios = db.query(Servicio).filter(Servicio.id_usuario == current_user.id_usuario).all()
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


# Actualizar un servicio (JSON body). Permite al propietario o al admin editar campos.
@router.put("/{servicio_id}")
def update_servicio(
    servicio_id: int,
    tipo_servicio: Optional[str] = None,
    descripcion_servicio: Optional[str] = None,
    estado_servicio: Optional[str] = None,
    precio_servicio: Optional[float] = None,
    imagen_servicio: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    servicio = db.query(Servicio).filter(Servicio.id_servicio == servicio_id).first()
    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")

    # Permitir edición solo al propietario o al admin
    if servicio.id_usuario != current_user.id_usuario and getattr(current_user, "id_rol", None) != 1:
        raise HTTPException(status_code=403, detail="No autorizado para editar este servicio")

    if tipo_servicio is not None:
        servicio.tipo_servicio = tipo_servicio
    if descripcion_servicio is not None:
        servicio.descripcion_servicio = descripcion_servicio
    if estado_servicio is not None:
        servicio.estado_servicio = estado_servicio
    if precio_servicio is not None:
        servicio.precio_servicio = precio_servicio
    if imagen_servicio is not None:
        servicio.imagen_servicio = imagen_servicio

    db.commit()
    db.refresh(servicio)
    return servicio
