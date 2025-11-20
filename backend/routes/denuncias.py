from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Denuncia, Usuario, Notificacion, Cita, Servicio, Mensaje
from auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/denuncias", tags=["Denuncias"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def list_denuncias(db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    # Solo admins
    if current_user.id_rol != 1:
        raise HTTPException(status_code=403, detail="Acceso denegado")

    results = []
    denuncias = db.query(Denuncia).order_by(Denuncia.fecha_creacion.desc()).all()
    for d in denuncias:
        reporter = db.query(Usuario).filter(Usuario.id_usuario == d.id_reportador).first()
        objetivo = db.query(Usuario).filter(Usuario.id_usuario == d.id_objetivo).first() if d.id_objetivo else None
        results.append({
            "id_denuncia": d.id_denuncia,
            "id_cita": d.id_cita,
            "id_reportador": d.id_reportador,
            "reportador_email": reporter.correo_usuario if reporter else None,
            "id_objetivo": d.id_objetivo,
            "objetivo_email": objetivo.correo_usuario if objetivo else None,
            "motivo": d.motivo,
            "descripcion": d.descripcion,
            "fecha_creacion": str(d.fecha_creacion),
            "resuelta": bool(d.resuelta),
        })
    return results


class ActionPayload(BaseModel):
    mensaje: str | None = None


@router.put("/{id_denuncia}/invalidate")
def invalidate_denuncia(id_denuncia: int, payload: ActionPayload, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    """El admin puede invalidar la denuncia (marcarla como resuelta/incorrecta) y notificar a las partes.
    Se enviará una notificación al reportador y al objetivo (si existe) con el texto opcional `mensaje`.
    """
    if current_user.id_rol != 1:
        raise HTTPException(status_code=403, detail="Acceso denegado")

    d = db.query(Denuncia).filter(Denuncia.id_denuncia == id_denuncia).first()
    if not d:
        raise HTTPException(status_code=404, detail="Denuncia no encontrada")

    try:
        d.resuelta = True
        db.commit()

        texto = payload.mensaje or "La denuncia ha sido revisada por un administrador y se ha determinado que no procede."

        # Notificar al reportador
        notif1 = Notificacion(
            id_usuario_destino=d.id_reportador,
            titulo="Denuncia invalidada",
            mensaje=texto,
            url=f"/mis-citas/{d.id_cita}" if d.id_cita else None,
            leida=False,
            fecha_creacion=datetime.utcnow(),
            id_cita=d.id_cita,
        )
        db.add(notif1)

        # Notificar al objetivo si existe
        if d.id_objetivo:
            notif2 = Notificacion(
                id_usuario_destino=d.id_objetivo,
                titulo="Denuncia invalidada",
                mensaje=texto,
                url=None,
                leida=False,
                fecha_creacion=datetime.utcnow(),
                id_cita=d.id_cita,
            )
            db.add(notif2)

        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"No se pudo invalidar la denuncia: {str(e)}")

    return {"msg": "Denuncia invalidada y partes notificadas"}


@router.put("/{id_denuncia}/inactivate_user")
def inactivate_user(id_denuncia: int, payload: ActionPayload, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    """El admin puede inactivar la cuenta del usuario objetivo de la denuncia y notificar.
    Se envía notificación al usuario afectado y al reportador.
    """
    if current_user.id_rol != 1:
        raise HTTPException(status_code=403, detail="Acceso denegado")

    d = db.query(Denuncia).filter(Denuncia.id_denuncia == id_denuncia).first()
    if not d:
        raise HTTPException(status_code=404, detail="Denuncia no encontrada")

    if not d.id_objetivo:
        raise HTTPException(status_code=400, detail="No hay usuario objetivo para inactivar")

    objetivo = db.query(Usuario).filter(Usuario.id_usuario == d.id_objetivo).first()
    if not objetivo:
        raise HTTPException(status_code=404, detail="Usuario objetivo no encontrado")

    try:
        objetivo.estado_usuario = 'Inactivo'
        db.commit()

        texto = payload.mensaje or "Su cuenta ha sido inactivada temporalmente por una revisión administrativa relacionada con una denuncia. Contacte al soporte para más información."

        notif = Notificacion(
            id_usuario_destino=objetivo.id_usuario,
            titulo="Usuario inactivado",
            mensaje=texto,
            url=None,
            leida=False,
            fecha_creacion=datetime.utcnow(),
            id_cita=d.id_cita,
        )
        db.add(notif)

        # Notificar al reportador también
        notif2 = Notificacion(
            id_usuario_destino=d.id_reportador,
            titulo="Usuario inactivado",
            mensaje=texto,
            url=None,
            leida=False,
            fecha_creacion=datetime.utcnow(),
            id_cita=d.id_cita,
        )
        db.add(notif2)

        d.resuelta = True
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"No se pudo inactivar el usuario: {str(e)}")

    return {"msg": "Usuario inactivado y notificaciones enviadas"}


@router.get("/{id_denuncia}/mensaje")
def get_denuncia_mensaje(id_denuncia: int, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    """Permite al admin ver el mensaje enviado por el emprendedor relacionado con la cita de la denuncia."""
    if current_user.id_rol != 1:
        raise HTTPException(status_code=403, detail="Acceso denegado")

    d = db.query(Denuncia).filter(Denuncia.id_denuncia == id_denuncia).first()
    if not d:
        raise HTTPException(status_code=404, detail="Denuncia no encontrada")

    if not d.id_cita:
        raise HTTPException(status_code=400, detail="La denuncia no está relacionada con una cita")

    cita = db.query(Cita).filter(Cita.id_cita == d.id_cita).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")

    servicio = db.query(Servicio).filter(Servicio.id_servicio == cita.id_servicio).first()
    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")

    # Buscar el mensaje enviado por el dueño del servicio (emprendedor) para esa cita
    msg = db.query(Mensaje).filter(Mensaje.id_cita == cita.id_cita, Mensaje.id_emisor == servicio.id_usuario).first()
    if not msg:
        return {"msg": "No hay mensaje enviado por el emprendedor para esta cita"}

    return {
        "id_mensaje": msg.id_mensaje,
        "id_emisor": msg.id_emisor,
        "id_receptor": msg.id_receptor,
        "mensaje": msg.mensaje,
        "fecha_creacion": str(msg.fecha_creacion),
        "denunciado": bool(msg.denunciado),
    }
