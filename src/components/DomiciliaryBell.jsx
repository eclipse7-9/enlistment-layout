import React, { useEffect, useState, useRef } from "react";
import { FiBell } from "react-icons/fi";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

export default function DomiciliaryBell() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  useEffect(() => {
    // fetch pending or assigned pedidos for domiciliario
    const fetchPedidos = async () => {
      if (!user?.token) return;
      try {
        // Poll domicilios (new domicilios should notify domiciliario)
        const res = await axios.get("http://localhost:8000/domicilios/", { headers: { Authorization: `Bearer ${user.token}` } });
        const all = Array.isArray(res.data) ? res.data : [];
        // filter to domicilios relevant for domiciliario: Pendiente or En-entrega
        // The DB schema does not include an `id_domiciliario`, so show all pending/en-entrega items
        const relevant = all.filter(d => (d.estado_domicilio === "Pendiente" || d.estado_domicilio === "En-entrega"));
        setItems(relevant);
      } catch (err) {
        console.error("Error fetching domiciliary domicilios", err);
      }
    };
    fetchPedidos();
    const iv = setInterval(fetchPedidos, 15000); // poll every 15s
    return () => clearInterval(iv);
  }, [user]);

  const updateEstado = async (domicilio, nuevoEstado) => {
    if (!user?.token) return;
    try {
      await axios.put(`http://localhost:8000/domicilios/${domicilio.id_domicilio || domicilio.id}`, { estado_domicilio: nuevoEstado }, { headers: { Authorization: `Bearer ${user.token}` } });
      setItems(prev => prev.filter(p => (p.id_domicilio || p.id) !== (domicilio.id_domicilio || domicilio.id)));
    } catch (err) {
      console.error("Error updating domicilio status", err);
      Swal.fire('Error', 'No se pudo actualizar el estado del domicilio', 'error');
    }
  };

  const handleCancel = async (domicilio) => {
    if (!user?.token) return;
    const headers = { Authorization: `Bearer ${user.token}` };
    // send notification to admin about domicilio cancellation (no motivo)
    try {
      await axios.post(
        "http://localhost:8000/notificaciones/",
        {
          tipo: "cancelacion_domicilio",
          mensaje: `Domiciliario ${user?.correo || user?.id_usuario} canceló el domicilio ${domicilio.id_domicilio || domicilio.id}`,
          domicilio_id: domicilio.id_domicilio || domicilio.id,
          destinatario: "admin",
        },
        { headers }
      );
    } catch (err) {
      console.error("Error enviando notificación al admin", err);
      Swal.fire("Aviso", "No se pudo notificar al administrador, se marcará como cancelado localmente", "warning");
    }

    // then mark domicilio as Cancelado
    try {
      await updateEstado(domicilio, "Cancelado");
      Swal.fire("Cancelado", "Domicilio marcado como cancelado y se notificó al administrador", "success");
    } catch (err) {
      console.error("Error actualizando estado del domicilio", err);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(v => !v)} className="relative p-2 rounded hover:bg-white/10">
        <FiBell className="w-6 h-6" />
        {items.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">{items.length}</span>}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white text-black rounded shadow-lg z-50">
          <div className="p-2 border-b font-semibold">Domicilios para entrega</div>
          {items.length === 0 ? (
            <div className="p-3 text-sm text-gray-600">No hay domicilios nuevos</div>
          ) : (
            items.map((d) => {
              const id = d.id_domicilio || d.id || d.id_pedido || '-';
              const cliente = d.usuario ? `${d.usuario.nombre_usuario || ''} ${d.usuario.apellido_usuario || ''}`.trim() : (d.cliente || d.usuario?.correo_usuario || '-');
              const direccion = d.direccion_completa || (d.domicilio && d.domicilio.direccion_completa) || d.usuario?.direccion_usuario || d.direccion || '-';
              const productos = (d.pedidos && Array.isArray(d.pedidos) ? d.pedidos.flatMap(pp => (pp.productos || []).map(pr => pr.nombre_producto || pr.nombre || pr)) : (d.productos ? (Array.isArray(d.productos) ? d.productos.map(p => p.nombre || p) : []) : []));

              return (
                <div key={id} className="p-3 border-b last:border-b-0">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">Domicilio #{id}</div>
                    <div className="text-xs text-gray-500">{d.estado_domicilio || d.estado || 'Pendiente'}</div>
                  </div>
                  <div className="text-sm text-gray-700 mt-1"><strong>Cliente:</strong> {cliente}</div>
                  <div className="text-sm text-gray-700 mt-1"><strong>Dirección:</strong> {direccion}</div>
                  {productos && productos.length > 0 && (
                    <div className="text-sm text-gray-700 mt-1"><strong>Productos:</strong> {productos.slice(0,3).join(', ')}{productos.length>3? '...':''}</div>
                  )}
                  <div className="mt-2 flex gap-2">
                    {(d.estado_domicilio === 'Pendiente' || !d.estado_domicilio) && (
                      <button onClick={() => updateEstado(d, 'En-entrega')} className="px-2 py-1 bg-blue-600 text-white rounded text-sm">Marcar en proceso</button>
                    )}
                    {d.estado_domicilio === 'En-entrega' && (
                      <>
                        <button onClick={() => updateEstado(d, 'Entregado')} className="px-2 py-1 bg-green-600 text-white rounded text-sm">Marcar entregado</button>
                        <button onClick={() => handleCancel(d)} className="px-2 py-1 bg-red-500 text-white rounded text-sm">Cancelar</button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
