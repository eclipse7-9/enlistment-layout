from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Usuario, Region, Ciudad
import logging
from pydantic import BaseModel, EmailStr
from utils.security import hash_password, verify_password, create_access_token
from sqlalchemy.exc import IntegrityError
import base64
from io import BytesIO
from PIL import Image
from pathlib import Path
import uuid
from services.verification_service import send_verification_email, verify_code
import os

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
    id_region: int
    id_ciudad: int
    imagen_usuario: str | None = None
    id_rol: int
    estado_usuario: str

    class Config:
        orm_mode = True


class RegisterRequest(BaseModel):
    nombre_usuario: str
    apellido_usuario: str
    correo_usuario: EmailStr
    telefono_usuario: str
    password_usuario: str
    id_region: int
    id_ciudad: int
    imagen_usuario: str | None = None
    id_rol: int = 4  # Cliente por defecto
    estado_usuario: str = "activo"

class VerificationRequest(BaseModel):
    correo_usuario: EmailStr

class VerifyCodeRequest(BaseModel):
    correo_usuario: EmailStr
    code: str
    user_data: RegisterRequest


class LoginRequest(BaseModel):
    correo_usuario: str
    password_usuario: str


# 🔧 Esquema de actualización extendido
class UsuarioUpdate(BaseModel):
    nombre_usuario: str | None = None
    apellido_usuario: str | None = None
    correo_usuario: str | None = None
    telefono_usuario: str | None = None
    id_region: int | None = None
    id_ciudad: int | None = None
    estado_usuario: str | None = None
    imagen_usuario: str | None = None

    class Config:
        orm_mode = True


# Esquema para cambio de contraseña
class PasswordChange(BaseModel):
    current_password: str
    new_password: str

    class Config:
        orm_mode = True

# Esquemas para recuperación de contraseña
class PasswordRecoveryRequest(BaseModel):
    correo_usuario: EmailStr

class PasswordRecoveryVerify(BaseModel):
    correo_usuario: EmailStr
    code: str
    new_password: str


# -------------------- Rutas de verificación --------------------
@router.post("/request-verification")
async def request_verification(data: VerificationRequest):
    """Solicita un código de verificación por correo"""
    try:
        await send_verification_email(data.correo_usuario)
        return {"message": "Código de verificación enviado"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify-and-register")
async def verify_and_register(data: VerifyCodeRequest, db: Session = Depends(get_db)):
    """Verifica el código y registra al usuario"""
    try:
        # Imprimir datos recibidos para debug
        print("Datos recibidos:", data)
        # Verificar el código
        if not verify_code(data.correo_usuario, data.code):
            raise HTTPException(status_code=400, detail="Código inválido")
    except Exception as e:
        # Mostrar error detallado
        import traceback
        print("Error detallado:", str(e))
        print("Traceback completo:", traceback.format_exc())
        # Si es un error de validación de Pydantic, mostrar todos los errores
        if hasattr(e, 'errors'):
            return JSONResponse(
                status_code=400,
                content={"detail": e.errors()}
            )
        raise HTTPException(status_code=400, detail=str(e))
    
    # Proceder con el registro
    try:
        # Hash de la contraseña
        hashed_pw = hash_password(data.user_data.password_usuario)
        
        # Crear el usuario
        nuevo_usuario = Usuario(
            nombre_usuario=data.user_data.nombre_usuario,
            apellido_usuario=data.user_data.apellido_usuario,
            correo_usuario=data.user_data.correo_usuario,
            telefono_usuario=data.user_data.telefono_usuario,
            password_usuario=hashed_pw,
            id_region=data.user_data.id_region,
            id_ciudad=data.user_data.id_ciudad,
            imagen_usuario=data.user_data.imagen_usuario,
            id_rol=data.user_data.id_rol,
            estado_usuario=data.user_data.estado_usuario
        )
        
        db.add(nuevo_usuario)
        db.commit()
        db.refresh(nuevo_usuario)
        
        return {
            "message": "Usuario registrado exitosamente",
            "usuario": nuevo_usuario
        }
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="El correo ya está registrado")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

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
        id_region=usuario.id_region,
        id_ciudad=usuario.id_ciudad,
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
        # Solo setear atributos que realmente existen en el modelo para evitar errores
        if hasattr(usuario, key):
            setattr(usuario, key, value)

    db.commit()
    db.refresh(usuario)
    return {"msg": "Usuario actualizado", "usuario": usuario}



# -------------------- Recuperación de Contraseña --------------------
from services.password_recovery_service import send_recovery_email, verify_recovery_code

@router.get("/check-role/{email}")
async def check_user_role(email: str, db: Session = Depends(get_db)):
    """Verifica el rol de un usuario por su correo"""
    user = db.query(Usuario).filter(Usuario.correo_usuario == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return {"id_rol": user.id_rol}

@router.post("/request-password-recovery")
async def request_password_recovery(data: PasswordRecoveryRequest, db: Session = Depends(get_db)):
    """Solicita un código de recuperación de contraseña"""
    # Verificar que el usuario existe
    user = db.query(Usuario).filter(Usuario.correo_usuario == data.correo_usuario).first()
    if not user:
        # Por seguridad, no revelamos si el correo existe o no
        return {"message": "Si el correo existe, recibirás un código de recuperación"}
    
    try:
        await send_recovery_email(data.correo_usuario)
        return {"message": "Código de recuperación enviado"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify-and-reset-password")
async def verify_and_reset_password(data: PasswordRecoveryVerify, db: Session = Depends(get_db)):
    """Verifica el código y actualiza la contraseña"""
    # Buscar el usuario
    user = db.query(Usuario).filter(Usuario.correo_usuario == data.correo_usuario).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Si es administrador (rol 1), no necesita verificar código
    if user.id_rol != 1:
        # Verificar el código para usuarios no administradores
        if not verify_recovery_code(data.correo_usuario, data.code):
            raise HTTPException(status_code=400, detail="Código inválido")
    
    # Actualizar la contraseña
    user = db.query(Usuario).filter(Usuario.correo_usuario == data.correo_usuario).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Hash de la nueva contraseña
    hashed_pw = hash_password(data.new_password)
    user.password_usuario = hashed_pw
    
    try:
        db.commit()
        return {"message": "Contraseña actualizada exitosamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint para cambiar contraseña (requiere contraseña actual)
@router.put("/{usuario_id}/password")
def change_password(usuario_id: int, payload: PasswordChange, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # verificar contraseña actual
    if not verify_password(payload.current_password, usuario.password_usuario):
        raise HTTPException(status_code=401, detail="Contraseña actual incorrecta")

    # actualizar con la nueva contraseña hasheada
    hashed = hash_password(payload.new_password)
    usuario.password_usuario = hashed
    db.commit()
    db.refresh(usuario)
    return {"msg": "Contraseña actualizada correctamente"}


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


# -------------------- Register Special Roles --------------------
@router.post("/register-admin")
def register_admin(request: RegisterRequest, admin_key: str, db: Session = Depends(get_db)):
    """Registra un nuevo administrador sin verificación de correo"""
    # Clave secreta para crear administradores - en producción usar variable de entorno
    ADMIN_CREATION_KEY = "PetHealth2023Admin"
    
    if admin_key != ADMIN_CREATION_KEY:
        raise HTTPException(status_code=403, detail="Clave de administrador inválida")

    # Verificar si el correo ya existe
    existing_user = db.query(Usuario).filter(Usuario.correo_usuario == request.correo_usuario).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

    try:
        # Hash de la contraseña
        hashed_pw = hash_password(request.password_usuario)
        
        # Crear el usuario con rol de administrador
        nuevo_usuario = Usuario(
            nombre_usuario=request.nombre_usuario,
            apellido_usuario=request.apellido_usuario,
            correo_usuario=request.correo_usuario,
            telefono_usuario=request.telefono_usuario,
            password_usuario=hashed_pw,
            id_region=request.id_region,
            id_ciudad=request.id_ciudad,
            imagen_usuario=request.imagen_usuario,
            id_rol=1,  # Forzar rol de administrador
            estado_usuario="activo"
        )
        
        db.add(nuevo_usuario)
        db.commit()
        db.refresh(nuevo_usuario)
        
        return {
            "message": "Administrador creado exitosamente",
            "id_usuario": nuevo_usuario.id_usuario
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/register-domiciliario")
def register_domiciliario(request: RegisterRequest, domiciliario_key: str, db: Session = Depends(get_db)):
    """Registra un nuevo domiciliario sin verificación de correo"""
    # Clave secreta para crear domiciliarios
    DOMICILIARIO_CREATION_KEY = "domiciliophs34"
    
    if domiciliario_key != DOMICILIARIO_CREATION_KEY:
        raise HTTPException(status_code=403, detail="Clave de registro de domiciliario inválida")

    # Verificar si el correo ya existe
    existing_user = db.query(Usuario).filter(Usuario.correo_usuario == request.correo_usuario).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

    try:
        # Hash de la contraseña
        hashed_pw = hash_password(request.password_usuario)
        
        # Crear el usuario con rol de domiciliario
        nuevo_usuario = Usuario(
            nombre_usuario=request.nombre_usuario,
            apellido_usuario=request.apellido_usuario,
            correo_usuario=request.correo_usuario,
            telefono_usuario=request.telefono_usuario,
            password_usuario=hashed_pw,
            id_region=request.id_region,
            id_ciudad=request.id_ciudad,
            imagen_usuario=request.imagen_usuario,
            id_rol=3,  # Forzar rol de domiciliario
            estado_usuario="activo"
        )
        
        db.add(nuevo_usuario)
        db.commit()
        db.refresh(nuevo_usuario)
        
        return {
            "message": "Domiciliario creado exitosamente",
            "id_usuario": nuevo_usuario.id_usuario
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    # Verificar si el correo ya existe
    existing_user = db.query(Usuario).filter(Usuario.correo_usuario == request.correo_usuario).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

    try:
        # Hash de la contraseña
        hashed_pw = hash_password(request.password_usuario)
        
        # Crear el usuario con rol de administrador
        nuevo_usuario = Usuario(
            nombre_usuario=request.nombre_usuario,
            apellido_usuario=request.apellido_usuario,
            correo_usuario=request.correo_usuario,
            telefono_usuario=request.telefono_usuario,
            password_usuario=hashed_pw,
            id_region=request.id_region,
            id_ciudad=request.id_ciudad,
            imagen_usuario=request.imagen_usuario,
            id_rol=1,  # Forzar rol de administrador
            estado_usuario="activo"
        )
        
        db.add(nuevo_usuario)
        db.commit()
        db.refresh(nuevo_usuario)
        
        return {
            "message": "Administrador creado exitosamente",
            "id_usuario": nuevo_usuario.id_usuario
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# -------------------- Register --------------------
@router.post("/register")
def register_user(request: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(Usuario).filter(Usuario.correo_usuario == request.correo_usuario).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

    hashed_pw = hash_password(request.password_usuario)
    # Validar que la región/ciudad existen
    region = db.query(Region).filter(Region.id_region == request.id_region).first()
    ciudad = db.query(Ciudad).filter(Ciudad.id_ciudad == request.id_ciudad).first()
    if not region:
        raise HTTPException(status_code=400, detail="Región inválida")
    if not ciudad:
        raise HTTPException(status_code=400, detail="Ciudad inválida")

    nuevo_usuario = Usuario(
        nombre_usuario=request.nombre_usuario,
        apellido_usuario=request.apellido_usuario,
        correo_usuario=request.correo_usuario,
        telefono_usuario=request.telefono_usuario,
        password_usuario=hashed_pw,
        id_region=request.id_region,
        id_ciudad=request.id_ciudad,
        imagen_usuario=request.imagen_usuario,
        id_rol=request.id_rol,
        estado_usuario=request.estado_usuario
    )

    try:
        db.add(nuevo_usuario)
        db.commit()
        db.refresh(nuevo_usuario)
        return {"msg": "Usuario registrado con éxito", "usuario": nuevo_usuario.correo_usuario}
    except IntegrityError as ie:
        db.rollback()
        logging.exception("Integrity error creating user")
        raise HTTPException(status_code=400, detail=str(ie.orig) if getattr(ie, 'orig', None) else str(ie))
    except Exception as e:
        db.rollback()
        logging.exception("Unexpected error creating user")
        raise HTTPException(status_code=500, detail="Error interno al crear usuario")


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
