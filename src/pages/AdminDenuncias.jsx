import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminDenuncias() {
  const [denuncias, setDenuncias] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDenuncias();
  }, []);

  const fetchDenuncias = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/denuncias/');
      setDenuncias(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching denuncias', err);
      if (err?.response?.status === 401) {
        alert('Sesión expirada. Por favor inicia sesión nuevamente.');
        navigate('/login');
      } else if (err?.response?.status === 403) {
        alert('No tienes permiso para ver esta página.');
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const resolveDenuncia = async (id) => {
    // Offer actions: invalidate denuncia or inactivate user
    const action = prompt('Acción a realizar (invalidar/inactivar): escribe "invalidar" o "inactivar"');
    if (!action) return;
    const mensaje = prompt('Mensaje de notificación que se enviará a las partes (opcional):');
    try {
      if (action === 'invalidar') {
        await axios.put(`http://localhost:8000/denuncias/${id}/invalidate`, { mensaje });
      } else if (action === 'inactivar') {
        await axios.put(`http://localhost:8000/denuncias/${id}/inactivate_user`, { mensaje });
      } else {
        alert('Acción no reconocida');
        return;
      }
      fetchDenuncias();
    } catch (err) {
      console.error(err);
      alert('Error al realizar la acción');
    }
  };

  const viewMensaje = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8000/denuncias/${id}/mensaje`);
      const data = res.data;
      if (data.mensaje) {
        alert(`Mensaje del emprendedor:\n\n${data.mensaje}`);
      } else {
        alert(data.msg || 'No hay mensaje relacionado');
      }
    } catch (err) {
      console.error(err);
      alert('Error al obtener el mensaje');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#f5f3ee] to-[#efe7d7]">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-4">
        <h1 className="text-2xl font-bold text-[#7a8358] mb-4">Denuncias</h1>
        {loading ? (
          <div>Cargando...</div>
        ) : (
          <div className="overflow-auto">
            {denuncias.length === 0 ? (
              <div className="text-gray-600">No hay denuncias</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="p-2">ID</th>
                    <th className="p-2">Cita</th>
                    <th className="p-2">Reportador</th>
                    <th className="p-2">Objetivo</th>
                    <th className="p-2">Motivo</th>
                    <th className="p-2">Descripción</th>
                    <th className="p-2">Fecha</th>
                    <th className="p-2">Resuelta</th>
                    <th className="p-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {denuncias.map((d) => (
                    <tr key={d.id_denuncia} className="border-b">
                      <td className="p-2">{d.id_denuncia}</td>
                      <td className="p-2">{d.id_cita || '-'}</td>
                      <td className="p-2">{d.reportador_email || d.id_reportador}</td>
                      <td className="p-2">{d.objetivo_email || d.id_objetivo || '-'}</td>
                      <td className="p-2">{d.motivo}</td>
                      <td className="p-2">{d.descripcion || 'indicada por el cliente'}</td>
                      <td className="p-2">{d.fecha_creacion}</td>
                      <td className="p-2">{d.resuelta ? 'Sí' : 'No'}</td>
                      <td className="p-2 flex gap-2">
                        <button onClick={() => viewMensaje(d.id_denuncia)} className="px-3 py-1 bg-blue-600 text-white rounded">Ver mensaje</button>
                        {!d.resuelta && (
                          <button onClick={() => resolveDenuncia(d.id_denuncia)} className="px-3 py-1 bg-[#7a8358] text-white rounded">Tomar medida</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
