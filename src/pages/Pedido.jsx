import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import PaymentModal from "./PaymentModal"; // Importamos el modal de pago

export default function OrderModal({ onClose, carrito }) {
  const { user } = useAuth();
  const [metodosPago, setMetodosPago] = useState([]);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Traer métodos de pago del usuario
  const fetchMetodosPago = async () => {
    try {
      const res = await axios.get("http://localhost:8000/metodo_pago/", {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMetodosPago(res.data);
      if (res.data.length) setMetodoSeleccionado(res.data[0].id_metodo_pago);
    } catch (err) {
      console.error("Error al traer métodos de pago:", err);
      alert("No se pudieron cargar los métodos de pago");
    }
  };

  useEffect(() => {
    fetchMetodosPago();
  }, []);

  const handleCrearPedido = async () => {
    if (!metodoSeleccionado) {
      alert("Selecciona un método de pago");
      return;
    }
    try {
      await axios.post(
        "http://localhost:8000/pedidos/",
        {
          id_metodo_pago: metodoSeleccionado,
          productos: carrito, // Ajusta según tu backend
        },
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );
      alert("✅ Pedido creado correctamente");
      onClose();
    } catch (err) {
      console.error("Error al crear pedido:", err);
      alert("No se pudo crear el pedido");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Selecciona un método de pago</h3>

        {metodosPago.length > 0 ? (
          metodosPago.map((m) => (
            <label key={m.id_metodo_pago}>
              <input
                type="radio"
                name="metodo"
                value={m.id_metodo_pago}
                checked={metodoSeleccionado === m.id_metodo_pago}
                onChange={() => setMetodoSeleccionado(m.id_metodo_pago)}
              />
              {m.tipo_metodo} - {m.numero_cuenta}
            </label>
          ))
        ) : (
          <p>No tienes métodos de pago. Agrega uno para continuar.</p>
        )}

        <div className="buttons">
          <button onClick={handleCrearPedido} disabled={!metodosPago.length}>
            💳 Pagar
          </button>
          <button
            onClick={() => setShowPaymentModal(true)}
          >
            ➕ Agregar método de pago
          </button>
          <button onClick={onClose}>❌ Cancelar</button>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          onClose={() => {
            setShowPaymentModal(false);
            fetchMetodosPago(); // Refresca la lista de métodos
          }}
        />
      )}
    </div>
  );
}
