from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, Boolean, DECIMAL, Enum, TIMESTAMP, Date, Time
from sqlalchemy.orm import relationship
from database import Base
import enum

class RolUsuario(Base):
    __tablename__ = "rol_usuarios"
    id_rol = Column(Integer, primary_key=True, index=True)
    nombre_rol = Column(String(50), unique=True, nullable=False)
    descripcion_rol = Column(String(150))

    usuarios = relationship("Usuario", back_populates="rol")  
    
    
class Usuario(Base): 
    __tablename__ = "usuarios"
    id_usuario = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre_usuario = Column(String(50), nullable=False)
    apellido_usuario = Column(String(50), nullable=False)
    correo_usuario = Column(String(50), nullable=False, unique=True)
    telefono_usuario = Column(String(20), nullable=False)   
    password_usuario = Column(String(255), nullable=False)
    # direccion and codigo_postal moved to Domicilio table in the DB schema
    # (no longer stored directly on Usuario)
    # Guardamos la imagen como data URL (base64). Usar Text para evitar truncamientos por longitud.
    imagen_usuario = Column(Text)
    id_rol = Column(Integer, ForeignKey("rol_usuarios.id_rol"), nullable=False)
    # now include region and city as FKs
    id_region = Column(Integer, ForeignKey("regiones.id_region"), nullable=False)
    id_ciudad = Column(Integer, ForeignKey("ciudades.id_ciudad"), nullable=False)
    estado_usuario = Column(String(25), nullable=False)

    rol = relationship("RolUsuario", back_populates="usuarios")
    mascotas = relationship("Mascota", back_populates="usuario")
    servicios = relationship("Servicio", back_populates="usuario")
    domicilios = relationship("Domicilio", back_populates="usuario")
    metodos_pago = relationship("MetodoPago", back_populates="usuario")
    pedidos = relationship("Pedido", back_populates="usuario")
    region = relationship("Region")
    ciudad = relationship("Ciudad")
    notificaciones = relationship("Notificacion", back_populates="usuario_destino")


RolUsuario.usuarios = relationship("Usuario", back_populates="rol")

class Mascota(Base):
    __tablename__ = "mascotas"

    id_mascota = Column(Integer, primary_key=True, autoincrement=True)
    nombre_mascota = Column(String(25), nullable=False)
    peso_mascota = Column(Integer, nullable=False)
    especie_mascota = Column(Enum('Canino','Bovino','Porcino','Felino','Oviparo','Equidos'), nullable=False)
    raza_mascota = Column(String(70), nullable=False)
    edad_mascota = Column(Integer, nullable=False)
    altura_mascota = Column(Integer, nullable=False)

    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)

    usuario = relationship("Usuario", back_populates="mascotas")
    citas = relationship("Cita", back_populates="mascota")


class Domicilio(Base):
    __tablename__ = "domicilios"
    id_domicilio = Column(Integer, primary_key=True, autoincrement=True)
    alias_domicilio = Column(String(100), default='Principal')
    direccion_completa = Column(String(250), nullable=False)
    codigo_postal = Column(String(20))
    es_principal = Column(Boolean, default=False)
    # estado del domicilio: pendiente, en entrega, entregado, cancelado
    estado_domicilio = Column(Enum('Pendiente', 'En-entrega', 'Entregado', 'Cancelado'), default='Pendiente')

    id_region = Column(Integer, ForeignKey("regiones.id_region"), nullable=False)
    id_ciudad = Column(Integer, ForeignKey("ciudades.id_ciudad"), nullable=False)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)

    usuario = relationship("Usuario", back_populates="domicilios")
    region = relationship("Region")
    ciudad = relationship("Ciudad")


class Servicio(Base):
    __tablename__ = "servicios"

    id_servicio = Column(Integer, primary_key=True, autoincrement=True)
    tipo_servicio = Column(String(75), nullable=False)
    estado_servicio = Column(String(25), nullable=False)
    descripcion_servicio = Column(String(255), nullable=False)
    imagen_servicio = Column(String(300))
    precio_servicio = Column(DECIMAL(10, 2), nullable=False)
    fecha_creacion = Column(TIMESTAMP)
    fecha_actualizacion = Column(TIMESTAMP)

    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)

    usuario = relationship("Usuario", back_populates="servicios")
    citas = relationship("Cita", back_populates="servicio")


class Notificacion(Base):
    __tablename__ = "notificaciones"

    id_notificacion = Column(Integer, primary_key=True, autoincrement=True)
    id_usuario_destino = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)
    titulo = Column(String(150), nullable=False)
    mensaje = Column(String(500), nullable=False)
    url = Column(String(300))
    leida = Column(Boolean, default=False)
    fecha_creacion = Column(TIMESTAMP)
    id_cita = Column(Integer, ForeignKey("citas.id_cita"), nullable=True)

    usuario_destino = relationship("Usuario", back_populates="notificaciones")


class Region(Base):
    __tablename__ = "regiones"

    id_region = Column(Integer, primary_key=True, autoincrement=True)
    nombre_region = Column(String(100), nullable=False, unique=True)


class Ciudad(Base):
    __tablename__ = "ciudades"

    id_ciudad = Column(Integer, primary_key=True, autoincrement=True)
    nombre_ciudad = Column(String(100), nullable=False)
    id_region = Column(Integer, ForeignKey("regiones.id_region"), nullable=False)

    region = relationship("Region")


class Cita(Base):
    __tablename__ = "citas"

    id_cita = Column(Integer, primary_key=True, autoincrement=True)
    fecha_cita = Column(Date, nullable=False)
    hora_cita = Column(Time, nullable=False)
    metodo_pago = Column(Enum("Tarjeta Crédito", "Tarjeta Débito", "Efectivo", "Transferencia", "Nequi", "Daviplata", "PSE"), nullable=False)
    # Match the actual DB enum values: no 'pagado' value in the MySQL table
    estado_cita = Column(Enum("pendiente", "confirmada", "cancelada", "finalizada"), default="pendiente")

    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)
    id_mascota = Column(Integer, ForeignKey("mascotas.id_mascota"), nullable=False)
    id_servicio = Column(Integer, ForeignKey("servicios.id_servicio"), nullable=False)

    usuario = relationship("Usuario")
    mascota = relationship("Mascota", back_populates="citas")
    servicio = relationship("Servicio", back_populates="citas")
    resultados = relationship("Resultado", back_populates="cita")


class Resultado(Base):
    __tablename__ = "resultados"

    id_resultado = Column(Integer, primary_key=True, autoincrement=True)
    diagnostico = Column(String(255), nullable=False)
    observaciones = Column(Text)
    fecha_resultado = Column(TIMESTAMP)
    requiere_tratamiento = Column(Boolean, default=False, nullable=False)

    id_cita = Column(Integer, ForeignKey("citas.id_cita"), nullable=False)

    cita = relationship("Cita", back_populates="resultados")
    tratamientos = relationship("Tratamiento", back_populates="resultado")


class Tratamiento(Base):
    __tablename__ = "tratamientos"

    id_tratamiento = Column(Integer, primary_key=True, autoincrement=True)
    tipo_tratamiento = Column(String(150), nullable=False)
    descripcion_tratamiento = Column(Text)
    fecha_inicio = Column(String(100), nullable=False)
    fecha_fin = Column(String(100), nullable=False)
    estado_tratamiento = Column(String(50), nullable=False)

    id_resultado = Column(Integer, ForeignKey("resultados.id_resultado"), nullable=False)

    resultado = relationship("Resultado", back_populates="tratamientos")


class Proveedor(Base):
    __tablename__ = "proveedores"

    id_proveedor = Column(Integer, primary_key=True, autoincrement=True)
    nombre_compania = Column(String(150), nullable=False)
    telefono_proveedor = Column(String(20), nullable=False)
    correo_proveedor = Column(String(100), nullable=False)
    direccion_contacto = Column(String(150), nullable=False)
    password_proveedor = Column(String(255), nullable=True)
    estado_proveedor = Column(Enum("Activo", "Inactivo", "Finalizado"), default="Activo")

    productos = relationship("Producto", back_populates="proveedor")


class Producto(Base):
    __tablename__ = "productos"

    id_producto = Column(Integer, primary_key=True, autoincrement=True)
    nombre_producto = Column(String(100), nullable=False)
    imagen_producto = Column(String(300))
    categoria_producto = Column(String(100), nullable=False)
    descripcion_producto = Column(Text, nullable=False)
    estado_producto = Column(Enum("en-stock", "agotado", "retirado"), default="en-stock")
    precio_producto = Column(DECIMAL(10, 2), nullable=False)

    id_proveedor = Column(Integer, ForeignKey("proveedores.id_proveedor"), nullable=False)

    proveedor = relationship("Proveedor", back_populates="productos")
    detalle_pedidos = relationship("DetallePedido", back_populates="producto")


class MetodoPago(Base):
    __tablename__ = "metodo_pago"

    id_metodo_pago = Column(Integer, primary_key=True, autoincrement=True)
    tipo_metodo = Column(Enum("Tarjeta Crédito", "Tarjeta Débito", "Efectivo", "Transferencia", "Nequi", "Daviplata", "PSE"), nullable=False)
    numero_cuenta = Column(String(50))
    titular = Column(String(100))
    fecha_registro = Column(TIMESTAMP)

    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)

    usuario = relationship("Usuario", back_populates="metodos_pago")  
    pedidos = relationship("Pedido", back_populates="metodo_pago")


class Pedido(Base):
    __tablename__ = "pedidos"

    id_pedido = Column(Integer, primary_key=True, autoincrement=True)
    fecha_pedido = Column(TIMESTAMP)
    estado_pedido = Column(Enum("pendiente", "en-proceso", "cancelado", "pagado"), default="pendiente", nullable=False)
    total = Column(DECIMAL(10, 2), nullable=False)

    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)
    id_metodo_pago = Column(Integer, ForeignKey("metodo_pago.id_metodo_pago"), nullable=False)
    id_domicilio = Column(Integer, ForeignKey("domicilios.id_domicilio"), nullable=True)

    metodo_pago = relationship("MetodoPago", back_populates="pedidos")
    usuario = relationship("Usuario", back_populates="pedidos")
    domicilio = relationship("Domicilio")
    detalle_pedidos = relationship("DetallePedido", back_populates="pedido")
    recibos = relationship("Recibo", back_populates="pedido")


class DetallePedido(Base):
    __tablename__ = "detalle_pedido"

    id_detalle_pedido = Column(Integer, primary_key=True, autoincrement=True)
    cantidad = Column(Integer, nullable=False)
    subtotal = Column(DECIMAL(10, 2), nullable=False)

    id_pedido = Column(Integer, ForeignKey("pedidos.id_pedido"), nullable=False)
    id_producto = Column(Integer, ForeignKey("productos.id_producto"), nullable=False)

    pedido = relationship("Pedido", back_populates="detalle_pedidos")
    producto = relationship("Producto", back_populates="detalle_pedidos")


class Recibo(Base):
    __tablename__ = "recibos"

    id_recibo = Column(Integer, primary_key=True, autoincrement=True)
    fecha_recibo = Column(TIMESTAMP)
    monto_pagado = Column(DECIMAL(10, 2), nullable=False)
    # Agregar estado 'pagado' para los recibos que fueron pagados
    estado_recibo = Column(Enum("emitido", "anulado", "pagado"), default="emitido")

    id_pedido = Column(Integer, ForeignKey("pedidos.id_pedido"), nullable=False)

    pedido = relationship("Pedido", back_populates="recibos")












   



