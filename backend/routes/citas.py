from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Cita, Mascota, Servicio, Usuario, MetodoPago
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

# Eliminar una cita
@router.delete("/{cita_id}")
def delete_cita(cita_id: int, db: Session = Depends(get_db)):
    cita = db.query(Cita).filter(Cita.id_cita == cita_id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    db.delete(cita)
    db.commit()
    return {"detail": "Cita eliminada"}
