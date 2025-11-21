import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

export default function AdminDomicilios() {
  const { user } = useAuth();
  const [domicilios, setDomicilios] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estado del modal de opciones
  const [optionsModal, setOptionsModal] = useState(null);

  // Modal de detalles
  const [selectedDomicilio, setSelectedDomicilio] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
      const [dRes, nRes] = await Promise.all([
        axios.get("http://localhost:8000/domicilios/", { headers }),
        axios.get("http://localhost:8000/notificaciones/", { headers }),
      ]);

      const rawD = Array.isArray(dRes.data) ? dRes.data : [];

      const enriched = await Promise.all(
        rawD.map(async (d) => {
          const copy = { ...d };
          // Cliente
          try {
            if (d.id_usuario) {
              const u = await axios.get(
                `http://localhost:8000/usuarios/${d.id_usuario}`,
                { headers }
              );
              copy.usuario = u.data;
            }
          } catch {}
          

          return copy;
        })
      );

      setDomicilios(enriched);
      setNotifs(Array.isArray(nRes.data) ? nRes.data : []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudieron cargar domicilios o notificaciones", "error");
    } finally {
      setLoading(false);
    }
  };

  // Nota: se eliminó el almacenamiento/visualización del motivo de cancelación.

  // El envío de mensajes al domiciliario fue eliminado del panel del admin.

  const handleChangeEstado = async (domicilio, estado) => {
    try {
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};

      await axios.put(
        `http://localhost:8000/domicilios/${domicilio.id_domicilio || domicilio.id}`,
        { estado_domicilio: estado },
        { headers }
      );

      Swal.fire("Actualizado", "El estado ha sido cambiado", "success");
      fetchAll();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo actualizar el estado", "error");
    }
  };

  const handleAdminCancel = async (domicilio) => {
    try {
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};

      // Crear notificación sin motivo, enviar al dueño del domicilio (id_usuario)
      await axios.post(
        "http://localhost:8000/notificaciones/",
        {
          tipo: "cancelacion_admin",
          mensaje: `Cancelado por admin`,
          domicilio_id: domicilio.id_domicilio || domicilio.id,
          destinatario: domicilio.id_usuario || null,
        },
        { headers }
      );

      await axios.put(
        `http://localhost:8000/domicilios/${domicilio.id_domicilio || domicilio.id}`,
        { estado_domicilio: "Cancelado" },
        { headers }
      );

      Swal.fire("Cancelado", "El domicilio ha sido cancelado", "success");
      fetchAll();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo cancelar", "error");
    }
  };

  return (
    <section className="min-h-screen bg-[#f5f3ee] py-12 px-6 md:px-16 pt-24">
      
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm border border-[#d8c6aa] shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-[#7a8358] mb-6">
          Gestión de Domicilios
        </h1>

        {loading ? (
          <p>Cargando domicilios...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-[#d8c6aa] rounded-lg overflow-hidden">
              <thead className="bg-[#7A8358] text-white text-left">
                <tr>
                  <th className="px-4 py-3">Domicilio</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Dirección</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>

              <tbody className="bg-white text-[#4e5932]">
                {domicilios.map((d) => (
                  <tr
                    key={d.id_domicilio || d.id}
                    className="border-t border-[#e0d8c6] hover:bg-[#f7f4ef]"
                  >
                    <td className="px-4 py-3">{d.id_domicilio || d.id}</td>

                    <td className="px-4 py-3">
                      {d.usuario
                        ? `${d.usuario.nombre_usuario || ""} ${
                            d.usuario.apellido_usuario || ""
                          }`
                        : d.cliente || "-"}
                    </td>

                    <td className="px-4 py-3">
                      {d.direccion_completa || d.direccion || "-"}
                    </td>

                    <td className="px-4 py-3">
                      {d.estado_domicilio || d.estado || "-"}
                    </td>

                    

                    <td className="px-4 py-3">
                      <button
                        onClick={() => setOptionsModal(d)}
                        className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                      >
                        Opciones ▾
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ---------------- MODAL OPCIONES BONITO ---------------- */}
      {optionsModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center">
          
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOptionsModal(null)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl p-7 w-full max-w-md border border-[#d8c6aa] animate-fadeIn">
            <h3 className="text-2xl font-bold text-[#556140] mb-5 flex items-center">
              <span className="w-3 h-3 rounded-full bg-[#7A8358] mr-3"></span>
              Opciones del domicilio #{optionsModal.id_domicilio || optionsModal.id}
            </h3>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setSelectedDomicilio(optionsModal);
                  setOptionsModal(null);
                }}
                className="px-4 py-3 rounded-lg bg-[#7A8358] text-white font-medium hover:bg-[#6c764f] transition"
              >
                Ver detalles
              </button>

              {/* Motivo de cancelación eliminado */}

              {/* Enviar mensaje al domiciliario eliminado */}

              <button
                onClick={() => {
                  handleChangeEstado(optionsModal, "En-entrega");
                  setOptionsModal(null);
                }}
                className="px-4 py-3 rounded-lg bg-yellow-300 font-semibold hover:bg-yellow-400 transition"
              >
                Marcar En-entrega
              </button>

              <button
                onClick={() => {
                  handleChangeEstado(optionsModal, "Entregado");
                  setOptionsModal(null);
                }}
                className="px-4 py-3 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
              >
                Marcar Entregado
              </button>

              <button
                onClick={() => {
                  handleAdminCancel(optionsModal);
                  setOptionsModal(null);
                }}
                className="px-4 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
              >
                Cancelar pedido
              </button>

              <button
                onClick={() => setOptionsModal(null)}
                className="mt-2 px-4 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL DETALLES ---------------- */}
      {selectedDomicilio && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedDomicilio(null)}
          />

          <div className="relative bg-white rounded-2xl shadow-xl p-7 w-full max-w-2xl border border-[#d8c6aa]">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-[#556140]">
                Detalle Domicilio #
                {selectedDomicilio.id_domicilio || selectedDomicilio.id}
              </h3>

              <button
                onClick={() => setSelectedDomicilio(null)}
                className="text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Cliente:</strong>{" "}
                {selectedDomicilio.usuario
                  ? `${selectedDomicilio.usuario.nombre_usuario} ${selectedDomicilio.usuario.apellido_usuario}`
                  : "-"}
              </p>

              <p>
                <strong>Correo:</strong>{" "}
                {selectedDomicilio.usuario?.correo_usuario || "-"}
              </p>

              <p>
                <strong>Domiciliario:</strong>{" "}
                {selectedDomicilio.domiciliarioInfo
                  ? `${selectedDomicilio.domiciliarioInfo.nombre_usuario} ${selectedDomicilio.domiciliarioInfo.apellido_usuario}`
                  : "-"}
              </p>

              <p>
                <strong>Dirección:</strong>{" "}
                {selectedDomicilio.direccion_completa ||
                  selectedDomicilio.direccion ||
                  "-"}
              </p>

              <p>
                <strong>Estado:</strong>{" "}
                {selectedDomicilio.estado_domicilio ||
                  selectedDomicilio.estado ||
                  "-"}
              </p>

              {(selectedDomicilio.pedidos ||
                selectedDomicilio.productos) && (
                <div>
                  <strong>Productos:</strong>
                  <ul className="list-disc ml-5 mt-2">
                    {(selectedDomicilio.pedidos || [])
                      .flatMap((p) => p.productos || [])
                      .map((prod, i) => (
                        <li key={i}>{prod.nombre_producto || prod.nombre}</li>
                      ))}

                    {Array.isArray(selectedDomicilio.productos) &&
                      selectedDomicilio.productos.map((p, i) => (
                        <li key={i}>{p.nombre}</li>
                      ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => {
                    handleChangeEstado(selectedDomicilio, "En-entrega");
                    setSelectedDomicilio(null);
                  }}
                  className="bg-yellow-300 px-4 py-2 rounded-lg hover:bg-yellow-400"
                >
                  Marcar En-entrega
                </button>

                <button
                  onClick={() => {
                    handleChangeEstado(selectedDomicilio, "Entregado");
                    setSelectedDomicilio(null);
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Marcar Entregado
                </button>

                <button
                  onClick={() => {
                    handleAdminCancel(selectedDomicilio);
                    setSelectedDomicilio(null);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Cancelar
                </button>

                <button
                  onClick={() => setSelectedDomicilio(null)}
                  className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
