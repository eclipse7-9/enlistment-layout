import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

export default function CitasEmprendedor() {
  const { user } = useAuth();
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchCitas();
  }, [user]);

  const fetchCitas = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/citas/owner", { headers: { Authorization: `Bearer ${user?.token}` } });
      const all = Array.isArray(res.data) ? res.data : [];
      setCitas(all);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "No se pudieron cargar las citas", confirmButtonColor: "#7a8358" });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      const url = `http://localhost:8000/citas/${id}/${action}`;
      await axios.post(url, null, { headers: { Authorization: `Bearer ${user?.token}` } });
      Swal.fire({ icon: "success", title: "Hecho", text: `Cita ${action} correctamente`, confirmButtonColor: "#7a8358" });
      fetchCitas();
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo ejecutar la acción", confirmButtonColor: "#7a8358" });
    }
  };

  return (
    <section className="min-h-screen bg-[#f5f3ee] py-12 px-6 md:px-16">
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm border border-[#d8c6aa] shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-[#7a8358] mb-6">Citas recibidas</h1>
        {loading ? (
          <p className="text-gray-500">Cargando...</p>
        ) : (
          <div className="overflow-x-auto">
            {citas.length === 0 ? (
              <p className="text-gray-500">No tienes citas pendientes.</p>
            ) : (
              <table className="min-w-full border border-[#d8c6aa] rounded-lg overflow-hidden">
                <thead className="bg-[#7a8358] text-white text-left">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Servicio</th>
                    <th className="px-4 py-3">Usuario</th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Hora</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white text-[#4e5932]">
                  {citas.map((c) => (
                    <tr key={c.id_cita} className="border-t border-[#e0d8c6] hover:bg-[#f7f4ef]">
                      <td className="px-4 py-3">{c.id_cita}</td>
                      <td className="px-4 py-3">{c.tipo_servicio || c.id_servicio}</td>
                      <td className="px-4 py-3">{c.id_usuario}</td>
                      <td className="px-4 py-3">{c.fecha_cita}</td>
                      <td className="px-4 py-3">{c.hora_cita}</td>
                      <td className="px-4 py-3">{c.estado_cita}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          {c.estado_cita === 'pendiente' && (
                            <>
                              <button onClick={() => handleAction(c.id_cita, 'confirm')} className="px-3 py-1 bg-green-500 text-white rounded">Confirmar</button>
                              <button onClick={() => handleAction(c.id_cita, 'cancel')} className="px-3 py-1 bg-red-500 text-white rounded">Cancelar</button>
                            </>
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
      </div>
    </section>
  );
}
