from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Cita, Mascota, Servicio, Usuario, MetodoPago, Notificacion, Pedido, Recibo
from decimal import Decimal
from schemas import CitaCreate, CitaUpdateEstado
from auth import get_current_user
from datetime import datetime, date, time

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
    # Unir Cita con Servicio y filtrar por el dueño del servicio
    results = []
    citas = db.query(Cita).join(Servicio, Cita.id_servicio == Servicio.id_servicio).filter(Servicio.id_usuario == current_user.id_usuario).all()
    for c in citas:
        servicio = db.query(Servicio).filter(Servicio.id_servicio == c.id_servicio).first()
        results.append({
            "id_cita": c.id_cita,
            "id_servicio": c.id_servicio,
            "tipo_servicio": servicio.tipo_servicio if servicio else None,
            "id_usuario": c.id_usuario,
            "fecha_cita": str(c.fecha_cita),
            "hora_cita": str(c.hora_cita),
            "estado_cita": c.estado_cita,
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

# Eliminar una cita
@router.delete("/{cita_id}")
def delete_cita(cita_id: int, db: Session = Depends(get_db)):
    cita = db.query(Cita).filter(Cita.id_cita == cita_id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    db.delete(cita)
    db.commit()
    return {"detail": "Cita eliminada"}
