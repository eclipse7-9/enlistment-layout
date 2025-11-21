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


@router.post("/")
def create_notificacion(payload: dict, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    """Crear una notificación desde el frontend.

    Payload esperado (ejemplos):
    {
      "tipo": "cancelacion_domicilio",
      "mensaje": "...",
      "domicilio_id": 12,
      "destinatario": "admin"   # o un id de usuario (int)
    }
    """
    tipo = payload.get("tipo") or "notificacion"
    mensaje = payload.get("mensaje") or ""
    destinatario = payload.get("destinatario")

    created = []

    # Enviar a todos los admins si el frontend pide 'admin'
    if destinatario == "admin":
        admins = db.query(Usuario).filter(Usuario.id_rol == 1).all()
        if not admins:
            raise HTTPException(status_code=404, detail="No se encontraron administradores")
        for a in admins:
            n = Notificacion(id_usuario_destino=a.id_usuario, titulo=tipo, mensaje=mensaje)
            db.add(n)
            db.commit()
            db.refresh(n)
            created.append(n)
        return created

    # Si destinatario es un id numérico, crear para ese usuario
    try:
        if destinatario is None:
            raise ValueError("destinatario ausente")
        target_id = int(destinatario)
        user = db.query(Usuario).filter(Usuario.id_usuario == target_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="Usuario destinatario no encontrado")
        n = Notificacion(id_usuario_destino=target_id, titulo=tipo, mensaje=mensaje)
        db.add(n)
        db.commit()
        db.refresh(n)
        return n
    except ValueError:
        raise HTTPException(status_code=400, detail="destinatario inválido")
