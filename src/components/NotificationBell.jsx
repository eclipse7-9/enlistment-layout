import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiBell } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import MessageThread from "./MessageThread";

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const [threadCita, setThreadCita] = useState(null);
  const [openThread, setOpenThread] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // only attempt fetch if we have a user token
    if (user?.token) fetchNotifs();
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [user]);

  const fetchNotifs = async () => {
    if (!user?.token) return;
    try {
      const res = await axios.get("http://localhost:8000/notificaciones/", { headers: { Authorization: `Bearer ${user.token}` } });
      setNotifs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      // If unauthorized, do not spam console with errors; handle silently or show minimal debug.
      if (err?.response?.status === 401) {
        console.debug('Notificaciones: token inválido o expirado (401)');
        setNotifs([]);
        return;
      }
      console.error("Error fetching notifications", err);
    }
  };

  // NOTE: 'Marcar como leída' feature removed per product request.
  // Notifications are shown as information only and are not marked read from this UI.

  const unreadCount = notifs.filter((n) => !n.leida).length;

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((v) => !v)} className="relative p-2 rounded-full hover:bg-white/10">
        <FiBell className="w-6 h-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">{unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b text-sm font-semibold">Notificaciones</div>
          <div className="max-h-64 overflow-auto">
            {notifs.length === 0 ? (
              <div className="p-3 text-sm text-gray-500">No hay notificaciones</div>
            ) : (
              notifs.map((n) => (
                <div key={n.id_notificacion} className={`p-3 border-b ${n.leida ? "bg-white" : "bg-gray-50"}`}>
                  <div className="flex justify-between items-start">
                    <div className="text-sm font-medium">{n.titulo}</div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{n.mensaje}</div>
                  {n.url && (
                    <button
                      onClick={() => {
                        // If notification is about a new reservation, take emprendedor to citas-recibidas
                        const titulo = (n.titulo || '').toLowerCase();
                        if (titulo.includes('nueva cita') || titulo.includes('cita pendiente') || titulo.includes('nueva cita pendiente')) {
                          navigate('/citas-recibidas');
                          setOpen(false);
                          return;
                        }
                        // Open message thread without changing notification state
                        setThreadCita(n.id_cita);
                        setOpenThread(true);
                      }}
                      className="text-xs text-blue-600 hover:underline mt-2 block"
                    >Ver</button>
                  )}
                </div>
              ))
            )}
          </div>
          <div className="p-2 text-center">
            <button onClick={fetchNotifs} className="text-sm text-[#7a8358]">Actualizar</button>
          </div>
        </div>
      )}
      {openThread && <MessageThread citaId={threadCita} onClose={() => { setOpenThread(false); fetchNotifs(); }} readOnlyFromNotification={true} />}
    </div>
  );
}
