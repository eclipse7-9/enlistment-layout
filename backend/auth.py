# backend/auth.py
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="usuarios/login")
SECRET_KEY = "tu_clave_secreta_aqui"
ALGORITHM = "HS256"

def get_current_user(token: str = Depends(oauth2_scheme)):
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
