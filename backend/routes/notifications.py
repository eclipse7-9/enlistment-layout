from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Notificacion, Usuario
from auth import get_current_user

router = APIRouter(prefix="/notificaciones", tags=["Notificaciones"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_notificaciones(db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    notifs = db.query(Notificacion).filter(Notificacion.id_usuario_destino == current_user.id_usuario).order_by(Notificacion.fecha_creacion.desc()).all()
    return notifs


@router.put("/{not_id}/leer")
def marcar_leida(not_id: int, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    notif = db.query(Notificacion).filter(Notificacion.id_notificacion == not_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notificación no encontrada")
    if notif.id_usuario_destino != current_user.id_usuario:
        raise HTTPException(status_code=403, detail="No autorizado")
    notif.leida = True
    db.commit()
    db.refresh(notif)
    return notif
