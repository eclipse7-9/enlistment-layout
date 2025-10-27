import React, { useState } from "react";

const AppointmentModal = ({ servicio, onClose }) => {
  const [step, setStep] = useState(1); // 1=Formulario, 2=Pago, 3=Recibo
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
    setStep(2); // ir al paso de pago
  };

  const handlePayment = () => {
    setStep(3); // ir al recibo
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-box">
        <div className="modal-border-top"></div>

        {step === 1 && (
          <>
            <h2 className="modal-title">AGENDA TU CITA</h2>
            <form className="appointment-form-box" onSubmit={handleConfirm}>
              <label>Nombre del propietario:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />

              <label>Nombre del animal / mascota:</label>
              <input
                type="text"
                name="mascota"
                value={formData.mascota}
                onChange={handleChange}
                required
              />

              <label>Servicio:</label>
              <input type="text" value={servicio} readOnly />

              <label>Fecha:</label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                required
              />

              <label>Hora:</label>
              <input
                type="time"
                name="hora"
                value={formData.hora}
                onChange={handleChange}
                required
              />

              <div className="form-buttons">
                <button type="submit" className="btn btn-med">
                  Confirmar Cita
                </button>
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={onClose}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="modal-title">SELECCIONA MÉTODO DE PAGO</h2>
            <div className="appointment-form-box">
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="Tarjeta"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Tarjeta de crédito/débito
              </label>
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="Efectivo"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Efectivo
              </label>
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="PSE"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                PSE
              </label>

              <div className="form-buttons">
                <button
                  className="btn btn-med"
                  onClick={handlePayment}
                  disabled={!paymentMethod}
                >
                  Pagar
                </button>
                <button
                  className="btn btn-cancel"
                  onClick={() => setStep(1)}
                >
                  Volver
                </button>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="modal-title">RECIBO DE CITA</h2>
            <div className="appointment-form-box">
              <p>
                <b>Propietario:</b> {formData.nombre}
              </p>
              <p>
                <b>Mascota:</b> {formData.mascota}
              </p>
              <p>
                <b>Servicio:</b> {servicio}
              </p>
              <p>
                <b>Fecha:</b> {formData.fecha}
              </p>
              <p>
                <b>Hora:</b> {formData.hora}
              </p>
              <p>
                <b>Método de pago:</b> {paymentMethod}
              </p>

              <div className="form-buttons">
                <button className="btn btn-med" onClick={onClose}>
                  Finalizar
                </button>
              </div>
            </div>
          </>
        )}

        <div className="modal-border-bottom"></div>
      </div>
    </div>
  );
};

export default AppointmentModal;
