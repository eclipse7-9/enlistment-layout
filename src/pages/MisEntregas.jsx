import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function MisEntregas() {
  const { user } = useAuth();
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEntregas = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8000/domicilios/");
        const all = Array.isArray(res.data) ? res.data : [];
        const entregados = all.filter(d => d.estado_domicilio === 'Entregado');
        setEntregas(entregados);
      } catch (err) {
        console.error('Error fetching entregas', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEntregas();
  }, [user]);

  return (
    <section className="min-h-screen bg-[#f5f3ee] py-12 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-white/90 backdrop-blur-sm border border-[#d8c6aa] shadow-lg rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-[#7a8358] mb-6 text-center">Mis Entregas</h1>

          {loading ? (
            <p className="text-gray-500">Cargando entregas...</p>
          ) : (
            <div className="overflow-x-auto">
              {entregas.length === 0 ? (
                <p className="text-gray-500">No tienes entregas registradas.</p>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {entregas.map(e => (
                    <div key={e.id_domicilio || e.id} className="p-4 border rounded-lg bg-white">
                      <div className="flex justify-between">
                        <div>
                          <div className="text-sm text-gray-500">ID</div>
                          <div className="font-medium">{e.id_domicilio || e.id}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Estado</div>
                          <div className="font-medium text-green-700">{e.estado_domicilio}</div>
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-gray-700">
                        <div><strong>Dirección:</strong> {e.direccion_completa || '-'}</div>
                        <div className="mt-2"><strong>Productos:</strong></div>
                        <ul className="list-disc list-inside ml-4 mt-1">
                          {(e.pedidos || []).flatMap(p => p.productos || []).map((prod, i) => (
                            <li key={i}>{prod.nombre_producto || prod.nombre || prod}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
