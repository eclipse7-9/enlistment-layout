import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import Swal from "sweetalert2";
import ReceiptToast from "./ReceiptToast";

const AppointmentModal = ({ servicio, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: "",
    mascota: "",
    servicio: "",
    fecha: "",
    hora: "",
  });
  const [showToast, setShowToast] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [misMascotas, setMisMascotas] = useState([]);
  const [dateMin, setDateMin] = useState("");
  const [dateMax, setDateMax] = useState("");
  const [timeError, setTimeError] = useState("");
  const [servicios, setServicios] = useState([]);
  const { user } = useAuth();
  const { showAlert } = useAlert();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePayment = () => {
    // Enviar la petición para crear la cita y mostrar recibo
    createCita();
  };

  useEffect(() => {
    // traer mascotas y servicios del usuario
    const fetchData = async () => {
      if (!user) return;
      try {
        const headers = { Authorization: `Bearer ${user.token}` };
        const [mascRes, servRes] = await Promise.all([
          axios.get("http://localhost:8000/mascotas/mis-mascotas", { headers }),
          axios.get("http://localhost:8000/servicios/", { headers }),
        ]);
        setMisMascotas(Array.isArray(mascRes.data) ? mascRes.data : []);
        setServicios(Array.isArray(servRes.data) ? servRes.data : []);
        // obtener métodos de pago del usuario para elegir
        try {
          const metRes = await axios.get("http://localhost:8000/metodo_pago/", { headers });
          setPaymentMethods(Array.isArray(metRes.data) ? metRes.data : []);
        } catch (err) {
          console.warn('No se pudieron cargar métodos de pago:', err?.response?.data || err.message);
          setPaymentMethods([]);
        }
      } catch (err) {
        console.error("Error cargando mascotas/servicios:", err);
      }
    };
    fetchData();
    // calcular min/max de fecha (hoy -> hoy + 1 año)
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const min = `${yyyy}-${mm}-${dd}`;
    const nextYear = new Date(today);
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const yy = nextYear.getFullYear();
    const mm2 = String(nextYear.getMonth() + 1).padStart(2, '0');
    const dd2 = String(nextYear.getDate()).padStart(2, '0');
    const max = `${yy}-${mm2}-${dd2}`;
    setDateMin(min);
    setDateMax(max);
  }, [user]);

  const createCita = async () => {
  if (!user) { await Swal.fire('Inicia sesión', 'Debes iniciar sesión', 'warning'); return; }
    if (!formData.mascota) { showAlert({ type: 'warning', message: 'Selecciona una mascota' }); return; }
    if (!formData.fecha || !formData.hora) { showAlert({ type: 'warning', message: 'Selecciona fecha y hora' }); return; }
    // Validaciones adicionales: fecha dentro de rango y hora no madrugada
    if (dateMin && formData.fecha < dateMin) { showAlert({ type: 'warning', message: 'La fecha no puede ser anterior a hoy.' }); return; }
    if (dateMax && formData.fecha > dateMax) { showAlert({ type: 'warning', message: 'La fecha no puede ser mayor a un año desde hoy.' }); return; }
    if (formData.hora) {
      const [hh] = formData.hora.split(':').map(Number);
      if (hh < 6) { showAlert({ type: 'warning', message: 'No se pueden reservar horas en la madrugada.' }); return; }
    }
    if (!paymentMethod) { showAlert({ type: 'warning', message: 'Selecciona método de pago' }); return; }
    if (!formData.servicio && !servicio) { showAlert({ type: 'warning', message: 'Selecciona un servicio' }); return; }

    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      const payload = {
        fecha_cita: formData.fecha,
        hora_cita: formData.hora,
        id_metodo_pago: Number(paymentMethod),
        id_mascota: Number(formData.mascota),
        id_servicio: Number(formData.servicio || servicio)
      };
      const res = await axios.post("http://localhost:8000/citas", payload, { headers });
      console.log('Cita creada:', res.data);
      // mostrar notificación
      setShowToast(true);
      setStep(3);
    } catch (err) {
      console.error('Error creando cita:', err.response?.data || err);
      showAlert({ type: 'error', message: 'No se pudo crear la cita: ' + (err.response?.data?.detail || err.message) });
    }
  };

  return (
    <div 
        className="fixed inset-0 flex justify-center items-center z-50 animate-fadeIn"
        style={{
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          backgroundColor: 'transparent',
        }}
      >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 border-t-8 border-[#7A8358] transform transition-all duration-500 
        animate-modal-entry hover:scale-[1.02]"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}>
        {/* HEADER */}
        <div className="text-center py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-[#556140] tracking-wide">
            {step === 1 && "AGENDA TU CITA"}
            {step === 2 && "SELECCIONA MÉTODO DE PAGO"}
            {step === 3 && "RECIBO DE CITA"}
          </h2>
        </div>

        {/* FORMULARIO DE CITA */}
        {step === 1 && (
          <form
            className="flex flex-col gap-3 px-6 py-6 text-[#333]"
            onSubmit={handleConfirm}
          >
            <label className="font-medium">Nombre del propietario:<span className="text-red-500"> *</span></label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7A8358]/60"
            />

            <label className="font-medium">Selecciona mascota:<span className="text-red-500"> *</span></label>
            <select
              name="mascota"
              value={formData.mascota}
              onChange={handleChange}
              required
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7A8358]/60"
            >
              <option value="">-- Selecciona --</option>
              {misMascotas.map((m) => (
                <option key={m.id_mascota} value={m.id_mascota}>{m.nombre_mascota} (edad: {m.edad_mascota})</option>
              ))}
            </select>

            {/* Mostrar información de la mascota seleccionada */}
            {formData.mascota && (
              <div className="mt-2 p-3 bg-[#f7f7f5] border rounded text-sm">
                {(() => {
                  const pet = misMascotas.find(x => String(x.id_mascota) === String(formData.mascota));
                  if (!pet) return <div>Información de la mascota no disponible.</div>;
                  return (
                    <div className="grid grid-cols-2 gap-2">
                      <div><strong>Nombre:</strong> {pet.nombre_mascota}</div>
                      <div><strong>Especie:</strong> {pet.especie_mascota}</div>
                      <div><strong>Edad:</strong> {pet.edad_mascota} años</div>
                      <div><strong>Peso:</strong> {pet.peso_mascota} kg</div>
                      <div><strong>Altura:</strong> {pet.altura_mascota} cm</div>
                      <div><strong>Raza:</strong> {pet.raza_mascota}</div>
                    </div>
                  );
                })()}
              </div>
            )}

            <label className="font-medium">Servicio:<span className="text-red-500"> *</span></label>
            <select
              name="servicio"
              value={formData.servicio || servicio || ""}
              onChange={handleChange}
              required
              className="border rounded-lg px-3 py-2 bg-white text-gray-700"
            >
              <option value="">-- Selecciona servicio --</option>
              {servicios.map((s) => (
                <option key={s.id_servicio} value={s.id_servicio}>{s.tipo_servicio}</option>
              ))}
            </select>

            <label className="font-medium">Fecha:<span className="text-red-500"> *</span></label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              required
              min={dateMin}
              max={dateMax}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7A8358]/60"
            />

            <label className="font-medium">Hora:<span className="text-red-500"> *</span></label>
            <input
              type="time"
              name="hora"
              value={formData.hora}
              onChange={(e) => {
                handleChange(e);
                // validar que no sea madrugada (antes de 06:00)
                const t = e.target.value;
                if (t) {
                  const [hh] = t.split(':').map(Number);
                  if (hh < 6) {
                    setTimeError('No se pueden reservar horas en la madrugada (antes de 06:00).');
                  } else {
                    setTimeError('');
                  }
                } else {
                  setTimeError('');
                }
              }}
              required
              min="06:00"
              max="22:00"
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7A8358]/60"
            />
            {timeError && <p className="text-xs text-red-600 mt-1">{timeError}</p>}

            <div className="flex justify-between mt-4">
              <button
                type="submit"
                className="bg-[#556140] hover:bg-[#6b7450] text-white font-semibold px-4 py-2 rounded-lg shadow-sm transform transition-all duration-300 ease-in-out hover:scale-110 hover:rotate-2 hover:shadow-xl active:scale-95 active:rotate-0 motion-safe:hover:-translate-y-1"
              >
                Confirmar Cita
              </button>
              <button
                type="button"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg transition-all duration-300"
                onClick={onClose}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* MÉTODO DE PAGO */}
        {step === 2 && (
          <div className="flex flex-col gap-4 px-6 py-6">
            <label className="font-medium">Selecciona método de pago:</label>
            <select
              name="payment"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7A8358]/60"
            >
              <option value="">-- Selecciona --</option>
              {paymentMethods.map((m) => (
                <option key={m.id_metodo_pago} value={m.id_metodo_pago}>
                  {m.tipo_metodo} {m.titular ? `— ${m.titular}` : ''}
                </option>
              ))}
            </select>

            <div className="flex justify-between mt-6">
              <button
                className="bg-[#556140] hover:bg-[#6b7450] text-white font-semibold px-4 py-2 rounded-lg shadow-sm transform transition-all duration-300 ease-in-out hover:scale-110 hover:rotate-2 hover:shadow-xl active:scale-95 active:rotate-0 motion-safe:hover:-translate-y-1"
                onClick={handlePayment}
                disabled={!paymentMethod}
              >
                Pagar
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg transition-all duration-300"
                onClick={() => setStep(1)}
              >
                Volver
              </button>
            </div>
          </div>
        )}

        {/* RECIBO DE CITA */}
        {step === 3 && (
          <div className="px-6 py-6 text-[#333]">
            <p><b>Propietario:</b> {formData.nombre}</p>
            <p><b>Mascota:</b> {formData.mascota}</p>
            <p><b>Servicio:</b> {servicio}</p>
            <p><b>Fecha:</b> {formData.fecha}</p>
            <p><b>Hora:</b> {formData.hora}</p>
            <p><b>Método de pago:</b> {paymentMethods.find(p => String(p.id_metodo_pago) === String(paymentMethod))?.tipo_metodo || paymentMethod}</p>

            <div className="flex justify-center mt-6">
              <button
                className="bg-[#556140] hover:bg-[#6b7450] text-white font-semibold px-6 py-2 rounded-lg shadow-sm transform transition-all duration-300 ease-in-out hover:scale-110 hover:rotate-2 hover:shadow-xl active:scale-95 active:rotate-0 motion-safe:hover:-translate-y-1"
                onClick={onClose}
              >
                Finalizar
              </button>
            </div>
          </div>
        )}

        {/* FOOTER DECORATIVO */}
        <div className="h-2 bg-[#7A8358] rounded-b-2xl"></div>
      </div>

      {/* Notificación de cita agendada */}
      {showToast && (
        <ReceiptToast
          recibo={{
            id: "Cita",
            monto: 0,
            fecha_creacion: new Date().toISOString(),
            descripcion: `Cita agendada con éxito para el ${formData.fecha} a las ${formData.hora}`
          }}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default AppointmentModal;