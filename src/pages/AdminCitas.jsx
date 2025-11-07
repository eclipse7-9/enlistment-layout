import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function AdminCitas() {
  const { user } = useAuth();
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchCitas(); }, []);

  const fetchCitas = async () => {
    setLoading(true);
    try {
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
      const res = await axios.get("http://localhost:8000/citas/", { headers });
      setCitas(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  const handleChangeEstado = async (id, nuevoEstado) => {
    try {
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
      await axios.put(`http://localhost:8000/citas/${id}`, { estado_cita: nuevoEstado }, { headers });
      fetchCitas();
      alert('Estado de cita actualizado');
    } catch (err) {
      console.error(err);
      alert('Error actualizando estado');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Eliminar cita?')) return;
    try {
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
      await axios.delete(`http://localhost:8000/citas/${id}`, { headers });
      fetchCitas();
      alert('Cita eliminada');
    } catch (err) {
      console.error(err);
      alert('Error eliminando cita');
    }
  };

  return (
    <section className="min-h-screen bg-[#f5f3ee] py-12 px-6 md:px-16">
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm border border-[#d8c6aa] shadow-lg rounded-2xl p-8">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-3xl font-bold text-[#7a8358] mb-6 text-center">Gestión de Citas</motion.h1>

        {loading ? <p>Cargando citas...</p> : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-[#d8c6aa] rounded-lg overflow-hidden">
              <thead className="bg-[#7a8358] text-white text-left">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Usuario</th>
                  <th className="px-4 py-3">Mascota</th>
                  <th className="px-4 py-3">Servicio</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Hora</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white text-[#4e5932]">
                {citas.map(c => (
                  <tr key={c.id_cita} className="border-t border-[#e0d8c6] hover:bg-[#f7f4ef]">
                    <td className="px-4 py-3">{c.id_cita}</td>
                    <td className="px-4 py-3">{c.id_usuario}</td>
                    <td className="px-4 py-3">{c.id_mascota}</td>
                    <td className="px-4 py-3">{c.id_servicio}</td>
                    <td className="px-4 py-3">{c.fecha_cita}</td>
                    <td className="px-4 py-3">{c.hora_cita}</td>
                    <td className="px-4 py-3">{c.estado_cita}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={()=>handleChangeEstado(c.id_cita, 'confirmada')} className="px-3 py-1 bg-green-500 text-white rounded">Confirmar</button>
                        <button onClick={()=>handleChangeEstado(c.id_cita, 'cancelada')} className="px-3 py-1 bg-red-500 text-white rounded">Cancelar</button>
                        <button onClick={()=>handleDelete(c.id_cita)} className="px-3 py-1 bg-gray-400 text-white rounded">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
