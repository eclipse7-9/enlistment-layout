import React, { useState } from "react";

const AppointmentModal = ({ servicio, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: "",
    mascota: "",
    fecha: "",
    hora: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePayment = () => {
    setStep(3);
  };

  return (
    <div 
        className="fixed inset-0 flex justify-center items-center z-50 animate-fadeIn"
        style={{
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
            <label className="font-medium">Nombre del propietario:</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7A8358]/60"
            />

            <label className="font-medium">Nombre del animal / mascota:</label>
            <input
              type="text"
              name="mascota"
              value={formData.mascota}
              onChange={handleChange}
              required
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7A8358]/60"
            />

            <label className="font-medium">Servicio:</label>
            <input
              type="text"
              value={servicio}
              readOnly
              className="border rounded-lg px-3 py-2 bg-gray-100 text-gray-700"
            />

            <label className="font-medium">Fecha:</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              required
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7A8358]/60"
            />

            <label className="font-medium">Hora:</label>
            <input
              type="time"
              name="hora"
              value={formData.hora}
              onChange={handleChange}
              required
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7A8358]/60"
            />

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
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="Tarjeta"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Tarjeta de crédito/débito
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="Efectivo"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Efectivo
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="PSE"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              PSE
            </label>

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
            <p><b>Método de pago:</b> {paymentMethod}</p>

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
    </div>
  );
};

export default AppointmentModal;