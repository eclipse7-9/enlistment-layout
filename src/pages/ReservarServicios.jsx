import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function ReservarServicios() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [metodos, setMetodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState({ id_servicio: null, id_mascota: null, id_metodo_pago: null, fecha_cita: "", hora_cita: "" });
  const [showModal, setShowModal] = useState(false);
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchServicios();
    if (user) {
      fetchMascotas();
      fetchMetodos();
    }
  }, [user]);

  const fetchServicios = async () => {
    try {
      const res = await axios.get("http://localhost:8000/servicios/");
      setServicios(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMascotas = async () => {
    try {
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
      const res = await axios.get("http://localhost:8000/mascotas/mis-mascotas", { headers });
      setMascotas(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMetodos = async () => {
    try {
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
      const res = await axios.get("http://localhost:8000/metodo_pago/", { headers });
      setMetodos(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const startBooking = (servicio) => {
    setBooking({ ...booking, id_servicio: servicio.id_servicio });
    setShowModal(true);
    // bloquear scroll de fondo
    try { document.body.style.overflow = 'hidden'; } catch (e) {}
  };

  const closeModal = () => {
    setShowModal(false);
    setBooking({ id_servicio: null, id_mascota: null, id_metodo_pago: null, fecha_cita: '', hora_cita: '' });
    try { document.body.style.overflow = ''; } catch (e) {}
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBooking({ ...booking, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      await Swal.fire('Inicia sesión', 'Necesitas iniciar sesión para reservar', 'warning');
      navigate('/login');
      return;
    }
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${user.token}` };
      const payload = {
        fecha_cita: booking.fecha_cita,
        hora_cita: booking.hora_cita,
        id_metodo_pago: Number(booking.id_metodo_pago),
        id_mascota: Number(booking.id_mascota),
        id_servicio: Number(booking.id_servicio),
      };
      await axios.post('http://localhost:8000/citas/', payload, { headers });
      showAlert({ type: 'success', message: 'Tu cita ha sido creada. Revisa Mi Cuenta para ver el recibo.' });
      navigate('/mi-cuenta');
    } catch (err) {
      console.error(err);
      showAlert({ type: 'error', message: err.response?.data?.detail || 'No se pudo crear la cita' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#f5f3ee] py-12 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-[#7a8358] mb-6">Servicios disponibles</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {servicios.map(s => (
              <div key={s.id_servicio} className="border p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-[#4e5932]">{s.tipo_servicio}</h3>
                <p className="text-sm text-gray-600">{s.descripcion_servicio}</p>
                <div className="mt-3 flex gap-2 justify-end">
                  <button onClick={() => startBooking(s)} className="px-3 py-2 bg-[#7a8358] text-white rounded">Reservar</button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal de reserva */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm" onClick={closeModal} />

              <div className="relative z-10 w-full max-w-2xl mx-4">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Reservar servicio</h2>
                    <button onClick={closeModal} className="text-gray-500 hover:text-gray-800">✕</button>
                  </div>

                  <form onSubmit={async (e) => { await handleSubmit(e); closeModal(); }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Selecciona una mascota:<span className="text-red-500"> *</span></label>
                      <select name="id_mascota" value={booking.id_mascota || ''} onChange={handleChange} required className="p-3 border rounded w-full">
                        <option value="">Selecciona una mascota</option>
                        {mascotas.map(m => (<option key={m.id_mascota} value={m.id_mascota}>{m.nombre_mascota}</option>))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Método de pago:<span className="text-red-500"> *</span></label>
                      <select name="id_metodo_pago" value={booking.id_metodo_pago || ''} onChange={handleChange} required className="p-3 border rounded w-full">
                        <option value="">Selecciona método de pago</option>
                        {metodos.map(mp => (<option key={mp.id_metodo_pago} value={mp.id_metodo_pago}>{mp.tipo_metodo} - {mp.numero_cuenta}</option>))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Fecha:<span className="text-red-500"> *</span></label>
                      <input type="date" name="fecha_cita" value={booking.fecha_cita} onChange={handleChange} required className="p-3 border rounded w-full" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Hora:<span className="text-red-500"> *</span></label>
                      <input type="time" name="hora_cita" value={booking.hora_cita} onChange={handleChange} required className="p-3 border rounded w-full" />
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                      <button type="button" onClick={closeModal} className="px-4 py-2 border rounded">Cancelar</button>
                      <button type="submit" disabled={loading} className="px-4 py-2 bg-[#7a8358] text-white rounded">{loading ? 'Reservando...' : 'Reservar cita'}</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
