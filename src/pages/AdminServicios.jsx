import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function AdminServicios() {
  const { user } = useAuth();
  const [servicios, setServicios] = useState([]);
  const [form, setForm] = useState({ tipo_servicio: "", estado_servicio: "Activo", descripcion_servicio: "", imagen_servicio: "" });

  useEffect(() => { fetchServicios(); }, []);

  const fetchServicios = async () => {
    try {
      const res = await axios.get("http://localhost:8000/servicios/");
      setServicios(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error(err); }
  };

  const handleCreate = async () => {
    try {
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
      const payload = { tipo_servicio: form.tipo_servicio, estado_servicio: form.estado_servicio, descripcion_servicio: form.descripcion_servicio, id_usuario: user?.id_usuario || 1, imagen_servicio: form.imagen_servicio || '' };
      await axios.post("http://localhost:8000/servicios/", payload, { headers });
      setForm({ tipo_servicio: "", estado_servicio: "Activo", descripcion_servicio: "", imagen_servicio: "" });
      fetchServicios();
      alert('Servicio creado');
    } catch (err) { console.error(err); alert('Error creando servicio'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Eliminar servicio?')) return;
    try {
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
      await axios.delete(`http://localhost:8000/servicios/${id}`, { headers });
      fetchServicios();
      alert('Servicio eliminado');
    } catch (err) { console.error(err); alert('Error eliminando servicio'); }
  };

  return (
    <section className="min-h-screen bg-[#f5f3ee] py-12 px-6 md:px-16">
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm border border-[#d8c6aa] shadow-lg rounded-2xl p-8">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-3xl font-bold text-[#7a8358] mb-6 text-center">Gestión de Servicios</motion.h1>

        <div className="mb-6 border p-4 rounded-lg bg-gray-50">
          <h3 className="font-semibold mb-2">Crear servicio</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="p-2 border" placeholder="Tipo de servicio" value={form.tipo_servicio} onChange={(e)=>setForm({...form,tipo_servicio:e.target.value})} />
            <select className="p-2 border" value={form.estado_servicio} onChange={(e)=>setForm({...form,estado_servicio:e.target.value})}>
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
            <input className="p-2 border col-span-2" placeholder="Descripción" value={form.descripcion_servicio} onChange={(e)=>setForm({...form,descripcion_servicio:e.target.value})} />
            <input className="p-2 border" placeholder="Imagen URL" value={form.imagen_servicio} onChange={(e)=>setForm({...form,imagen_servicio:e.target.value})} />
          </div>
          <div className="mt-3">
            <button onClick={handleCreate} className="px-4 py-2 bg-[#7a8358] text-white rounded">Crear servicio</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-[#d8c6aa] rounded-lg overflow-hidden">
            <thead className="bg-[#7a8358] text-white text-left">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Descripción</th>
                <th className="px-4 py-3">Propietario</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white text-[#4e5932]">
              {servicios.map(s => (
                <tr key={s.id_servicio} className="border-t border-[#e0d8c6] hover:bg-[#f7f4ef]">
                  <td className="px-4 py-3">{s.id_servicio}</td>
                  <td className="px-4 py-3">{s.tipo_servicio}</td>
                  <td className="px-4 py-3">{s.estado_servicio}</td>
                  <td className="px-4 py-3">{s.descripcion_servicio}</td>
                  <td className="px-4 py-3">{s.id_usuario}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={()=>handleDelete(s.id_servicio)} className="px-3 py-1 bg-red-500 text-white rounded">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
