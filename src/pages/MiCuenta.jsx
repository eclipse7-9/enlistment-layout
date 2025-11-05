import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function MiCuenta() {
  const { user, setUser } = useAuth();
  // Construir la URL que usará el navegador para mostrar la imagen de perfil
  const getProfileImageSrc = (img) => {
    if (!img) return 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
    if (img.startsWith('data:')) return img; // ya es data URL
    if (img.startsWith('http')) return img;
    // ruta relativa desde el backend
    return `http://localhost:8000${img}`;
  };
  const [loading, setLoading] = useState(true);
  const [pedidos, setPedidos] = useState([]);
  const [recibos, setRecibos] = useState([]);
  const [editingPedidoId, setEditingPedidoId] = useState(null);
  const [editForm, setEditForm] = useState({ total: "", estado_pedido: "" });
  const [selectedRecibo, setSelectedRecibo] = useState(null);
  const [showReciboModal, setShowReciboModal] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return setLoading(false);
      setLoading(true);
      try {
        const headers = { Authorization: `Bearer ${user.token}` };

        const [pedRes, recRes] = await Promise.all([
          axios.get("http://localhost:8000/pedidos/", { headers }),
          axios.get("http://localhost:8000/recibos/", { headers }),
        ]);

        setPedidos(Array.isArray(pedRes.data) ? pedRes.data : []);
        setRecibos(Array.isArray(recRes.data) ? recRes.data : []);
      } catch (err) {
        console.error("Error cargando datos de cuenta:", err);
        setError("No se pudieron cargar los datos. Revisa la consola.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-200 via-yellow-100 to-green-200 px-4">
        <div className="text-center p-10 bg-white rounded-3xl shadow-lg max-w-md animate-fadeIn">
          <h2 className="text-3xl font-bold mb-4 text-[#7A8358]">Acceso requerido</h2>
          <p className="text-gray-600 text-lg">Debes iniciar sesión para ver tu cuenta.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F3EE] to-[#E6E3D3] py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-4xl font-extrabold text-[#7A8358] drop-shadow-md tracking-wide animate-fadeInDown">Mi cuenta</h1>

        {/* Datos de usuario */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-green-200 animate-fadeInUp hover:shadow-2xl transition-shadow duration-500">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-green-300 pb-2">Datos de usuario</h2>
          
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Foto de perfil */}
            <div className="w-full md:w-48 flex flex-col items-center gap-4">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#7A8358] shadow-lg">
                <img 
                  src={getProfileImageSrc(user.imagen_usuario)} 
                  alt="Foto de perfil" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  id="profile-picture-input"
                  className="hidden"
                  onChange={async (e) => {
                    console.log("File input changed");
                    const file = e.target.files?.[0];
                    if (!file) {
                      console.log("No file selected");
                      return;
                    }
                    console.log("File selected:", file.name);

                    try {
                      setUploading(true);
                      const formData = new FormData();
                      formData.append('file', file); // Changed to match backend parameter name

                      const headers = { 
                        Authorization: `Bearer ${user.token}`,
                        'Accept': 'application/json',
                      };
                      delete headers['Content-Type']; // Let browser set it with boundary

                      console.log("Sending request to update profile picture");
                      // Mostrar el File que hemos añadido al FormData
                      console.log("FormData file:", formData.get('file'));
                      // No fijar manualmente 'Content-Type': el navegador/axios añade el boundary correctamente
                      const response = await axios.patch(
                        `http://localhost:8000/usuarios/${user.id_usuario}/imagen`,
                        formData,
                        { headers }
                      );
                      console.log("Response received:", response.data);

                      // Actualizar el localStorage y el estado del usuario
                      const newImageUrl = response.data.imagen_usuario;
                      localStorage.setItem("imagen_usuario", newImageUrl);
                      
                      setUser(prev => ({
                        ...prev,
                        imagen_usuario: newImageUrl
                      }));

                      // Mostrar mensaje de éxito
                      alert("Imagen de perfil actualizada correctamente");
                    } catch (err) {
                      console.error('Error actualizando imagen:', err);
                      const errorMsg = err.response?.data?.detail || err.message;
                      alert(`Error al actualizar la imagen de perfil: ${errorMsg}`);
                    } finally {
                      setUploading(false);
                    }
                  }}
                />
                <button
                  onClick={() => {
                    console.log("Button clicked");
                    document.getElementById('profile-picture-input').click();
                  }}
                  disabled={uploading}
                  className="px-4 py-2 bg-[#7A8358] hover:bg-[#90a06a] disabled:bg-gray-400 
                    transition-colors rounded-full text-white text-sm font-semibold shadow-md 
                    focus:outline-none focus:ring-4 focus:ring-green-400"
                >
                  {uploading ? 'Subiendo...' : 'Cambiar foto'}
                </button>
              </div>
            </div>

            {/* Datos del usuario */}
            <div className="flex-1">
              <p className="text-lg mb-2"><strong className="text-[#7A8358]">Correo:</strong> {user.correo}</p>
              <p className="text-lg mb-2"><strong className="text-[#7A8358]">ID usuario:</strong> {user.id_usuario}</p>
              <p className="text-sm text-gray-500 italic">Rol: {user.id_rol}</p>
            </div>
          </div>
        </section>

        {/* Historial de pedidos */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-green-200 animate-fadeInUp hover:shadow-2xl transition-shadow duration-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 tracking-wide">Historial de pedidos</h2>
          </div>

          {loading ? (
            <p className="animate-pulse text-gray-600 text-center text-lg">Cargando pedidos...</p>
          ) : error ? (
            <p className="text-red-500 text-center font-semibold">{error}</p>
          ) : pedidos.length === 0 ? (
            <p className="text-gray-600 text-center text-lg">No tienes pedidos aún.</p>
          ) : (
            <div className="space-y-5">
              {pedidos.map((p) => (
                <div
                  key={p.id_pedido ?? p.id}
                  className="p-5 border border-green-100 rounded-2xl shadow-sm bg-gradient-to-tr from-white to-green-50
                    hover:scale-[1.02] hover:shadow-lg transform transition-transform duration-300"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-semibold text-[#52734D] text-xl">Pedido #{p.id_pedido ?? p.id}</p>
                      {!editingPedidoId || editingPedidoId !== (p.id_pedido ?? p.id) ? (
                        <p className="text-gray-700 mt-1">Estado: <span className="capitalize">{p.estado_pedido ?? p.estado}</span></p>
                      ) : (
                        <input
                          className="mt-2 p-2 border border-green-300 rounded-lg w-full focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                          value={editForm.estado_pedido}
                          onChange={(e) => setEditForm((s) => ({ ...s, estado_pedido: e.target.value }))}
                        />
                      )}
                    </div>
                    <div className="text-right text-gray-800 w-48 font-mono text-lg">
                      {!editingPedidoId || editingPedidoId !== (p.id_pedido ?? p.id) ? (
                        <>
                          <p className="font-semibold">Total: ${Number(p.total ?? p.monto_total ?? 0).toFixed(2)}</p>
                          <p className="text-xs text-gray-400 mt-1">{p.fecha_creacion ? new Date(p.fecha_creacion).toLocaleString() : (p.fecha ? new Date(p.fecha).toLocaleString() : "-")}</p>
                        </>
                      ) : (
                        <input
                          type="number"
                          min="0"
                          className="mt-1 p-2 border border-green-300 rounded-lg w-full text-right focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                          value={editForm.total}
                          onChange={(e) => setEditForm((s) => ({ ...s, total: e.target.value }))}
                        />
                      )}
                    </div>
                  </div>
                  <div className="mt-5 flex gap-3 justify-end">
                    {!editingPedidoId || editingPedidoId !== (p.id_pedido ?? p.id) ? (
                      <>
                        <button
                          onClick={() => {
                            setEditingPedidoId(p.id_pedido ?? p.id);
                            setEditForm({ total: String(p.total ?? p.monto_total ?? ""), estado_pedido: p.estado_pedido ?? p.estado ?? "" });
                          }}
                          className="px-5 py-2 bg-[#7A8358] hover:bg-[#90a06a] transition-colors rounded-full text-white font-semibold shadow-md focus:outline-none focus:ring-4 focus:ring-green-400"
                        >
                          Editar
                        </button>
                        <button
                          onClick={async () => {
                            if (!confirm("¿Eliminar este pedido? Esta acción no se puede revertir.")) return;
                            try {
                              const headers = { Authorization: `Bearer ${user.token}` };
                              await axios.delete(`http://localhost:8000/pedidos/${p.id_pedido ?? p.id}`, { headers });
                              setPedidos((prev) => prev.filter((x) => (x.id_pedido ?? x.id) !== (p.id_pedido ?? p.id)));
                            } catch (err) {
                              console.error("Error eliminando pedido:", err);
                              const serverMsg = err?.response?.data?.detail || err?.response?.data || err.message;
                              alert(`No se pudo eliminar el pedido: ${serverMsg}`);
                            }
                          }}
                          className="px-5 py-2 bg-red-500 hover:bg-red-600 transition-colors rounded-full text-white font-semibold shadow-md focus:outline-none focus:ring-4 focus:ring-red-400"
                        >
                          Eliminar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={async () => {
                            try {
                              const headers = { Authorization: `Bearer ${user.token}` };
                              const payload = {
                                estado_pedido: editForm.estado_pedido,
                                total: editForm.total !== "" ? Number(editForm.total) : undefined,
                              };
                              const res = await axios.put(`http://localhost:8000/pedidos/${p.id_pedido ?? p.id}`, payload, { headers });
                              setPedidos((prev) => prev.map((item) => (item.id_pedido ?? item.id) === (res.data.id_pedido ?? res.data.id) ? res.data : item));
                              setEditingPedidoId(null);
                            } catch (err) {
                              console.error("Error actualizando pedido:", err);
                              alert("No se pudo actualizar el pedido. Revisa la consola.");
                            }
                          }}
                          className="px-5 py-2 bg-green-600 hover:bg-green-700 transition-colors rounded-full text-white font-semibold shadow-md focus:outline-none focus:ring-4 focus:ring-green-500"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditingPedidoId(null)}
                          className="px-5 py-2 bg-gray-300 hover:bg-gray-400 transition-colors rounded-full font-semibold shadow-md focus:outline-none focus:ring-4 focus:ring-gray-400"
                        >
                          Cancelar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recibos */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-green-200 animate-fadeInUp hover:shadow-2xl transition-shadow duration-500">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recibos</h2>
          {recibos.length === 0 ? (
            <p className="text-gray-600 text-center">No hay recibos disponibles.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recibos.map((r) => (
                <div
                  key={r.id_recibo ?? r.id}
                  className="p-4 border border-green-100 rounded-2xl bg-gradient-to-tr from-white to-green-50 shadow-sm hover:shadow-lg transition-transform transform hover:scale-[1.02] cursor-pointer"
                  onClick={() => {
                    setSelectedRecibo(r);
                    setShowReciboModal(true);
                  }}
                >
                  <p className="font-semibold text-[#52734D]">Recibo #{r.id_recibo ?? r.id}</p>
                  <p className="text-gray-700 mt-1">Monto: ${Number(r.monto ?? r.total ?? 0).toFixed(2)}</p>
                  <p className="text-xs text-gray-400 mt-1">{r.fecha ? new Date(r.fecha).toLocaleString() : "-"}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Modal de recibo */}
        {showReciboModal && selectedRecibo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-3xl p-8 w-11/12 max-w-lg shadow-2xl animate-fadeInUp relative">
              <h3 className="text-2xl font-bold mb-4">Recibo #{selectedRecibo.id_recibo ?? selectedRecibo.id}</h3>
              <p className="text-gray-700 mb-2">Monto: ${Number(selectedRecibo.monto ?? selectedRecibo.total ?? 0).toFixed(2)}</p>
              <p className="text-gray-500 mb-4">Fecha: {selectedRecibo.fecha ? new Date(selectedRecibo.fecha).toLocaleString() : "-"}</p>
              <button
                onClick={() => setShowReciboModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition text-xl font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
