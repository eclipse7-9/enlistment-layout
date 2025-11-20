import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import DomiciliaryCards from "../components/DomiciliaryCards";
import { useAlert } from "../context/AlertContext";

const Domiciliary = () => {
  const [pedidos, setPedidos] = useState([]);
  const [asignados, setAsignados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [modalRequire, setModalRequire] = useState(false);
  const [modalPaid, setModalPaid] = useState(false);
  const [modalPaymentType, setModalPaymentType] = useState("Efectivo");
  const { user } = useAuth();
  const { showAlert } = useAlert();

  

  // mapa cache para productos por id
  const productCache = {};

  // 🟢 Cargar pedidos desde el backend
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const token = user?.token;
        // ahora listamos domicilios (según nueva petición)
        const res = await axios.get("http://localhost:8000/domicilios/", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const domiciliosRaw = res.data || [];

        // enriquecer cada domicilio con el usuario asociado
        const domiciliosEnriquecidos = await Promise.all(
          domiciliosRaw.map(async (dom) => {
            let usuario = null;
            try {
              const uRes = await axios.get(`http://localhost:8000/usuarios/${dom.id_usuario}`);
              usuario = uRes.data;
            } catch (err) {
              usuario = { nombre_usuario: "Desconocido", apellido_usuario: "", correo_usuario: "-" };
            }

            return {
              ...dom,
              id: dom.id_domicilio || dom.id,
              usuario,
            };
          })
        );

        setPedidos(domiciliosEnriquecidos);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Mostrar únicamente pedidos reales obtenidos de la base de datos (creados por usuarios registrados)
  const displayPedidos = pedidos || [];

  const openModal = (pedido) => {
    setSelectedPedido(pedido);
    setModalRequire(!!pedido.requiereConfirmacion);
    setModalPaid(!!pedido.pagado);
    setModalPaymentType(pedido.tipoPago || "Efectivo");
    setEstadoDomicilio(pedido.estado_domicilio || pedido.estado || "Pendiente");
  };

  const [estadoDomicilio, setEstadoDomicilio] = useState("Pendiente");

  const updateEstadoDomicilio = async (domicilioId, nuevoEstado) => {
    try {
      const token = user?.token;
      const res = await axios.put(
        `http://localhost:8000/domicilios/${domicilioId}`,
        { estado_domicilio: nuevoEstado },
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );

      // actualizar estado en la lista y en el modal
      setPedidos((prev) => prev.map((d) => (d.id_domicilio === domicilioId || d.id === domicilioId ? { ...d, estado_domicilio: nuevoEstado } : d)));
      setSelectedPedido((s) => ({ ...s, estado_domicilio: nuevoEstado }));
      try { showAlert({ type: 'success', message: 'Estado del domicilio actualizado' }); } catch(e){}
    } catch (err) {
      console.error("Error actualizando estado del domicilio", err);
      try { showAlert({ type: 'error', message: 'No se pudo actualizar el estado del domicilio.' }); } catch(e){}
    }
  };
  const updatePedidoEstado = async (pedidoId, nuevoEstado) => {
    try {
      const token = user?.token;
      await axios.put(
        `http://localhost:8000/pedidos/${pedidoId}`,
        { estado_pedido: nuevoEstado },
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );

      // refrescar lista localmente
      setPedidos((prev) =>
        prev.map((p) =>
          (p.id_pedido === pedidoId || p.id === pedidoId)
            ? { ...p, estado_pedido: nuevoEstado }
            : p
        )
      );
      if (selectedPedido && (selectedPedido.id_pedido === pedidoId || selectedPedido.id === pedidoId)) {
        setSelectedPedido((s) => ({ ...s, estado_pedido: nuevoEstado }));
      }
    } catch (err) {
      console.error("Error actualizando estado del pedido", err);
      try { showAlert({ type: 'error', message: 'No se pudo actualizar el estado del pedido.' }); } catch(e){}
    }
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
    setPedidos((prev) => prev.filter((p) => (p.id_pedido || p.id) !== (pedido.id_pedido || pedido.id)));

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
          <div className="flex items-center justify-center gap-4">
            <p className="text-lg text-[#556140]">
              Aquí tienes una lista de domicilios registrados. Selecciona uno para ver sus detalles.
            </p>

            {/* Perfil accesible desde el navbar; botón eliminado para evitar duplicados */}
          </div>
        </div>

        {/* 🛍 Pedidos disponibles */}
        <section className="mt-6 min-h-[320px] w-full bg-gradient-to-r from-[#A9D7A6] via-[#CAF2FF] to-[#FFFDD8] rounded-2xl p-8">
          {loading ? (
            <p className="text-center text-gray-600 animate-pulse">
              Cargando domicilios...
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
              {displayPedidos && displayPedidos.length > 0 ? (
                displayPedidos.map((pedido) => {
                  // normalizar datos para la tarjeta
                  const display = {
                    id: pedido.id_pedido || pedido.id,
                    cliente:
                      (pedido.usuario && `${pedido.usuario.nombre_usuario || ''} ${pedido.usuario.apellido_usuario || ''}`.trim()) ||
                      pedido.cliente ||
                      (pedido.usuario && pedido.usuario.correo_usuario) ||
                      "Cliente desconocido",
                    direccion: pedido.direccion_completa || (pedido.domicilio ? `${pedido.domicilio.direccion_completa}` : null) || (pedido.usuario && (pedido.usuario.direccion_usuario || pedido.usuario.correo_usuario)) || pedido.direccion || "-",
                    productos: (
                      (pedido.pedidos && pedido.pedidos.flatMap((pp) => (pp.productos || []).map((pr) => pr.nombre_producto || pr.nombre || pr)))
                      || (pedido.productos ? pedido.productos.map((p) => p.nombre || p) : pedido.productos || [])
                    ),
                  };

                  return (
                    <DomiciliaryCards
                      key={display.id}
                      pedido={display}
                      onSelect={() => openModal(pedido)}
                    />
                  );
                })
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
                  Detalle Domicilio #{selectedPedido.id_domicilio || selectedPedido.id}
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
                  <strong>Dirección (completa):</strong> {selectedPedido.direccion_completa || "-"}
                </p>
                <p>
                  <strong>Dirección completa:</strong> {selectedPedido.direccion_completa || "-"}
                </p>
                <p>
                  <strong>Código postal:</strong> {selectedPedido.codigo_postal || "-"}
                </p>
                <p>
                  <strong>Región / Ciudad:</strong> {selectedPedido.id_region || "-"} / {selectedPedido.id_ciudad || "-"}
                </p>
                <p>
                  <strong>Cliente:</strong>{" "}
                  {selectedPedido.usuario
                    ? `${selectedPedido.usuario.nombre_usuario || ''} ${selectedPedido.usuario.apellido_usuario || ''}`.trim()
                    : selectedPedido.usuario?.correo_usuario}
                </p>

                {/* Estado del domicilio: editable por domiciliarios */}
                <div className="mt-3">
                  <label className="block font-semibold mb-1">Estado del domicilio:</label>
                  <select
                    value={estadoDomicilio}
                    onChange={(e) => setEstadoDomicilio(e.target.value)}
                    className="border rounded p-2"
                    disabled={user?.id_rol !== 3}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En-entrega">En-entrega</option>
                    <option value="Entregado">Entregado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>

                <div className="mt-4">
                  <strong>Productos a entregar:</strong>
                  <ul className="list-disc list-inside ml-4 mt-2">
                    {(selectedPedido.pedidos || []).flatMap(p => p.productos || []).map((prod, i) => (
                      <li key={i}>{prod.nombre_producto || prod.nombre || prod}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3 mt-4">
                  {user?.id_rol === 3 && (
                    <button
                      onClick={() => updateEstadoDomicilio(selectedPedido.id_domicilio || selectedPedido.id, estadoDomicilio)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      Guardar estado
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedPedido(null)}
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Perfil gestionado en la ruta /domiciliario/perfil */}
      </div>
    </section>
  );
};

export default Domiciliary;
