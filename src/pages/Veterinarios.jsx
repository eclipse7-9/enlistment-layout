import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const VistaVeterinarios = () => {
  const { user } = useAuth();
  const [tipo, setTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [estado, setEstado] = useState("activo"); // por defecto
  const [mensaje, setMensaje] = useState("");

  if (!user || user.id_rol !== 2) {
    return <Navigate to="/products" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        tipo_servicio: tipo,
        descripcion_servicio: descripcion,
        precio_servicio: Number(precio) || 0,
        estado_servicio: estado,
        id_usuario: user.id,
      };

      const response = await axios.post("http://localhost:8000/servicios/", payload);
      setMensaje("Servicio creado correctamente");
      setTipo("");
      setDescripcion("");
  setPrecio("");
    } catch (error) {
      console.error("Error al crear servicio:", error);
      setMensaje("Error al crear servicio");
    }
  };

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
        <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-10 max-w-3xl w-full border border-green-200">
          <h2 className="text-3xl font-semibold text-green-900 text-center mb-6">
            Servicios Médicos Veterinarios
          </h2>

          {mensaje && <p className="mb-4 text-green-600">{mensaje}</p>}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-green-900 font-semibold mb-2">
                Tipo de servicio
              </label>
              <input
                type="text"
                placeholder="Ej: Consulta general"
                className="w-full rounded-xl border border-green-300 p-3 focus:ring-2 focus:ring-green-500"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-green-900 font-semibold mb-2">
                Precio (COP)
              </label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full rounded-xl border border-green-300 p-3 focus:ring-2 focus:ring-green-500"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                step="0.01"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-green-900 font-semibold mb-2">
                Descripción
              </label>
              <textarea
                placeholder="Detalles del servicio"
                className="w-full rounded-xl border border-green-300 p-3 focus:ring-2 focus:ring-green-500"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="bg-[#7A8358] text-white font-semibold py-3 rounded-xl hover:bg-green-800 transition"
            >
              Guardar servicio
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default VistaVeterinarios;
