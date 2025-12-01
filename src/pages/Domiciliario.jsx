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

        // Cargar regiones y ciudades para mostrar nombres
        const [regRes, citiesRes] = await Promise.all([
          axios.get("http://localhost:8000/ubicaciones/regiones"),
          axios.get("http://localhost:8000/ubicaciones/ciudades"),
        ]);
        const regionesMap = Object.fromEntries((regRes.data || []).map(r => [r.id_region, r.nombre_region]));
        const ciudadesMap = Object.fromEntries((citiesRes.data || []).map(c => [c.id_ciudad, c.nombre_ciudad]));

        // enriquecer cada domicilio con el usuario y nombres de region/ciudad
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
              region: regionesMap[dom.id_region] || null,
              ciudad: ciudadesMap[dom.id_ciudad] || null,
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
  // Excluir pedidos que ya fueron entregados o cancelados para que no aparezcan en el panel del domiciliario
  const displayPedidos = (pedidos || []).filter(p => !(p.estado_domicilio === 'Entregado' || p.estado_domicilio === 'Cancelado'));

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
    <section className="relative min-h-screen overflow-hidden font-[Poppins] text-[#33461e] bg-[#f3f6ef] py-10">
      {/* subtle decorative background */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_left,_#e8f6d9,_transparent_30%)] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#58783a] mb-2">Panel de Domiciliarios</h1>
          <p className="text-sm text-gray-600">Lista de domicilios disponibles y asignados — pulsa en una tarjeta para ver y actualizar el estado.</p>
        </div>

        <section className="w-full bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#e6ead8]">
          {loading ? (
            <div className="py-12 text-center">
              <p className="text-gray-600 animate-pulse">Cargando domicilios...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayPedidos && displayPedidos.length > 0 ? (
                displayPedidos.map((pedido) => {
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
                    estado_domicilio: pedido.estado_domicilio || pedido.estado || null,
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
                <div className="col-span-full py-16 text-center">
                  <p className="text-gray-500">No hay domicilios disponibles por ahora.</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* 🪟 Modal Detalle Pedido mejorado */}
        {selectedPedido && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setSelectedPedido(null)}
            />

            <div className="relative bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-3xl z-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-[#2f4f20]">Detalle Domicilio #{selectedPedido.id_domicilio || selectedPedido.id}</h3>
                  <p className="text-sm text-gray-500 mt-1">Información del domicilio y acciones rápidas para domiciliarios.</p>
                </div>

                <div className="flex items-center gap-3">
                  {selectedPedido.estado_domicilio && (
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${selectedPedido.estado_domicilio === 'Entregado' ? 'bg-green-100 text-green-800' : selectedPedido.estado_domicilio === 'En-entrega' ? 'bg-yellow-100 text-yellow-800' : selectedPedido.estado_domicilio === 'Cancelado' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                      {selectedPedido.estado_domicilio}
                    </span>
                  )}

                  <button onClick={() => setSelectedPedido(null)} className="text-gray-600 hover:text-gray-800">Cerrar ✕</button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500">Cliente</div>
                    <div className="font-medium text-gray-800">{(selectedPedido.usuario && `${selectedPedido.usuario.nombre_usuario || ''} ${selectedPedido.usuario.apellido_usuario || ''}`.trim()) || selectedPedido.usuario?.correo_usuario || 'Cliente desconocido'}</div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">Dirección</div>
                    <div className="text-sm text-gray-800">{selectedPedido.direccion_completa || (selectedPedido.domicilio && selectedPedido.domicilio.direccion_completa) || '-'}</div>
                  </div>

                  <div className="flex gap-4">
                    <div>
                      <div className="text-xs text-gray-500">Código postal</div>
                      <div className="text-sm text-gray-800">{selectedPedido.codigo_postal || '-'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Región / Ciudad</div>
                      <div className="text-sm text-gray-800">{(selectedPedido.region && selectedPedido.region.nombre_region) || selectedPedido.id_region || '-'} / {(selectedPedido.ciudad && selectedPedido.ciudad.nombre_ciudad) || selectedPedido.id_ciudad || '-'}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500">Productos a entregar</div>
                    <ul className="list-disc list-inside ml-3 mt-2 text-sm text-gray-700 max-h-40 overflow-auto">
                      {(selectedPedido.pedidos || []).flatMap(p => p.productos || []).map((prod, i) => (
                        <li key={i}>{prod.nombre_producto || prod.nombre || prod}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">Estado del domicilio</div>
                    <div className="mt-2 flex items-center gap-3">
                      <select
                        value={estadoDomicilio}
                        onChange={(e) => setEstadoDomicilio(e.target.value)}
                        className="border rounded p-2 bg-white"
                        disabled={user?.id_rol !== 3}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="En-entrega">En-entrega</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>

                      {user?.id_rol === 3 && (
                        <button
                          onClick={() => updateEstadoDomicilio(selectedPedido.id_domicilio || selectedPedido.id, estadoDomicilio)}
                          className="px-4 py-2 bg-gradient-to-r from-[#2f8a3a] to-[#276428] text-white rounded-lg hover:from-[#2a7a33] hover:to-[#205522]"
                        >
                          Guardar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedPedido(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cerrar
                </button>
                {user?.id_rol === 3 && (
                  <button
                    onClick={() => { handleAceptar(selectedPedido); setSelectedPedido(null); }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Aceptar pedido
                  </button>
                )}
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
