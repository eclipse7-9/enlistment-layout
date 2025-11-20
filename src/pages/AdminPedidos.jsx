import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function AdminPedidos() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
      const res = await axios.get("http://localhost:8000/pedidos/", { headers });
      setPedidos(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  const handleChangeEstado = async (id, nuevoEstado) => {
    try {
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
      await axios.put(`http://localhost:8000/pedidos/${id}`, { estado_pedido: nuevoEstado }, { headers });
      fetchPedidos();
      alert('Estado actualizado');
    } catch (err) {
      console.error(err);
      alert('Error actualizando estado');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Eliminar pedido?')) return;
    try {
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
      await axios.delete(`http://localhost:8000/pedidos/${id}`, { headers });
      fetchPedidos();
      alert('Pedido eliminado');
    } catch (err) {
      console.error(err);
      alert('Error eliminando pedido');
    }
  };

  return (
    <section className="min-h-screen bg-[#f5f3ee] py-12 px-6 md:px-16">
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm border border-[#d8c6aa] shadow-lg rounded-2xl p-8">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-3xl font-bold text-[#7a8358] mb-6 text-center">Gestión de Pedidos</motion.h1>

        {loading ? <p>Cargando pedidos...</p> : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-[#d8c6aa] rounded-lg overflow-hidden">
              <thead className="bg-[#7a8358] text-white text-left">
                <tr>
                  <th className="px-4 py-3">Usuario</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Método</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white text-[#4e5932]">
                {pedidos.map(p => (
                  <tr key={p.id_pedido} className="border-t border-[#e0d8c6] hover:bg-[#f7f4ef]">
                    <td className="px-4 py-3">{p.nombre_usuario}</td>
                    <td className="px-4 py-3">${Number(p.total).toFixed(2)}</td>
                    <td className="px-4 py-3">{p.estado_pedido}</td>
                    <td className="px-4 py-3">{p.metodo_pago}</td>
                    <td className="px-4 py-3">{p.fecha_pedido ? new Date(p.fecha_pedido).toLocaleString() : 'N/A'}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={()=>handleChangeEstado(p.id_pedido, 'en-proceso')} className="px-3 py-1 bg-yellow-400 rounded">En proceso</button>
                        <button onClick={()=>handleChangeEstado(p.id_pedido, 'pagado')} className="px-3 py-1 bg-green-500 text-white rounded">Marcar pagado</button>
                        <button onClick={()=>handleDelete(p.id_pedido)} className="px-3 py-1 bg-red-500 text-white rounded">Eliminar</button>
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
