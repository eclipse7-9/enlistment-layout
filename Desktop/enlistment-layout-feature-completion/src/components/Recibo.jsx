import React from "react";

export default function Recibo({ recibo }) {
  if (!recibo) return <p>Cargando recibo...</p>;

  return (
    <div className="recibo-container">
      <h2>Recibo de Pago</h2>

      <div className="recibo-info">
        <p><strong>ID Recibo:</strong> {recibo.id_recibo}</p>
        <p><strong>Monto Pagado:</strong> ${Number(recibo.monto_pagado).toFixed(2)}</p>
        <p><strong>Estado:</strong> {recibo.estado_recibo}</p>
        <p><strong>Pedido Asociado:</strong> {recibo.id_pedido}</p>
        <p><strong>Fecha:</strong> {new Date(recibo.fecha_creacion).toLocaleString()}</p>
      </div>

      <div className="recibo-footer">
        <p>Gracias por su compra en PET HEALTH-SERVICE'S 🐾</p>
      </div>
    </div>
  );
}
