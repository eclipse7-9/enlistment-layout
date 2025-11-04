import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Ajusta la ruta según tu proyecto

const VistaVeterinarios = () => {
  const { user } = useAuth();
  const [modalidad, setModalidad] = useState("Presencial");

  // Corregir la validación del rol
  if (!user || user.id_rol !== 2) {
    return <Navigate to="/products" replace />; // Redirige a la página de inicio
  }

  return (
    <>
      <style>{`
        @keyframes bg-slide {
          0% { background-position: 0 0; }
          100% { background-position: -1200px 0; }
        }
        .bg-animate-slide {
          animation: bg-slide 60s linear infinite;
        }
      `}</style>

      <div
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-fixed bg-repeat bg-animate-slide"
        style={{
          backgroundColor: "#556140",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='100' viewBox='0 0 600 100'%3E%3Cg stroke='%23F9FAF8' stroke-width='0' stroke-miterlimit='10'%3E%3Ccircle fill='%237A8358' cx='0' cy='0' r='50'/%3E%3Ccircle fill='%23A9D7A6' cx='100' cy='0' r='50'/%3E%3Ccircle fill='%2392DEBA' cx='200' cy='0' r='50'/%3E%3Ccircle fill='%23556140' cx='300' cy='0' r='50'/%3E%3Ccircle fill='%2392DEBA' cx='400' cy='0' r='50'/%3E%3Ccircle fill='%23FFFDD8' cx='500' cy='0' r='50'/%3E%3Ccircle fill='%237A8358' cx='600' cy='0' r='50'/%3E%3Ccircle cx='-50' cy='50' r='50'/%3E%3Ccircle fill='%2393ac7c' cx='50' cy='50' r='50'/%3E%3Ccircle fill='%239edbaf' cx='150' cy='50' r='50'/%3E%3Ccircle fill='%23556140' cx='250' cy='50' r='50'/%3E%3Ccircle fill='%23779d76' cx='350' cy='50' r='50'/%3E%3Ccircle fill='%23cfedc0' cx='450' cy='50' r='50'/%3E%3Ccircle fill='%23bbbe95' cx='550' cy='50' r='50'/%3E%3Ccircle cx='650' cy='50' r='50'/%3E%3Ccircle fill='%237A8358' cx='0' cy='100' r='50'/%3E%3Ccircle fill='%23A9D7A6' cx='100' cy='100' r='50'/%3E%3Ccircle fill='%2392DEBA' cx='200' cy='100' r='50'/%3E%3Ccircle fill='%23556140' cx='300' cy='100' r='50'/%3E%3Ccircle fill='%2392DEBA' cx='400' cy='100' r='50'/%3E%3Ccircle fill='%23FFFDD8' cx='500' cy='100' r='50'/%3E%3Ccircle fill='%237A8358' cx='600' cy='100' r='50'/%3E%3Ccircle cx='50' cy='150' r='50'/%3E%3Ccircle cx='150' cy='150' r='50'/%3E%3Ccircle cx='250' cy='150' r='50'/%3E%3Ccircle cx='350' cy='150' r='50'/%3E%3Ccircle cx='450' cy='150' r='50'/%3E%3Ccircle cx='550' cy='150' r='50'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "600px 100px",
          backgroundRepeat: "repeat",
          backgroundAttachment: "fixed",
          backgroundPosition: "0 0",
        }}
      >
        <div className="relative z-10 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 max-w-3xl w-full border border-green-200">
          <h2 className="text-3xl font-semibold text-green-900 text-center mb-6">
            Servicios Médicos Veterinarios
          </h2>
          <form className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-green-900 font-semibold mb-2">
                Nombre
              </label>
              <input
                type="text"
                placeholder="Nombre completo"
                className="w-full rounded-xl border border-green-300 p-3 focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-green-900 font-semibold mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                className="w-full rounded-xl border border-green-300 p-3 focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-green-900 font-semibold mb-2">
                Tipo de servicio
              </label>
              <select className="w-full rounded-xl border border-green-300 p-3 focus:ring-2 focus:ring-green-500">
                <option>Consulta general</option>
                <option>Vacunación</option>
                <option>Urgencia</option>
                <option>Control preventivo</option>
              </select>
            </div>
            <div>
              <label className="block text-green-900 font-semibold mb-2">
                Modalidad
              </label>
              <select
                id="modalidad"
                name="modalidad"
                className="w-full rounded-xl border border-green-300 p-3 focus:ring-2 focus:ring-green-500"
                onChange={(e) => setModalidad(e.target.value)}
                value={modalidad}
              >
                <option value="Presencial">Presencial</option>
                <option value="Domiciliaria">Domiciliaria</option>
              </select>
            </div>
            <div>
              <label className="block text-green-900 font-semibold mb-2">
                Fecha
              </label>
              <input
                type="date"
                className="w-full rounded-xl border border-green-300 p-3 focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-green-900 font-semibold mb-2">
                Hora
              </label>
              <input
                type="time"
                className="w-full rounded-xl border border-green-300 p-3 focus:ring-2 focus:ring-green-500"
              />
            </div>
            {modalidad === "Presencial" && (
              <div className="col-span-2">
                <label className="block text-green-900 font-semibold mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  placeholder="Calle, carrera, número..."
                  className="w-full rounded-xl border border-green-300 p-3 focus:ring-2 focus:ring-green-500"
                />
              </div>
            )}
            <button
              type="submit"
              className="col-span-2 bg-[#7A8358] text-white font-semibold py-3 rounded-xl hover:bg-green-800 transition"
            >
              Guardar disponibilidad
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default VistaVeterinarios;
