import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Payment.css";
import { useAuth } from "../context/AuthContext";

export default function PaymentModal({ onClose, producto, onPedidoCreado }) {
  const { user } = useAuth();

  const [cantidad, setCantidad] = useState(1);

  const [metodosExistentes, setMetodosExistentes] = useState([]);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState("");
  const [showCrearNuevo, setShowCrearNuevo] = useState(false);

  const [tipo, setTipo] = useState("Tarjeta Crédito");
  const [numero, setNumero] = useState("");
  const [titular, setTitular] = useState("");

  const [recibo, setRecibo] = useState(null); // Nuevo estado para el recibo

  // Traer métodos de pago existentes
  const fetchMetodos = async () => {
    if (!user) return;
    try {
      const res = await axios.get("http://localhost:8000/metodo_pago/", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMetodosExistentes(res.data);
      if (res.data.length) setMetodoSeleccionado(res.data[0].id_metodo_pago);
    } catch (err) {
      console.error("Error al obtener métodos de pago:", err);
    }
  };

  useEffect(() => {
    fetchMetodos();
  }, [user]);

  // Crear pedido + recibo
  const handleCrearPedido = async () => {
    if (!metodoSeleccionado) {
      alert("Selecciona un método de pago");
      return;
    }

    try {
      const total = cantidad * producto.precio_producto;

      // Crear pedido
      const resPedido = await axios.post(
        "http://localhost:8000/pedidos/",
        {
          total,
          id_metodo_pago: metodoSeleccionado,
          estado_pedido: "pendiente",
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      if (onPedidoCreado) onPedidoCreado(resPedido.data);

      // Crear recibo automáticamente
      const resRecibo = await axios.post(
        "http://localhost:8000/recibos/",
        {
          monto_pagado: total,
          estado_recibo: "pagado",
          id_pedido: resPedido.data.id_pedido,
        }
      );

      setRecibo(resRecibo.data); // Guardamos el recibo en estado

    } catch (err) {
      console.error("Error al crear pedido o recibo:", err);
      alert("❌ No se pudo crear el pedido o recibo");
    }
  };

  if (!producto) return <p>Cargando producto...</p>;

  return (
    <div className="modal-overlay">
      <div className="modal">
        {!recibo ? (
          <>
            <h3>Producto: {producto.nombre_producto}</h3>
            <p>Precio unitario: ${producto.precio_producto.toFixed(2)}</p>

            <label>
              Cantidad:
              <input
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
              />
            </label>

            <p>Total: ${(producto.precio_producto * cantidad).toFixed(2)}</p>

            <h3>Métodos de pago</h3>
            {metodosExistentes.length > 0 && (
              <select
                value={metodoSeleccionado}
                onChange={(e) => setMetodoSeleccionado(Number(e.target.value))}
              >
                {metodosExistentes.map((m) => (
                  <option key={m.id_metodo_pago} value={m.id_metodo_pago}>
                    {m.tipo_metodo} - {m.numero_cuenta}
                  </option>
                ))}
              </select>
            )}

            {!showCrearNuevo && (
              <button onClick={() => setShowCrearNuevo(true)}>➕ Crear nuevo método</button>
            )}

            {showCrearNuevo && (
              <div>
                <label>
                  Tipo:
                  <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                    <option>Tarjeta Crédito</option>
                    <option>Tarjeta Débito</option>
                    <option>Efectivo</option>
                    <option>Transferencia</option>
                    <option>Nequi</option>
                    <option>Daviplata</option>
                    <option>PSE</option>
                  </select>
                </label>
                <label>
                  Número de cuenta:
                  <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} />
                </label>
                <label>
                  Titular:
                  <input type="text" value={titular} onChange={(e) => setTitular(e.target.value)} />
                </label>
                <button
                  onClick={async () => {
                    try {
                      const res = await axios.post(
                        "http://localhost:8000/metodo_pago/",
                        { tipo_metodo: tipo, numero_cuenta: numero, titular: titular },
                        { headers: { Authorization: `Bearer ${user.token}` } }
                      );
                      setMetodoSeleccionado(res.data.id_metodo_pago);
                      setShowCrearNuevo(false);
                    } catch (err) {
                      console.error(err);
                      alert("Error al crear método");
                    }
                  }}
                >
                  Guardar método
                </button>
              </div>
            )}

            <button onClick={handleCrearPedido}>💳 Pagar</button>
            <button onClick={onClose}>❌ Cancelar</button>
          </>
        ) : (
          // Mostrar recibo
          <div className="recibo-container">
            <h2>Recibo de Pago</h2>
            <p><strong>ID Recibo:</strong> {recibo.id_recibo}</p>
            <p><strong>Monto Pagado:</strong> ${Number(recibo.monto_pagado).toFixed(2)}</p>
            <p><strong>Estado:</strong> {recibo.estado_recibo}</p>
            <p><strong>Pedido Asociado:</strong> {recibo.id_pedido}</p>
            <p><strong>Fecha:</strong> {new Date(recibo.fecha_creacion).toLocaleString()}</p>
            <div className="recibo-footer">
              <p>Gracias por su compra en PET HEALTH-SERVICE'S 🐾</p>
              <button onClick={onClose}>Cerrar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
