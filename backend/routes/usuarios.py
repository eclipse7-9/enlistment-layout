from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Usuario
from pydantic import BaseModel
from utils.security import hash_password, verify_password, create_access_token
from sqlalchemy.exc import IntegrityError
import base64
from io import BytesIO
from PIL import Image
from pathlib import Path
import uuid

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
    id_rol: int = 4  # Cliente por defecto
    estado_usuario: str = "activo"


class LoginRequest(BaseModel):
    correo_usuario: str
    password_usuario: str


# 🔧 Esquema de actualización extendido
class UsuarioUpdate(BaseModel):
    nombre_usuario: str | None = None
    apellido_usuario: str | None = None
    correo_usuario: str | None = None
    telefono_usuario: str | None = None
    direccion_usuario: str | None = None
    codigo_postal_usuario: str | None = None
    estado_usuario: str | None = None
    imagen_usuario: str | None = None

    class Config:
        orm_mode = True


# -------------------- CRUD --------------------
@router.get("/")
def get_usuarios(db: Session = Depends(get_db)):
    return db.query(Usuario).all()


@router.post("/")
def create_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    hashed_pw = hash_password(usuario.password_usuario)
    nuevo_usuario = Usuario(
        nombre_usuario=usuario.nombre_usuario,
        apellido_usuario=usuario.apellido_usuario,
        correo_usuario=usuario.correo_usuario,
        telefono_usuario=usuario.telefono_usuario,
        password_usuario=hashed_pw,
        direccion_usuario=usuario.direccion_usuario,
        codigo_postal_usuario=usuario.codigo_postal_usuario,
        imagen_usuario=usuario.imagen_usuario,
        id_rol=usuario.id_rol,
        estado_usuario=usuario.estado_usuario
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return {"msg": "Usuario creado", "usuario": nuevo_usuario.correo_usuario}


@router.get("/{usuario_id}")
def get_usuario(usuario_id: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario


# 🔧 Endpoint de actualización (para editar datos o cambiar estado)
@router.put("/{usuario_id}")
def update_usuario(usuario_id: int, request: UsuarioUpdate, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    for key, value in request.dict(exclude_unset=True).items():
        setattr(usuario, key, value)

    db.commit()
    db.refresh(usuario)
    return {"msg": "Usuario actualizado", "usuario": usuario.correo_usuario}


@router.delete("/{id_usuario}")
def eliminar_usuario(id_usuario: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    try:
        db.delete(usuario)
        db.commit()
        return {"message": f"Usuario con id {id_usuario} eliminado correctamente"}
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="No se puede eliminar el usuario porque tiene datos relacionados (mascotas, pedidos, etc.)"
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error inesperado: {str(e)}")


# -------------------- Register --------------------
@router.post("/register")
def register_user(request: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(Usuario).filter(Usuario.correo_usuario == request.correo_usuario).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

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


# -------------------- Login --------------------
@router.patch("/{id_usuario}/imagen", response_model=dict)
async def update_profile_picture(
    id_usuario: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    print(f"Received image upload request for user {id_usuario}")
    usuario = db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    try:
        # Read and process the image
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Archivo vacío")
            
        print(f"Image size: {len(contents)} bytes")
        
        # Validate image format
        try:
            img = Image.open(BytesIO(contents))
            print(f"Original image format: {img.format}, size: {img.size}")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Formato de imagen inválido: {str(e)}")
        
        # Resize if too large
        max_size = (800, 800)
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        print(f"Resized image size: {img.size}")
        
        # Guardar la imagen en disco en backend/static/uploads
        uploads_dir = Path(__file__).resolve().parent.parent / "static" / "uploads"
        uploads_dir.mkdir(parents=True, exist_ok=True)

        # Determinar extensión segura
        original_ext = Path(file.filename).suffix if file.filename else ".jpg"
        if original_ext == "":
            original_ext = ".jpg"

        filename = f"{id_usuario}_{uuid.uuid4().hex}{original_ext}"
        file_path = uploads_dir / filename

        # Convertir a JPEG para uniformidad
        buffer = BytesIO()
        img.convert('RGB').save(buffer, format='JPEG', quality=85)
        with open(file_path, "wb") as f:
            f.write(buffer.getvalue())

        # Guardar ruta relativa en la DB (/static/uploads/filename)
        usuario.imagen_usuario = f"/static/uploads/{filename}"
        db.commit()
        db.refresh(usuario)
        print("Image saved to disk at:", str(file_path), "db field length=", len(usuario.imagen_usuario or ""))

        return {
            "mensaje": "Imagen actualizada",
            "imagen_usuario": usuario.imagen_usuario
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/login")
def login_user(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.correo_usuario == request.correo_usuario).first()

    if not user or not verify_password(request.password_usuario, user.password_usuario):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    # 🚫 Bloquear inicio de sesión si el usuario está inactivo
    if user.estado_usuario.lower() != "activo":
        raise HTTPException(status_code=403, detail="Tu cuenta está inactiva. Contacta al administrador.")

    access_token = create_access_token(data={"sub": user.correo_usuario})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "correo": user.correo_usuario,
        "id_usuario": user.id_usuario,
        "nombre_usuario": user.nombre_usuario,
        "id_rol": user.id_rol,
        "imagen_usuario": user.imagen_usuario,
        "estado_usuario": user.estado_usuario,
    }
