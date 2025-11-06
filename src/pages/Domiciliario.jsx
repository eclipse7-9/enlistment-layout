import React, { useState, useEffect } from "react";
import axios from "axios";
import DomiciliaryCards from "../components/DomiciliaryCards";

const Domiciliary = () => {
  const [pedidos, setPedidos] = useState([]);
  const [asignados, setAsignados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [modalRequire, setModalRequire] = useState(false);
  const [modalPaid, setModalPaid] = useState(false);
  const [modalPaymentType, setModalPaymentType] = useState("Efectivo");

  // 🟢 Cargar pedidos desde el backend
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8000/pedidos/disponibles/");
        setPedidos(res.data);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, []);

  // 🧪 Pedidos de ejemplo si no hay datos reales
  const [demoPedidos, setDemoPedidos] = useState([
    {
      id: 1001,
      cliente: "María López",
      direccion: "C. Falsa 123, Madrid",
      productos: ["Croquetas", "Champú"],
      pagado: false,
      tipoPago: "Efectivo",
      requiereConfirmacion: false,
    },
    {
      id: 1002,
      cliente: "Juan Pérez",
      direccion: "Av. Central 45, Valencia",
      productos: ["Juguete", "Arena"],
      pagado: false,
      tipoPago: "Efectivo",
      requiereConfirmacion: false,
    },
    {
      id: 1003,
      cliente: "Ana Gómez",
      direccion: "Pza. Mayor 8, Sevilla",
      productos: ["Lata 1kg", "Collar"],
      pagado: false,
      tipoPago: "Efectivo",
      requiereConfirmacion: false,
    },
    {
      id: 1004,
      cliente: "Luis Rivera",
      direccion: "C. Nueva 10, Bilbao",
      productos: ["Cama", "Snacks"],
      pagado: false,
      tipoPago: "Efectivo",
      requiereConfirmacion: false,
    },
    {
      id: 1005,
      cliente: "Lucía Ramos",
      direccion: "Rambla 22, Barcelona",
      productos: ["Cepillo", "Juguete"],
      pagado: false,
      tipoPago: "Efectivo",
      requiereConfirmacion: false,
    },
    {
      id: 1006,
      cliente: "Pedro Castillo",
      direccion: "P.º del Prado 3, Málaga",
      productos: ["Vitaminas", "Limpieza"],
      pagado: false,
      tipoPago: "Efectivo",
      requiereConfirmacion: false,
    },
  ]);

  // Mostrar pedidos reales si existen, o los de ejemplo
  const displayPedidos = pedidos && pedidos.length > 0 ? pedidos : demoPedidos;

  const openModal = (pedido) => {
    setSelectedPedido(pedido);
    setModalRequire(!!pedido.requiereConfirmacion);
    setModalPaid(!!pedido.pagado);
    setModalPaymentType(pedido.tipoPago || "Efectivo");
  };

  const handleAceptar = (pedido) => {
    // Guardar info de pago/aceptación
    setAsignados([
      ...asignados,
      {
        ...pedido,
        pagado: modalPaid,
        tipoPago: modalPaymentType,
        requiereConfirmacion: modalRequire,
      },
    ]);

    // Eliminar pedido aceptado del listado
    if (pedidos && pedidos.length > 0) {
      setPedidos(pedidos.filter((p) => p.id !== pedido.id));
    } else {
      setDemoPedidos(demoPedidos.filter((p) => p.id !== pedido.id));
    }

    setSelectedPedido(null);
  };

  return (
    <section className="relative min-h-screen overflow-hidden font-[Poppins] text-[#4A5B2E]">
      {/* 🌄 Fondo con degradado animado */}
      <div className="absolute inset-0 bg-linear-to-br from-[#C7D8A5] via-[#F2F7EB] to-[#7A8358] bg-[length:300%_300%] animate-gradient-slow"></div>

      {/* ✨ Capa translúcida */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

      {/* 🌿 Contenido principal */}
      <div className="relative z-10 max-w-6xl mx-auto p-6 md:p-10">
        {/* Descripción */}
        <div className="max-w-3xl mx-auto text-center mb-6">
          <p className="text-lg text-[#556140]">
            Aquí tienes una lista de pedidos disponibles. Elige uno y pulsa{" "}
            <span className="font-semibold">Aceptar Pedido</span> para
            asignarlo a tu cuenta.
          </p>
        </div>

        {/* 🛍 Pedidos disponibles */}
        <section className="mt-6 min-h-[320px] w-full bg-gradient-to-r from-[#A9D7A6] via-[#CAF2FF] to-[#FFFDD8] rounded-2xl p-8">
          {loading ? (
            <p className="text-center text-gray-600 animate-pulse">
              Cargando pedidos...
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
              {displayPedidos && displayPedidos.length > 0 ? (
                displayPedidos.map((pedido) => (
                  <DomiciliaryCards
                    key={pedido.id}
                    pedido={pedido}
                    onSelect={() => openModal(pedido)}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-full">
                  No hay pedidos disponibles por ahora.
                </p>
              )}
            </div>
          )}
        </section>

        {/* 🪟 Modal Detalle Pedido */}
        {selectedPedido && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setSelectedPedido(null)}
            />
            <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl z-10">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-[#556140]">
                  Detalle Pedido #{selectedPedido.id}
                </h3>
                <button
                  onClick={() => setSelectedPedido(null)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cerrar
                </button>
              </div>

              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>Cliente:</strong> {selectedPedido.cliente}
                </p>
                <p>
                  <strong>Dirección:</strong> {selectedPedido.direccion}
                </p>
                <div>
                  <strong>Productos:</strong>
                  <ul className="list-disc list-inside ml-4">
                    {selectedPedido.productos &&
                      selectedPedido.productos.map((prod, i) => (
                        <li key={i}>{prod}</li>
                      ))}
                  </ul>
                </div>

                <div className="pt-2 border-t" />

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={modalRequire}
                    onChange={(e) => setModalRequire(e.target.checked)}
                  />
                  <span>Requiere confirmación</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={modalPaid}
                    onChange={(e) => setModalPaid(e.target.checked)}
                  />
                  <span>Pagado</span>
                </label>

                {!modalPaid && (
                  <div className="flex flex-col">
                    <label className="mb-1">Tipo de pago</label>
                    <select
                      value={modalPaymentType}
                      onChange={(e) =>
                        setModalPaymentType(e.target.value)
                      }
                      className="border rounded p-2 max-w-xs"
                    >
                      <option>Efectivo</option>
                      <option>Tarjeta</option>
                      <option>Transferencia</option>
                      <option>Otra</option>
                    </select>
                  </div>
                )}

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleAceptar(selectedPedido)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={() => setSelectedPedido(null)}
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Domiciliary;
