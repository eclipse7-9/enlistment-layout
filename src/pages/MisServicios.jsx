import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { FaEdit, FaToggleOn, FaToggleOff } from "react-icons/fa";

export default function MisServicios() {
  const { user } = useAuth();
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchServicios();
  }, [user]);

  const fetchServicios = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/servicios/mine", { headers: { Authorization: `Bearer ${user?.token}` } });
      const mine = Array.isArray(res.data) ? res.data : [];
      setServicios(mine);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "No se pudieron cargar los servicios", confirmButtonColor: "#7a8358" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id, currentData) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar servicio",
      html:
        `<input id="tipo" class="swal2-input" placeholder="Tipo de servicio" value="${currentData.tipo_servicio}" />` +
        `<input id="estado" class="swal2-input" placeholder="Estado" value="${currentData.estado_servicio}" />` +
        `<textarea id="descripcion" class="swal2-textarea" placeholder="Descripción">${currentData.descripcion_servicio}</textarea>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#7a8358",
      cancelButtonColor: "#d33",
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        return {
          tipo_servicio: document.getElementById("tipo").value,
          estado_servicio: document.getElementById("estado").value,
          descripcion_servicio: document.getElementById("descripcion").value,
        };
      },
    });

    if (!formValues) return;

    try {
      await axios.put(
        `http://localhost:8000/servicios/${id}`,
        formValues,
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      Swal.fire({ icon: "success", title: "Actualizado", text: "Servicio actualizado", confirmButtonColor: "#7a8358" });
      fetchServicios();
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo actualizar el servicio", confirmButtonColor: "#7a8358" });
    }
  };

  const handleActivate = async (id) => {
    try {
      await axios.patch(
        `http://localhost:8000/servicios/${id}`,
        { estado_servicio: "activo" },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      Swal.fire({ icon: "success", title: "Activado", text: "Servicio activado", confirmButtonColor: "#7a8358" });
      fetchServicios();
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo activar el servicio", confirmButtonColor: "#7a8358" });
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await axios.patch(
        `http://localhost:8000/servicios/${id}`,
        { estado_servicio: "inactivo" },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      Swal.fire({ icon: "success", title: "Desactivado", text: "Servicio desactivado", confirmButtonColor: "#7a8358" });
      fetchServicios();
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo desactivar el servicio", confirmButtonColor: "#7a8358" });
    }
  };

  return (
    <section className="min-h-screen bg-[#f5f3ee] py-12 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-white/90 backdrop-blur-sm border border-[#d8c6aa] shadow-lg rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-[#7a8358] mb-6">Mis Servicios</h1>

          {loading ? (
            <p className="text-gray-500">Cargando...</p>
          ) : (
            <div className="overflow-x-auto">
              {servicios.length === 0 ? (
                <p className="text-gray-500">No tienes servicios creados.</p>
              ) : (
                <table className="min-w-full border border-[#d8c6aa] rounded-lg overflow-hidden">
                  <thead className="bg-[#7a8358] text-white text-left">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Tipo</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3">Descripción</th>
                      <th className="px-4 py-3 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white text-[#4e5932]">
                    {servicios.map((s) => (
                      <tr
                        key={s.id_servicio}
                        className="border-t border-[#e0d8c6] hover:bg-[#f7f4ef] transition"
                      >
                        <td className="px-4 py-3">{s.id_servicio}</td>
                        <td className="px-4 py-3">{s.tipo_servicio}</td>
                        <td className="px-4 py-3">{s.estado_servicio}</td>
                        <td className="px-4 py-3">{s.descripcion_servicio}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(s.id_servicio, s)}
                              className="px-3 py-1 flex items-center gap-1 bg-[#7a8358] text-white rounded hover:bg-[#6b744e] transition"
                            >
                              <FaEdit /> Editar
                            </button>
                            {s.estado_servicio === "inactivo" ? (
                              <button
                                onClick={() => handleActivate(s.id_servicio)}
                                className="px-3 py-1 flex items-center gap-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                              >
                                <FaToggleOn /> Activar
                              </button>
                            ) : (
                              <button
                                onClick={() => handleDeactivate(s.id_servicio)}
                                className="px-3 py-1 flex items-center gap-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                              >
                                <FaToggleOff /> Desactivar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
