from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import mysql.connector

app = FastAPI()

# Conexión a la base de datos
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="phs_db"
)

""" Conexión exitosa a la base de datos """
@app.get("/")
def read_root():
    return {"hol": "wol"}

""" Clase usuario """
class Usuario(BaseModel):
    nombre_usu: str
    apellido_usu: str
    correo_usu: str
    telefono_usu: str
    password_usu: str
    direccion_usu: str
    codigoPostal_usu: str
    imagen_usu: str
    id_rol: int
    estado_usu: str

""" App para consultar los usuarios """
@app.get("/usuarios")
def get_usuarios():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuarios")
    result = cursor.fetchall()
    cursor.close()
    return result

"""App para consultar usuario por id """

@app.get("/usuarios")
def get_usuario(id_usu: int):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuarios WHERE id_usu = %s", (id_usu,))
    result = cursor.fetchone()
    cursor.close()
    if not result:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return result

""" App para crear usuarios """
@app.post("/usuarios")
def create_usuarios(usuario: Usuario):
    try:
        cursor = db.cursor()
        sql = """
        INSERT INTO usuarios 
        (nombre_usu, apellido_usu, correo_usu, telefono_usu, password_usu, 
         direccion_usu, codigoPostal_usu, imagen_usu, id_rol, estado_usu)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        values = (
            usuario.nombre_usu, usuario.apellido_usu, usuario.correo_usu,
            usuario.telefono_usu, usuario.password_usu, usuario.direccion_usu,
            usuario.codigoPostal_usu, usuario.imagen_usu, usuario.id_rol,
            usuario.estado_usu
        )

        cursor.execute(sql, values)
        db.commit()

        return {"message": "Usuario creado exitosamente"}

    except mysql.connector.IntegrityError as err:
        db.rollback()
        if "Duplicate entry" in str(err):
            raise HTTPException(
                status_code=400, 
                detail="El correo ya está registrado"
            )
        else:
            raise HTTPException(status_code=400, detail=f"Error: {err}")

    except mysql.connector.Error as err:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error: {err}")

""" PUT - Editar usuario por id """
@app.put("/usuarios/{id_usu}")
def update_usuario(id_usu: int, usuario: Usuario):
    try:
        cursor = db.cursor()
        sql = """
        UPDATE usuarios
        SET nombre_usu = %s,
            apellido_usu = %s,
            correo_usu = %s,
            telefono_usu = %s,
            password_usu = %s,
            direccion_usu = %s,
            codigoPostal_usu = %s,
            imagen_usu = %s,
            id_rol = %s,
            estado_usu = %s
        WHERE id_usu = %s
        """
        values = (
            usuario.nombre_usu,
            usuario.apellido_usu,
            usuario.correo_usu,
            usuario.telefono_usu,
            usuario.password_usu,
            usuario.direccion_usu,
            usuario.codigoPostal_usu,
            usuario.imagen_usu,
            usuario.id_rol,
            usuario.estado_usu,
            id_usu
        )

        cursor.execute(sql, values)
        db.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        return {"message": "Usuario actualizado exitosamente"}
    except mysql.connector.Error as err:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error: {err}")
    finally:
        cursor.close()
        
""" DELETE - Eliminar usuario por id """
@app.delete("/usuarios/{id_usu}")
def delete_usuario(id_usu: int):
    try:
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM usuarios WHERE id_usu = %s", (id_usu,))
        usuario = cursor.fetchone()

        if not usuario:
            cursor.close()
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        cursor.execute("DELETE FROM usuarios WHERE id_usu = %s", (id_usu,))
        db.commit()
        cursor.close()

        return {"message": "Usuario eliminado exitosamente", "usuario": usuario}

    except mysql.connector.Error as err:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error: {err}")
    
