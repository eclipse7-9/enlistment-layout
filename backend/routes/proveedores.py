from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Proveedor
from schemas import ProveedorCreate, ProveedorUpdate
from utils.security import hash_password, verify_password, create_access_token
from fastapi import Body
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/proveedores", tags=["Proveedores"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Listar todos los proveedores
@router.get("/")
def get_proveedores(db: Session = Depends(get_db)):
    return db.query(Proveedor).all()

# Crear proveedor
@router.post("/")
def create_proveedor(proveedor: ProveedorCreate, db: Session = Depends(get_db)):
    data = proveedor.dict()
    pw = data.pop('password_proveedor', None)
    if pw:
        data['password_proveedor'] = hash_password(pw)
    nuevo_proveedor = Proveedor(**data)
    db.add(nuevo_proveedor)
    db.commit()
    db.refresh(nuevo_proveedor)
    return nuevo_proveedor


# Login para proveedores
class ProveedorLogin(BaseModel):
    correo_proveedor: EmailStr
    password_proveedor: str


@router.post('/login')
def login_proveedor(payload: ProveedorLogin = Body(...), db: Session = Depends(get_db)):
    proveedor = db.query(Proveedor).filter(Proveedor.correo_proveedor == payload.correo_proveedor).first()
    if not proveedor or not proveedor.password_proveedor:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    if not verify_password(payload.password_proveedor, proveedor.password_proveedor):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    # Normalizar y comprobar estado del proveedor (evitar falsos negativos por espacios o None)
    estado = (proveedor.estado_proveedor or '').strip().lower()
    if estado != 'activo':
        # Incluir el estado real en el detalle para depuración local
        raise HTTPException(status_code=403, detail=f"Cuenta de proveedor inactiva (estado: {proveedor.estado_proveedor})")

    access_token = create_access_token(data={"sub": proveedor.correo_proveedor})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "correo_proveedor": proveedor.correo_proveedor,
        "id_proveedor": proveedor.id_proveedor,
        "nombre_compania": proveedor.nombre_compania,
        "estado_proveedor": proveedor.estado_proveedor
    }

# Consultar proveedor por id
@router.get("/{proveedor_id}")
def get_proveedor(proveedor_id: int, db: Session = Depends(get_db)):
    proveedor = db.query(Proveedor).filter(Proveedor.id_proveedor == proveedor_id).first()
    if not proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    return proveedor

# Actualizar proveedor
@router.put("/{proveedor_id}")
def update_proveedor(proveedor_id: int, data: ProveedorUpdate, db: Session = Depends(get_db)):
    proveedor = db.query(Proveedor).filter(Proveedor.id_proveedor == proveedor_id).first()
    if not proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    
    for key, value in data.dict(exclude_unset=True).items():
        setattr(proveedor, key, value)

    db.commit()
    db.refresh(proveedor)
    return proveedor

# Eliminar proveedor
@router.delete("/{proveedor_id}")
def delete_proveedor(proveedor_id: int, db: Session = Depends(get_db)):
    proveedor = db.query(Proveedor).filter(Proveedor.id_proveedor == proveedor_id).first()
    if not proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    db.delete(proveedor)
    db.commit()
    return {"detail": "Proveedor eliminado"}
