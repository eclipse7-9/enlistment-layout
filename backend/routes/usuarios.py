from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Usuario
from pydantic import BaseModel
from utils.security import hash_password, verify_password, create_access_token


router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

# -------------------- Dependencia DB --------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------------------- Esquemas --------------------
class UsuarioCreate(BaseModel):
    nombre_usuario: str
    apellido_usuario: str
    correo_usuario: str
    telefono_usuario: str
    password_usuario: str
    direccion_usuario: str
    codigo_postal_usuario: str
    imagen_usuario: str | None = None
    id_rol: int
    estado_usuario: str

    class Config:
        orm_mode = True

class RegisterRequest(BaseModel):
    nombre_usuario: str
    apellido_usuario: str
    correo_usuario: str
    telefono_usuario: str
    password_usuario: str
    direccion_usuario: str
    codigo_postal_usuario: str
    imagen_usuario: str | None = None
    id_rol: int = 4   # cliente por defecto
    estado_usuario: str = "activo"

class LoginRequest(BaseModel):
    correo_usuario: str
    password_usuario: str

# -------------------- Rutas CRUD --------------------
@router.get("/")
def get_usuarios(db: Session = Depends(get_db)):
    usuarios = db.query(Usuario).all()
    return usuarios

@router.post("/")
def create_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    nuevo_usuario = Usuario(**usuario.dict())
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario

@router.get("/{usuario_id}")
def get_usuario(usuario_id: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

@router.delete("/{usuario_id}")
def delete_usuario(usuario_id: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    db.delete(usuario)
    db.commit()
    return {"detail": "Usuario eliminado"}

# -------------------- Register & Login --------------------
@router.post("/register")
def register_user(request: RegisterRequest, db: Session = Depends(get_db)):
    print("📩 Body recibido en /usuarios/register:", request.dict()) 
    existing_user = db.query(Usuario).filter(Usuario.correo_usuario == request.correo_usuario).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

    # 🔒 Se usa bcrypt_sha256
    hashed_pw = hash_password(request.password_usuario)

    nuevo_usuario = Usuario(
        nombre_usuario=request.nombre_usuario,
        apellido_usuario=request.apellido_usuario,
        correo_usuario=request.correo_usuario,
        telefono_usuario=request.telefono_usuario,
        password_usuario=hashed_pw,
        direccion_usuario=request.direccion_usuario,
        codigo_postal_usuario=request.codigo_postal_usuario,
        imagen_usuario=request.imagen_usuario,
        id_rol=request.id_rol,
        estado_usuario=request.estado_usuario
    )

    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    return {"msg": "Usuario registrado con éxito", "usuario": nuevo_usuario.correo_usuario}


@router.post("/login")
def login_user(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.correo_usuario == request.correo_usuario).first()
    if not user or not verify_password(request.password_usuario, user.password_usuario):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    # 🎟️ Genera token JWT
    access_token = create_access_token(data={"sub": user.correo_usuario})
    return {"access_token": access_token, "token_type": "bearer"}