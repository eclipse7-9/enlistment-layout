from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Pedido, DetallePedido, Recibo, MetodoPago, Usuario
from auth import get_current_user
from pydantic import BaseModel
from typing import List
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

        # 1) Crear pedido con estado 'pagado'
        pedido = Pedido(
            total=Decimal(payload.total),
            id_metodo_pago=payload.id_metodo_pago,
            estado_pedido="pagado",
            id_usuario=current_user.id_usuario  # Añadimos el id_usuario
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
