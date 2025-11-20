from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Cita, Mascota, Servicio, Usuario, MetodoPago, Notificacion, Pedido, Recibo, Mensaje, Bloqueo, Denuncia
from decimal import Decimal
from schemas import CitaCreate, CitaUpdateEstado
from auth import get_current_user
from datetime import datetime, date, time
from pydantic import BaseModel

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


# Listar citas para los servicios del emprendedor autenticado
@router.get("/owner")
def get_citas_owner(db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    # Unir Cita con Servicio y filtrar por el dueño del servicio.
    # Además incluimos datos básicos de la mascota para que el emprendedor pueda verlos.
    results = []
    citas = db.query(Cita).join(Servicio, Cita.id_servicio == Servicio.id_servicio).filter(Servicio.id_usuario == current_user.id_usuario).all()
    for c in citas:
        servicio = db.query(Servicio).filter(Servicio.id_servicio == c.id_servicio).first()
        mascota = db.query(Mascota).filter(Mascota.id_mascota == c.id_mascota).first()
        results.append({
            "id_cita": c.id_cita,
            "id_servicio": c.id_servicio,
            "tipo_servicio": servicio.tipo_servicio if servicio else None,
            "id_usuario": c.id_usuario,
            "fecha_cita": str(c.fecha_cita),
            "hora_cita": str(c.hora_cita),
            "estado_cita": c.estado_cita,
            "id_mascota": c.id_mascota,
            "mascota": {
                "nombre": mascota.nombre_mascota if mascota else None,
                "edad": mascota.edad_mascota if mascota else None,
                "peso": mascota.peso_mascota if mascota else None,
                "altura": mascota.altura_mascota if mascota else None,
                "especie": mascota.especie_mascota if mascota else None,
            } if mascota else None
        })
    return results

# Crear una nueva cita (propietario = usuario autenticado)
@router.post("/")
def create_cita(cita: CitaCreate, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    # validar mascota pertenece al usuario
    mascota = db.query(Mascota).filter(Mascota.id_mascota == cita.id_mascota).first()
    if not mascota:
        raise HTTPException(status_code=400, detail="Mascota no encontrada")
    if mascota.id_usuario != current_user.id_usuario:
        raise HTTPException(status_code=403, detail="La mascota no pertenece al usuario autenticado")

    # validar servicio existe
    servicio = db.query(Servicio).filter(Servicio.id_servicio == cita.id_servicio).first()
    if not servicio:
        raise HTTPException(status_code=400, detail="Servicio no encontrado")

    # validar método de pago por id y que pertenezca al usuario autenticado
    metodo = db.query(MetodoPago).filter(MetodoPago.id_metodo_pago == cita.id_metodo_pago).first()
    if not metodo:
        raise HTTPException(status_code=400, detail="Método de pago no encontrado")
    if metodo.id_usuario != current_user.id_usuario:
        raise HTTPException(status_code=403, detail="El método de pago no pertenece al usuario autenticado")

    # parsear fecha/hora
    try:
        fecha_obj = datetime.strptime(cita.fecha_cita, "%Y-%m-%d").date()
    except Exception:
        raise HTTPException(status_code=400, detail="Formato de fecha inválido. Use YYYY-MM-DD")
    try:
        # aceptar HH:MM o HH:MM:SS
        hora_obj = datetime.strptime(cita.hora_cita, "%H:%M").time()
    except Exception:
        try:
            hora_obj = datetime.strptime(cita.hora_cita, "%H:%M:%S").time()
        except Exception:
            raise HTTPException(status_code=400, detail="Formato de hora inválido. Use HH:MM")
            
    # la cita siempre inicia como pendiente (el usuario podrá confirmarla después)
    estado_inicial = "pendiente"

    # guardamos en la cita el tipo de método (texto) para mantener compatibilidad con la columna Enum actual
    nueva_cita = Cita(
        fecha_cita=fecha_obj,
        hora_cita=hora_obj,
        metodo_pago=metodo.tipo_metodo,
        estado_cita=estado_inicial,
        id_usuario=current_user.id_usuario,
        id_mascota=cita.id_mascota,
        id_servicio=cita.id_servicio,
    )
    db.add(nueva_cita)
    db.commit()
    db.refresh(nueva_cita)
    # Crear pedido y recibo asociados a la cita (registro en 'Mi Cuenta')
    try:
        pedido = Pedido(
            total=Decimal(0),
            id_metodo_pago=cita.id_metodo_pago,
            estado_pedido="pendiente",
            id_usuario=current_user.id_usuario,
        )
        db.add(pedido)
        db.commit()
        db.refresh(pedido)

        recibo = Recibo(
            monto_pagado=Decimal(0),
            estado_recibo="emitido",
            id_pedido=pedido.id_pedido,
        )
        db.add(recibo)
        db.commit()
    except Exception:
        db.rollback()
    # Crear notificación para el emprendedor dueño del servicio
    try:
        titulo = f"Nueva cita pendiente: {servicio.tipo_servicio}"
        mensaje = f"El usuario con id {current_user.id_usuario} ha reservado una cita para {servicio.tipo_servicio} el {fecha_obj} a las {hora_obj}."
        notif = Notificacion(
            id_usuario_destino=servicio.id_usuario,
            titulo=titulo,
            mensaje=mensaje,
            url=f"/citas/{nueva_cita.id_cita}",
            leida=False,
            fecha_creacion=datetime.utcnow(),
            id_cita=nueva_cita.id_cita,
        )
        db.add(notif)
        db.commit()
    except Exception:
        # No detener la creación de la cita si la notificación falla
        db.rollback()
    return nueva_cita

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


# Confirmar una cita (por el dueño del servicio)
@router.post("/{cita_id}/confirm")
def confirm_cita(cita_id: int, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    cita = db.query(Cita).filter(Cita.id_cita == cita_id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    servicio = db.query(Servicio).filter(Servicio.id_servicio == cita.id_servicio).first()
    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    # Solo el dueño del servicio puede confirmar
    if servicio.id_usuario != current_user.id_usuario:
        raise HTTPException(status_code=403, detail="No autorizado para confirmar esta cita")

    cita.estado_cita = "confirmada"
    db.commit()
    db.refresh(cita)

    # Notificar al usuario que creó la cita
    try:
        titulo = f"Cita confirmada: {servicio.tipo_servicio}"
        mensaje = f"Tu cita para {servicio.tipo_servicio} el {cita.fecha_cita} a las {cita.hora_cita} ha sido confirmada."
        notif = Notificacion(
            id_usuario_destino=cita.id_usuario,
            titulo=titulo,
            mensaje=mensaje,
            url=f"/mis-citas/{cita.id_cita}",
            leida=False,
            fecha_creacion=datetime.utcnow(),
            id_cita=cita.id_cita,
        )
        db.add(notif)
        db.commit()
    except Exception:
        db.rollback()

    return cita


# Cancelar una cita (por el dueño del servicio)
@router.post("/{cita_id}/cancel")
def cancel_cita(cita_id: int, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    cita = db.query(Cita).filter(Cita.id_cita == cita_id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    servicio = db.query(Servicio).filter(Servicio.id_servicio == cita.id_servicio).first()
    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    # Solo el dueño del servicio puede cancelar
    if servicio.id_usuario != current_user.id_usuario:
        raise HTTPException(status_code=403, detail="No autorizado para cancelar esta cita")

    cita.estado_cita = "cancelada"
    db.commit()
    db.refresh(cita)

    # Notificar al usuario que creó la cita
    try:
        titulo = f"Cita cancelada: {servicio.tipo_servicio}"
        mensaje = f"Lamentamos informarte que la cita para {servicio.tipo_servicio} el {cita.fecha_cita} a las {cita.hora_cita} ha sido cancelada."
        notif = Notificacion(
            id_usuario_destino=cita.id_usuario,
            titulo=titulo,
            mensaje=mensaje,
            url=f"/mis-citas/{cita.id_cita}",
            leida=False,
            fecha_creacion=datetime.utcnow(),
            id_cita=cita.id_cita,
        )
        db.add(notif)
        db.commit()
    except Exception:
        db.rollback()

    return cita


# Esquema para mensaje
class CitaMessage(BaseModel):
    mensaje: str


class ReportPayload(BaseModel):
    motivo: str


@router.get("/{cita_id}/messages")
def get_messages(cita_id: int, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    cita = db.query(Cita).filter(Cita.id_cita == cita_id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    # Only users involved can see messages
    servicio = db.query(Servicio).filter(Servicio.id_servicio == cita.id_servicio).first()
    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    if current_user.id_usuario not in (cita.id_usuario, servicio.id_usuario):
        raise HTTPException(status_code=403, detail="No autorizado para ver los mensajes de esta cita")

    msgs = db.query(Mensaje).filter(Mensaje.id_cita == cita_id).order_by(Mensaje.fecha_creacion.asc()).all()
    out = []
    for m in msgs:
        out.append({
            "id_mensaje": m.id_mensaje,
            "id_emisor": m.id_emisor,
            "id_receptor": m.id_receptor,
            "mensaje": m.mensaje,
            "fecha_creacion": str(m.fecha_creacion),
            "denunciado": m.denunciado,
        })
    return {"messages": out, "servicio_owner": servicio.id_usuario}


@router.post("/{cita_id}/messages")
def post_message(cita_id: int, payload: CitaMessage, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    cita = db.query(Cita).filter(Cita.id_cita == cita_id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    servicio = db.query(Servicio).filter(Servicio.id_servicio == cita.id_servicio).first()
    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")

    # Determine recipient
    if current_user.id_usuario == cita.id_usuario:
        receptor_id = servicio.id_usuario
    elif current_user.id_usuario == servicio.id_usuario:
        receptor_id = cita.id_usuario
    else:
        raise HTTPException(status_code=403, detail="No autorizado para enviar mensajes sobre esta cita")

    # If owner is sending, check bloqueo
    if current_user.id_usuario == servicio.id_usuario:
        bloqueo = db.query(Bloqueo).filter(Bloqueo.id_emprendedor == servicio.id_usuario, Bloqueo.id_usuario == cita.id_usuario, Bloqueo.activo == True).first()
        if bloqueo:
            raise HTTPException(status_code=403, detail="No puede enviar mensajes a este usuario (bloqueado)")

        # Only one message from the owner is allowed per cita
        existing_owner_msg = db.query(Mensaje).filter(Mensaje.id_cita == cita.id_cita, Mensaje.id_emisor == servicio.id_usuario).first()
        if existing_owner_msg:
            raise HTTPException(status_code=409, detail="Ya has enviado un mensaje para esta cita")

    # create Mensaje
    try:
        nuevo = Mensaje(
            id_cita=cita.id_cita,
            id_emisor=current_user.id_usuario,
            id_receptor=receptor_id,
            mensaje=payload.mensaje,
            fecha_creacion=datetime.utcnow(),
        )
        db.add(nuevo)
        db.commit()
        db.refresh(nuevo)

        # Notificar al receptor
        titulo = f"Mensaje sobre tu cita: {servicio.tipo_servicio}"
        notif = Notificacion(
            id_usuario_destino=receptor_id,
            titulo=titulo,
            mensaje=payload.mensaje,
            url=f"/mis-citas/{cita.id_cita}",
            leida=False,
            fecha_creacion=datetime.utcnow(),
            id_cita=cita.id_cita,
        )
        db.add(notif)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"No se pudo enviar el mensaje: {str(e)}")

    return {"msg": "Mensaje enviado", "id_mensaje": nuevo.id_mensaje}


@router.post("/{cita_id}/report")
def report_user(cita_id: int, payload: ReportPayload, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    """Permite a cualquier usuario autenticado enviar una denuncia relacionada con una cita.
    - Crea un registro en `denuncias`.
    - Si el reportador es el emprendedor (dueño del servicio), también crea un `bloqueo` para evitar mensajes futuros.
    - Notifica a los administradores para su revisión.
    """
    cita = db.query(Cita).filter(Cita.id_cita == cita_id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    servicio = db.query(Servicio).filter(Servicio.id_servicio == cita.id_servicio).first()
    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")

    # Determinar objetivo de la denuncia: si el reportador es el dueño del servicio, objetivo = cliente;
    # en caso contrario (cliente u otro), objetivo = dueño del servicio.
    id_reportador = current_user.id_usuario
    if current_user.id_usuario == servicio.id_usuario:
        id_objetivo = cita.id_usuario
    else:
        id_objetivo = servicio.id_usuario

    try:
        # Crear la denuncia persistente
        denuncia = Denuncia(
            id_cita=cita.id_cita,
            id_reportador=id_reportador,
            id_objetivo=id_objetivo,
            motivo=payload.motivo,
            descripcion=getattr(payload, 'descripcion', None) if hasattr(payload, 'descripcion') else None,
            fecha_creacion=datetime.utcnow(),
            resuelta=False,
        )
        db.add(denuncia)
        db.commit()
        db.refresh(denuncia)

        # Si el reportador es el emprendedor (dueño del servicio), crear bloqueo contra el usuario objetivo
        if id_reportador == servicio.id_usuario:
            bloqueo = Bloqueo(
                id_emprendedor=servicio.id_usuario,
                id_usuario=cita.id_usuario,
                motivo=payload.motivo,
                fecha_creacion=datetime.utcnow(),
                activo=True,
            )
            db.add(bloqueo)
            db.commit()

        # Notificar a admins
        admins = db.query(Usuario).filter(Usuario.id_rol == 1).all()
        for a in admins:
            notif = Notificacion(
                id_usuario_destino=a.id_usuario,
                titulo=f"Nueva denuncia relacionada a cita {cita.id_cita}",
                mensaje=f"Usuario {id_reportador} reportó a {id_objetivo}: {payload.motivo}",
                url=f"/admin/denuncias/{denuncia.id_denuncia}",
                leida=False,
                fecha_creacion=datetime.utcnow(),
                id_cita=cita.id_cita,
            )
            db.add(notif)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"No se pudo procesar la denuncia: {str(e)}")

    return {"msg": "Denuncia creada y administradores notificados"}


@router.get("/{cita_id}/blocked")
def is_blocked(cita_id: int, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    cita = db.query(Cita).filter(Cita.id_cita == cita_id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    servicio = db.query(Servicio).filter(Servicio.id_servicio == cita.id_servicio).first()
    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    # Only involved users can ask
    if current_user.id_usuario not in (cita.id_usuario, servicio.id_usuario):
        raise HTTPException(status_code=403, detail="No autorizado")

    bloqueo = db.query(Bloqueo).filter(Bloqueo.id_emprendedor == servicio.id_usuario, Bloqueo.id_usuario == cita.id_usuario, Bloqueo.activo == True).first()
    return {"blocked": bloqueo is not None}


@router.post("/{cita_id}/message")
def send_message_to_cliente(cita_id: int, payload: CitaMessage, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    """Permite al dueño del servicio enviar un mensaje al usuario que reservó la cita.
    Crea una Notificacion para el cliente destino con el mensaje proporcionado.
    """
    cita = db.query(Cita).filter(Cita.id_cita == cita_id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")

    servicio = db.query(Servicio).filter(Servicio.id_servicio == cita.id_servicio).first()
    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")

    # Solo el dueño del servicio puede enviar mensajes relacionados con la cita
    if servicio.id_usuario != current_user.id_usuario:
        raise HTTPException(status_code=403, detail="No autorizado para enviar mensajes sobre esta cita")

    # Crear notificación para el usuario que reservó la cita
    try:
        titulo = f"Mensaje sobre tu cita: {servicio.tipo_servicio}"
        mensaje = payload.mensaje
        notif = Notificacion(
            id_usuario_destino=cita.id_usuario,
            titulo=titulo,
            mensaje=mensaje,
            url=f"/mis-citas/{cita.id_cita}",
            leida=False,
            fecha_creacion=datetime.utcnow(),
            id_cita=cita.id_cita,
        )
        db.add(notif)
        db.commit()
    except Exception as e:
        db.rollback()
        # Propagar detalle de la excepción para diagnóstico en desarrollo
        raise HTTPException(status_code=500, detail=f"No se pudo enviar el mensaje: {str(e)}")

    return {"msg": "Mensaje enviado"}

# Eliminar una cita
@router.delete("/{cita_id}")
def delete_cita(cita_id: int, db: Session = Depends(get_db)):
    cita = db.query(Cita).filter(Cita.id_cita == cita_id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    db.delete(cita)
    db.commit()
    return {"detail": "Cita eliminada"}
