from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Pedido, DetallePedido, Recibo, MetodoPago, Usuario, Domicilio
from schemas import DomicilioCreate
from auth import get_current_user
from pydantic import BaseModel
from typing import List, Optional
from decimal import Decimal
from sqlalchemy.exc import SQLAlchemyError

router = APIRouter(prefix="/checkout", tags=["Checkout"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class CheckoutItem(BaseModel):
    id_producto: int
    cantidad: int
    subtotal: Decimal


class CheckoutCreate(BaseModel):
    id_metodo_pago: int
    total: Decimal
    items: List[CheckoutItem]
    # opcional: datos para crear un domicilio asociado al pedido
    domicilio: Optional[DomicilioCreate] = None


@router.post("/")
def process_checkout(
    payload: CheckoutCreate, 
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    try:
        print(f"Procesando checkout para usuario {current_user.id_usuario}")
        print(f"Método de pago seleccionado: {payload.id_metodo_pago}")
        
        # Validar que el método de pago pertenece al usuario
        metodo_pago = db.query(MetodoPago).filter(
            MetodoPago.id_metodo_pago == payload.id_metodo_pago,
            MetodoPago.id_usuario == current_user.id_usuario
        ).first()
        
        print(f"Método de pago encontrado: {metodo_pago}")
        
        if not metodo_pago:
            raise HTTPException(
                status_code=400,
                detail="Método de pago no válido o no pertenece al usuario"
            )

        # Si se enviaron datos de domicilio, crear el domicilio y obtener su id
        id_domicilio = None
        if payload.domicilio:
            dom_data = payload.domicilio
            nuevo_dom = Domicilio(
                alias_domicilio=dom_data.alias_domicilio or "Principal",
                direccion_completa=dom_data.direccion_completa,
                codigo_postal=dom_data.codigo_postal,
                es_principal=dom_data.es_principal or False,
                id_region=dom_data.id_region,
                id_ciudad=dom_data.id_ciudad,
                id_usuario=current_user.id_usuario,
            )
            db.add(nuevo_dom)
            db.commit()
            db.refresh(nuevo_dom)
            id_domicilio = nuevo_dom.id_domicilio

        # 1) Crear pedido con estado 'pagado'
        pedido = Pedido(
            total=Decimal(payload.total),
            id_metodo_pago=payload.id_metodo_pago,
            estado_pedido="pagado",
            id_usuario=current_user.id_usuario,  # Añadimos el id_usuario
            id_domicilio=id_domicilio,
        )
        db.add(pedido)
        db.commit()
        db.refresh(pedido)

        # 2) Crear detalle_pedido para cada item
        for it in payload.items:
            detalle = DetallePedido(
                id_pedido=pedido.id_pedido,
                id_producto=it.id_producto,
                cantidad=it.cantidad,
                subtotal=Decimal(it.subtotal),
            )
            db.add(detalle)

        db.commit()

        # 3) Crear recibo con estado 'pagado'
        nuevo_recibo = Recibo(
            monto_pagado=Decimal(payload.total),
            estado_recibo="pagado",
            id_pedido=pedido.id_pedido,
        )
        db.add(nuevo_recibo)
        db.commit()
        db.refresh(nuevo_recibo)

        return {"pedido": pedido, "recibo": nuevo_recibo}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
