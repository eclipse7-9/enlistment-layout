from pydantic import BaseModel, EmailStr
from typing import Annotated, Optional
from decimal import Decimal


#register
class RegisterRequest(BaseModel):
    nombre_usuario: str
    apellido_usuario: str
    correo_usuario: EmailStr
    telefono_usuario: str
    password_usuario: str
    # now store region and city instead of free-text address
    id_region: int
    id_ciudad: int
    imagen_usuario: str | None = None
    id_rol: int = 4  # por defecto cliente
    estado_usuario: str = "activo"

#login
class LoginRequest(BaseModel):
    correo_usuario: EmailStr
    password_usuario: str
    

#mascota
class MascotaCreate(BaseModel):
    nombre_mascota: str
    peso_mascota: float
    especie_mascota: str
    raza_mascota: str
    edad_mascota: int
    altura_mascota: float | None = None

    class Config:
        orm_mode = True

# domicilios (nueva estructura con regiones/ciudades)
class DomicilioCreate(BaseModel):
    alias_domicilio: Optional[str] = "Principal"
    direccion_completa: str
    codigo_postal: Optional[str] = None
    es_principal: Optional[bool] = False
    id_region: int
    id_ciudad: int
    id_usuario: int | None = None
    estado_domicilio: Optional[str] = "Pendiente"

    class Config:
        orm_mode = True


# esquema para actualizar domicilio (parcial)
class DomicilioUpdate(BaseModel):
    alias_domicilio: Optional[str] = None
    direccion_completa: Optional[str] = None
    codigo_postal: Optional[str] = None
    es_principal: Optional[bool] = None
    id_region: Optional[int] = None
    id_ciudad: Optional[int] = None
    id_usuario: Optional[int] = None
    estado_domicilio: Optional[str] = None

    class Config:
        orm_mode = True


# regiones y ciudades
class RegionSchema(BaseModel):
    id_region: int
    nombre_region: str

    class Config:
        orm_mode = True


class CiudadSchema(BaseModel):
    id_ciudad: int
    nombre_ciudad: str
    id_region: int

    class Config:
        orm_mode = True
   
#servicio     
class ServicioCreate(BaseModel):
    tipo_servicio: str
    estado_servicio: str
    descripcion_servicio: str
    precio_servicio: Decimal
    imagen_servicio: str | None = None
    id_usuario: int

    class Config:
        orm_mode = True

#cita
class CitaCreate(BaseModel):
    fecha_cita: str  # YYYY-MM-DD
    hora_cita: str   # HH:MM:SS or HH:MM
    id_metodo_pago: int
    id_mascota: int
    id_servicio: int

    class Config:
        orm_mode = True

class CitaUpdateEstado(BaseModel):
    estado_cita: str

#resultado
class ResultadoCreate(BaseModel):
    diagnostico: str
    observaciones: str | None = None
    requiere_tratamiento: bool = False
    id_cita: int

    class Config:
        orm_mode = True

class ResultadoUpdate(BaseModel):
    diagnostico: str | None = None
    observaciones: str | None = None
    requiere_tratamiento: bool | None = None

#tratamiento
class TratamientoCreate(BaseModel):
    tipo_tratamiento: str
    descripcion_tratamiento: str | None = None
    fecha_inicio: str
    fecha_fin: str
    estado_tratamiento: str
    id_resultado: int

    class Config:
        orm_mode = True

class TratamientoUpdate(BaseModel):
    tipo_tratamiento: str | None = None
    descripcion_tratamiento: str | None = None
    fecha_inicio: str | None = None
    fecha_fin: str | None = None
    estado_tratamiento: str | None = None

#proveedor
class ProveedorCreate(BaseModel):
    nombre_compania: str
    telefono_proveedor: str
    correo_proveedor: EmailStr
    direccion_contacto: str
    estado_proveedor: str = "Activo"  # por defecto
    password_proveedor: str | None = None

    class Config:
        orm_mode = True
        
class ProveedorUpdate(BaseModel):
    nombre_compania: Optional[str] = None
    telefono_proveedor: Optional[str] = None
    correo_proveedor: Optional[EmailStr] = None
    direccion_contacto: Optional[str] = None
    estado_proveedor: Optional[str] = None
    password_proveedor: Optional[str] = None

#producto
class ProductoCreate(BaseModel):
    nombre_producto: str
    imagen_producto: Optional[str] = None
    categoria_producto: str
    descripcion_producto: str
    estado_producto: str = "en-stock"
    precio_producto: Decimal
    id_proveedor: int

    class Config:
        orm_mode = True

class ProductoUpdate(BaseModel):
    nombre_producto: Optional[str] = None
    imagen_producto: Optional[str] = None
    categoria_producto: Optional[str] = None
    descripcion_producto: Optional[str] = None
    estado_producto: Optional[str] = None
    precio_producto: Decimal
    id_proveedor: Optional[int] = None

#metodo_pago
class MetodoPagoCreate(BaseModel):
    tipo_metodo: str
    numero_cuenta: str
    titular: str
    
class MetodoPagoUpdate(BaseModel):
    tipo_metodo: Optional[str] = None
    numero_cuenta: Optional[str] = None
    titular: Optional[str] = None

#pedido
class PedidoCreate(BaseModel):
    total: Decimal
    id_metodo_pago: int
    estado_pedido: Optional[str] = "pendiente"

    class Config:
        orm_mode = True

class PedidoUpdate(BaseModel):
    total: Optional[Decimal] = None
    id_metodo_pago: Optional[int] = None
    estado_pedido: Optional[str] = None


#detalle_pedido
class DetallePedidoCreate(BaseModel):
    id_pedido: int
    id_producto: int
    cantidad: int
    subtotal: Decimal

    class Config:
        orm_mode = True

class DetallePedidoUpdate(BaseModel):
    id_pedido: Optional[int] = None
    id_producto: Optional[int] = None
    cantidad: Optional[int] = None
    subtotal: Optional[Decimal] = None
    
# recibo
class ReciboCreate(BaseModel):
    monto_pagado: Decimal
    estado_recibo: Optional[str] = "emitido"
    id_pedido: int

    class Config:
        orm_mode = True

class ReciboUpdate(BaseModel):
    monto_pagado: Optional[Decimal] = None
    estado_recibo: Optional[str] = None
    id_pedido: Optional[int] = None

