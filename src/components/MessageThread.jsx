import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function MessageThread({ citaId, onClose, readOnlyFromNotification = false }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [blocked, setBlocked] = useState(false);
  const [serviceOwner, setServiceOwner] = useState(null);
  const [ownerSent, setOwnerSent] = useState(false);

  useEffect(() => {
    if (citaId) fetchThread();
  }, [citaId]);

  const fetchThread = async () => {
    setLoading(true);
    try {
      const [mRes, bRes] = await Promise.all([
        axios.get(`http://localhost:8000/citas/${citaId}/messages`, { headers: { Authorization: `Bearer ${user?.token}` } }),
        axios.get(`http://localhost:8000/citas/${citaId}/blocked`, { headers: { Authorization: `Bearer ${user?.token}` } }),
      ]);
      const msgData = mRes.data || {};
      const msgs = Array.isArray(msgData.messages) ? msgData.messages : [];
      setMessages(msgs);
      setServiceOwner(msgData.servicio_owner || null);
      setOwnerSent(!!msgs.find((m) => m.id_emisor === msgData.servicio_owner));
      setBlocked(Boolean(bRes.data?.blocked));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    if (!text.trim()) return;
    try {
      await axios.post(`http://localhost:8000/citas/${citaId}/messages`, { mensaje: text }, { headers: { Authorization: `Bearer ${user?.token}` } });
      setText('');
      fetchThread();
    } catch (err) {
      const detail = err?.response?.data?.detail || 'Error al enviar';
      alert(detail);
    }
  };

  const report = async () => {
    const motivo = prompt('Motivo de la denuncia:');
    if (!motivo) return;
    try {
      await axios.post(`http://localhost:8000/citas/${citaId}/report`, { motivo }, { headers: { Authorization: `Bearer ${user?.token}` } });
      alert('Denuncia enviada. Los administradores han sido notificados.');
      setBlocked(true);
    } catch (err) {
      const detail = err?.response?.data?.detail || 'Error al denunciar';
      alert(detail);
    }
  };

  const isOwner = user.id_usuario === serviceOwner;
  const readOnly = Boolean(readOnlyFromNotification);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className={`bg-white w-full ${isOwner ? 'max-w-3xl h-4/5' : 'max-w-md h-72'} rounded-md shadow-lg flex flex-col mx-2 md:mx-0 ${window.innerWidth < 640 ? 'max-w-full h-[80vh]' : ''}`}>
        <div className="p-4 border-b flex justify-between items-center">
          <div className="font-semibold">Mensajes de la cita #{citaId}</div>
          <div className="flex items-center gap-2">
            {!blocked && (
              <button onClick={report} className="px-3 py-1 text-sm bg-red-500 text-white rounded">Denunciar</button>
            )}
            <button onClick={onClose} className="px-3 py-1 text-sm bg-gray-200 rounded">Cerrar</button>
          </div>
        </div>

          <div className="p-4 flex-1 overflow-auto bg-[#f7f7f7]">
          {loading ? (
            <div>Cargando...</div>
          ) : messages.length === 0 ? (
            <div className="text-gray-500">No hay mensajes todavía.</div>
          ) : (
            messages.map((m) => (
              <div key={m.id_mensaje} className={`mb-3 flex ${m.id_emisor === user.id_usuario ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg p-3 max-w-[70%] ${m.id_emisor === user.id_usuario ? 'bg-[#7a8358] text-white' : 'bg-white text-gray-800'}`}>
                  <div className="text-sm">{m.mensaje}</div>
                  <div className="text-xs text-gray-400 mt-1">{m.fecha_creacion}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {!readOnly && (
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input disabled={blocked || !isOwner || ownerSent} value={text} onChange={(e) => setText(e.target.value)} placeholder={blocked ? 'No puedes enviar mensajes a este usuario' : (!isOwner ? 'Solo el emprendedor puede enviar mensajes' : (ownerSent ? 'Ya enviaste un mensaje para esta cita' : 'Escribe un mensaje...'))} className="flex-1 px-3 py-2 border rounded" />
              <button onClick={send} disabled={blocked || !isOwner || ownerSent} className="px-4 py-2 bg-[#7a8358] text-white rounded">Enviar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
