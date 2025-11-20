import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import Swal from "sweetalert2";
import { useCart } from "../context/CartContext";

export default function PaymentModal({ onClose, cart = [], onPaymentSuccess }) {
  const { user } = useAuth();
  const { clearCart } = useCart();
  const { showAlert } = useAlert();

  const [metodosExistentes, setMetodosExistentes] = useState([]);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);
  const [showCrearNuevo, setShowCrearNuevo] = useState(false);

  const [tipo, setTipo] = useState("Tarjeta Crédito");
  const [numero, setNumero] = useState("");
  const [titular, setTitular] = useState("");

  // domicilio fields (opcional)
  const [codigoPostal, setCodigoPostal] = useState("");
  const [direccionCompleta, setDireccionCompleta] = useState("");
  const [regiones, setRegiones] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedCiudad, setSelectedCiudad] = useState(null);
  const [savedDomicilios, setSavedDomicilios] = useState([]);
  const [selectedSavedDomicilioId, setSelectedSavedDomicilioId] = useState(null);

  const [recibo, setRecibo] = useState(null);
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((s, it) => s + Number(it.precio_producto) * Number(it.cantidad), 0);

  // Traer métodos de pago existentes
  const fetchMetodos = async () => {
    if (!user) return;
    try {
      const res = await axios.get("http://localhost:8000/metodo_pago", {
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

  // fetch regiones
  useEffect(() => {
    const fetchRegiones = async () => {
      try {
        const res = await axios.get("http://localhost:8000/ubicaciones/regiones");
        setRegiones(res.data || []);
      } catch (err) {
        console.error("Error cargando regiones", err);
      }
    };
    fetchRegiones();
  }, []);

  useEffect(() => {
    const fetchCiudades = async () => {
      if (!selectedRegion) return setCiudades([]);
      try {
        const res = await axios.get("http://localhost:8000/ubicaciones/ciudades", { params: { region_id: selectedRegion } });
        setCiudades(res.data || []);
      } catch (err) {
        console.error("Error cargando ciudades", err);
      }
    };
    fetchCiudades();
  }, [selectedRegion]);

  // Fetch user's saved domicilios so they can reuse them in checkout
  useEffect(() => {
    const fetchDomicilios = async () => {
      if (!user) return;
      try {
        const res = await axios.get("http://localhost:8000/domicilios/", { headers: { Authorization: `Bearer ${user.token}` } });
        // Filter to this user's domicilios (backend may return all)
        const mine = (res.data || []).filter(d => d.id_usuario === user.id_usuario || d.id_usuario === user.id || d.id_usuario === user?.id_usuario);
        setSavedDomicilios(mine);
      } catch (err) {
        console.error('Error cargando domicilios:', err);
        setSavedDomicilios([]);
      }
    };
    fetchDomicilios();
  }, [user]);

  if (!cart || cart.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center">
          <h3 className="text-xl font-semibold mb-2">El carrito está vacío</h3>
          <button onClick={onClose} className="px-6 py-2 bg-[#69774A] text-white rounded-xl">Cerrar</button>
        </div>
      </div>
    );
  }

  const handleCrearMetodo = async () => {
    if (!user) { await Swal.fire('Inicia sesión', 'Debes iniciar sesión para agregar un método de pago', 'warning'); return; }
    try {
      const res = await axios.post(
        "http://localhost:8000/metodo_pago/",
        { tipo_metodo: tipo, numero_cuenta: numero, titular },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setMetodoSeleccionado(res.data.id_metodo_pago);
      setShowCrearNuevo(false);
      await fetchMetodos();
    } catch (err) {
      console.error(err);
      showAlert({ type: 'error', message: 'Error al crear método' });
    }
  };

  const handlePagar = async () => {
    if (!metodoSeleccionado) return alert('Selecciona o crea un método de pago');
    setLoading(true);
    try {
      // If user provided any address fields, require both region and ciudad to avoid DB NOT NULL errors
      const anyAddressProvided = direccionCompleta || codigoPostal;
      if (anyAddressProvided && (!selectedRegion || !selectedCiudad)) {
        showAlert({ type: 'error', message: 'Si vas a crear una dirección completa, selecciona región y ciudad.' });
        setLoading(false);
        return;
      }

      // Llamar al endpoint atómico /checkout para crear pedido, detalles y recibo en una única operación
      const payload = {
        id_metodo_pago: metodoSeleccionado,
        total,
        items: cart.map((it) => ({ id_producto: it.id_producto, cantidad: it.cantidad, subtotal: Number(it.precio_producto) * Number(it.cantidad) })),
        // si el usuario seleccionó una dirección guardada, enviar solo el id + campos editables
        domicilio: selectedSavedDomicilioId ? {
          id_domicilio: selectedSavedDomicilioId,
          direccion_completa: direccionCompleta || undefined,
          codigo_postal: codigoPostal || undefined,
        } : ((direccionCompleta || selectedRegion || selectedCiudad) ? {
          direccion_completa: direccionCompleta,
          codigo_postal: codigoPostal,
          id_region: selectedRegion,
          id_ciudad: selectedCiudad,
        } : undefined),
      };

      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
      const res = await axios.post("http://localhost:8000/checkout/", payload, { headers });

      const pedido = res.data.pedido;
      const reciboData = res.data.recibo;
      setRecibo(reciboData);

      // Limpiar carrito y notificar al padre
      clearCart();
      if (onPaymentSuccess) onPaymentSuccess(pedido, reciboData);
    } catch (err) {
      console.error("Error en el flujo de pago:", err);
      showAlert({ type: 'error', message: 'No se pudo procesar el pago. Revisa la consola para más detalles.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6">
        {!recibo ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Proceder al pago</h2>
              <button onClick={onClose} className="text-gray-500">✕</button>
            </div>

            <div className="mb-4">
              <p className="text-gray-700">Total a pagar:</p>
              <p className="text-3xl font-bold text-[#7A8358]">${total.toFixed(2)} COP</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Métodos de pago<span className="text-red-500"> *</span></h3>
              {metodosExistentes.length > 0 ? (
                <select
                  value={metodoSeleccionado || ""}
                  onChange={(e) => setMetodoSeleccionado(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                >
                  <option value="">-- Selecciona --</option>
                  {metodosExistentes.map((m) => (
                    <option key={m.id_metodo_pago} value={m.id_metodo_pago}>
                      {m.tipo_metodo} - {m.numero_cuenta}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-gray-600">No tienes métodos guardados</p>
              )}
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Dirección de envío (opcional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {savedDomicilios.length > 0 && (
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold">Usar dirección guardada</label>
                  <select className="w-full p-2 border rounded" value={selectedSavedDomicilioId || ""} onChange={(e) => {
                    const id = e.target.value ? Number(e.target.value) : null;
                    setSelectedSavedDomicilioId(id);
                    if (!id) return;
                    const dom = savedDomicilios.find(d => d.id_domicilio === id || d.id === id);
                    if (dom) {
                      setDireccionCompleta(dom.direccion_completa || "");
                      setCodigoPostal(dom.codigo_postal || "");
                      setSelectedRegion(dom.id_region || null);
                      setSelectedCiudad(dom.id_ciudad || null);
                    }
                  }}>
                    <option value="">-- Selecciona --</option>
                    {savedDomicilios.map(d => (
                      <option key={d.id_domicilio || d.id} value={d.id_domicilio || d.id}>{d.direccion_completa}</option>
                    ))}
                  </select>
                </div>
              )}
                <input className="p-2 border rounded md:col-span-2" placeholder="Dirección completa (calle, número)" value={direccionCompleta} onChange={(e) => setDireccionCompleta(e.target.value)} />
                <select className="p-2 border rounded" value={selectedRegion || ""} onChange={(e) => setSelectedRegion(Number(e.target.value) || null)}>
                  <option value="">-- Selecciona región --</option>
                  {regiones.map(r => (
                    <option key={r.id_region} value={r.id_region}>{r.nombre_region}</option>
                  ))}
                </select>
                <select className="p-2 border rounded" value={selectedCiudad || ""} onChange={(e) => setSelectedCiudad(Number(e.target.value) || null)}>
                  <option value="">-- Selecciona ciudad --</option>
                  {ciudades.map(c => (
                    <option key={c.id_ciudad} value={c.id_ciudad}>{c.nombre_ciudad}</option>
                  ))}
                </select>
                <input className="p-2 border rounded" placeholder="Código postal" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} />
                
              </div>
              <p className="text-sm text-gray-500 mt-2">Si dejas esto vacío se usará la dirección de tu cuenta (si existe).</p>
            </div>

            {!showCrearNuevo ? (
              <button className="px-4 py-2 bg-gray-100 rounded" onClick={() => setShowCrearNuevo(true)}>
                ➕ Crear nuevo método
              </button>
            ) : (
              <div className="space-y-2 mb-4">
                <label className="block">
                  Tipo
                  <select className="w-full p-2 border rounded" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                    <option>Tarjeta Crédito</option>
                    <option>Tarjeta Débito</option>
                    <option>Efectivo</option>
                    <option>Transferencia</option>
                    <option>Nequi</option>
                    <option>Daviplata</option>
                    <option>PSE</option>
                  </select>
                </label>
                <label className="block">
                  Número de cuenta
                  <input className="w-full p-2 border rounded" value={numero} onChange={(e) => setNumero(e.target.value)} />
                </label>
                <label className="block">
                  Titular
                  <input className="w-full p-2 border rounded" value={titular} onChange={(e) => setTitular(e.target.value)} />
                </label>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-[#69774A] text-white rounded" onClick={handleCrearMetodo}>Guardar</button>
                  <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowCrearNuevo(false)}>Cancelar</button>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button disabled={loading} onClick={handlePagar} className="flex-1 py-3 bg-[#7A8358] text-white rounded-xl">{loading ? 'Procesando...' : 'Pagar'}</button>
              <button onClick={onClose} className="py-3 px-4 bg-gray-200 rounded">Cancelar</button>
            </div>
          </>
        ) : (
          <div>
            <h3 className="text-xl font-semibold mb-2">Recibo generado</h3>
            <p><strong>ID:</strong> {recibo.id_recibo}</p>
            <p><strong>Monto:</strong> ${Number(recibo.monto_pagado).toFixed(2)} COP</p>
            <p className="mt-4">Gracias por su compra.</p>
            <div className="mt-4">
              <button onClick={onClose} className="px-4 py-2 bg-[#69774A] text-white rounded">Cerrar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}