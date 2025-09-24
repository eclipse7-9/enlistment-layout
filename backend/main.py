from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Usuario
from database import SessionLocal, engine
from pydantic import BaseModel

class UsuarioCreate(BaseModel):
    nombre_usuario: str
    apellido_usuario: str
    correo_usuario: str
    telefono_usuario: str
    password_usuario: str
    direccion_usuario: str
    codigoPostal_usuario: str
    imagen_usuario: str | None = None
    id_rol: int
    estado_usuario: str
    
    class Config:
        orm_mode = True

app = FastAPI()

@app.get('/')
def root():
    return {"message": "olo wol"}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
"App para listar todos los usuarios"

@app.get("/usuarios/")
def get_usuarios(db: Session = Depends(get_db)):
    try:
        usuarios = db.query(Usuario).all()
        return usuarios
    except Exception as e:
        print(f"❌ ERROR en get_usuarios: {e}")
        raise HTTPException(status_code=500, detail="Error en la base de datos")

"App para crear un nuevo usuario"

@app.post("/usuarios/")
def create_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    try:
        nuevo_usuario = Usuario(**usuario.dict())
        db.add(nuevo_usuario)
        db.commit()
        db.refresh(nuevo_usuario)
        return nuevo_usuario
    except Exception as e:
        print(f"❌ ERROR en create_usuario: {e}")  # Esto te mostrará la causa real
        raise HTTPException(status_code=500, detail="Error en la base de datos")

"App para consultar a un usuario por el id"

@app.get("/usuarios/{usuario_id}")
def get_usuario(usuario_id: int, db: Session = Depends(get_db)):
    try:
        usuario = db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()
        if not usuario:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        return usuario
    except Exception as e:
        print(f"❌ ERROR en get_usuario: {e}")
        raise HTTPException(status_code=500, detail="Error en la base de datos")

"App para eliminar un usuario por el id"

@app.delete("/usuarios/{usuario_id}")
def delete_usuario(usuario_id: int, db: Session = Depends(get_db)):
    try:
        usuario = db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()
        if not usuario:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        db.delete(usuario)
        db.commit()
        return {"detail": "Usuario eliminado"}
    except Exception as e:
        print(f"❌ ERROR en delete_usuario: {e}")
        raise HTTPException(status_code=500, detail="Error en la base de datos")