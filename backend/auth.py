# backend/auth.py
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="usuarios/login")
SECRET_KEY = "tu_clave_secreta_aqui"
ALGORITHM = "HS256"


def get_current_actor(token: str = Depends(oauth2_scheme)):
    """Decodifica el token y devuelve un Usuario o un Proveedor si existe.
    Útil para endpoints que aceptan tanto usuarios (admins) como proveedores.
    """
    from models import Usuario, Proveedor
    from database import SessionLocal

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        correo = payload.get("sub")
        if correo is None:
            raise HTTPException(status_code=401, detail="Token inválido")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")

    db = SessionLocal()
    # buscar en usuarios primero
    usuario = db.query(Usuario).filter(Usuario.correo_usuario == correo).first()
    if usuario:
        db.close()
        return usuario

    proveedor = db.query(Proveedor).filter(Proveedor.correo_proveedor == correo).first()
    db.close()
    if proveedor:
        return proveedor

    raise HTTPException(status_code=404, detail="Actor no encontrado")


def get_current_user(token: str = Depends(oauth2_scheme)):
    """Compatibilidad hacia atrás: devuelve un Usuario si el token pertenece a un usuario.
    Muchos módulos importaban `get_current_user`; mantenemos esta API para evitar romperlos.
    """
    from models import Usuario
    from database import SessionLocal

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        correo = payload.get("sub")
        if correo is None:
            raise HTTPException(status_code=401, detail="Token inválido")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")

    db = SessionLocal()
    usuario = db.query(Usuario).filter(Usuario.correo_usuario == correo).first()
    db.close()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario
