from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Pedido, DetallePedido, Recibo, MetodoPago, Usuario, Domicilio
from schemas import DomicilioCreate
from auth import get_current_user
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from decimal import Decimal
from sqlalchemy.exc import SQLAlchemyError
import traceback
import logging

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


class CheckoutDomicilio(BaseModel):
    id_domicilio: Optional[int] = None
    direccion_completa: Optional[str] = None
    codigo_postal: Optional[str] = None
    id_region: Optional[int] = None
    id_ciudad: Optional[int] = None


class CheckoutCreate(BaseModel):
    id_metodo_pago: int
    total: Decimal
    items: List[CheckoutItem]
    # opcional: datos para crear un domicilio asociado al pedido
    domicilio: Optional[CheckoutDomicilio] = None


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

        # Basic payload validation to avoid server 500s
        if not payload.items or len(payload.items) == 0:
            raise HTTPException(status_code=400, detail="El pedido debe contener al menos un item")

        # Validate domicilio data when provided and not referencing existing domicilio
        if payload.domicilio:
            dom_data = payload.domicilio
            # If creating a new domicilio (no id_domicilio), require direccion, region and ciudad
            if not getattr(dom_data, "id_domicilio", None):
                if not getattr(dom_data, "direccion_completa", None):
                    raise HTTPException(status_code=400, detail="Direccion completa requerida para crear un domicilio")
                if not getattr(dom_data, "id_region", None) or not getattr(dom_data, "id_ciudad", None):
                    raise HTTPException(status_code=400, detail="Region y ciudad son requeridas para crear un domicilio")

        # Si se enviaron datos de domicilio:
        # - si contienen 'id_domicilio' reutilizar domicilio existente (y opcionalmente actualizar campos)
        # - si no, crear un nuevo domicilio con la estructura esperada
        id_domicilio = None
        if payload.domicilio:
            dom_data = payload.domicilio
            # caso: referencia a domicilio existente
            if getattr(dom_data, "id_domicilio", None):
                existing_id = int(dom_data.id_domicilio)
                existing = db.query(Domicilio).filter(
                    Domicilio.id_domicilio == existing_id,
                    Domicilio.id_usuario == current_user.id_usuario,
                ).first()
                if not existing:
                    raise HTTPException(status_code=400, detail="Domicilio no válido o no pertenece al usuario")
                # actualizar SOLO direccion_completa y codigo_postal si vienen en el payload
                if getattr(dom_data, "direccion_completa", None):
                    existing.direccion_completa = dom_data.direccion_completa
                if getattr(dom_data, "codigo_postal", None):
                    existing.codigo_postal = dom_data.codigo_postal
                db.add(existing)
                db.commit()
                db.refresh(existing)
                id_domicilio = existing.id_domicilio
            else:
                # crear nuevo domicilio siguiendo el esquema CheckoutDomicilio (debe incluir region/ciudad)
                nuevo_dom = Domicilio(
                    direccion_completa=dom_data.direccion_completa,
                    codigo_postal=dom_data.codigo_postal,
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
        tb = traceback.format_exc()
        logging.error(tb)
        # Return SQLAlchemy error plus stack for local debugging
        raise HTTPException(status_code=500, detail=str(e) + "\n" + tb)
    except Exception as e:
        db.rollback()
        tb = traceback.format_exc()
        logging.error(tb)
        # Return generic exception plus stack for local debugging
        raise HTTPException(status_code=500, detail=str(e) + "\n" + tb)
