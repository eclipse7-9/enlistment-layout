import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ServiciosMedicos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    tipo_servicio: "",
    estado_servicio: "Activo",
    descripcion_servicio: "",
    precio_servicio: "",
    imagen_servicio: null,
  });

  // Redirigir si no es emprendedor
  if (!user || user.id_rol !== 2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f3ee]">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-[#7a8358] mb-4">Acceso Restringido</h2>
          <p className="text-gray-600 mb-4">Esta página es solo para emprendedores.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#7a8358] text-white px-6 py-2 rounded-lg hover:bg-[#5f6943] transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("tipo_servicio", formData.tipo_servicio);
  formDataToSend.append("descripcion_servicio", formData.descripcion_servicio);
  formDataToSend.append("precio_servicio", formData.precio_servicio);
      formDataToSend.append("estado_servicio", formData.estado_servicio);
      formDataToSend.append("id_usuario", user.id_usuario);
      
      if (formData.imagen_servicio) {
        formDataToSend.append("imagen_servicio", formData.imagen_servicio);
      }

      await axios.post(
        "http://localhost:8000/servicios/",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          },
        }
      );

      await Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Servicio creado correctamente",
        confirmButtonColor: "#7a8358",
      });

      setFormData({
        tipo_servicio: "",
        descripcion_servicio: "",
        estado_servicio: "Activo",
        precio_servicio: "",
        imagen_servicio: null,
      });

      navigate("/mis-servicios");
    } catch (error) {
      console.error("Error al crear el servicio:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.detail || "Error al crear el servicio",
        confirmButtonColor: "#7a8358",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagen_servicio") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <section className="min-h-screen bg-[#f5f3ee] py-12 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="bg-white/90 backdrop-blur-sm border border-[#d8c6aa] shadow-lg rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-[#7a8358] mb-8 text-center">
            Crear Nuevo Servicio Médico
          </h1>

          {/* Formulario de creación */}
          <div className="border border-[#d8c6aa] p-6 rounded-lg bg-white">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Tipo de servicio:<span className="text-red-500"> *</span></label>
                  <input
                    type="text"
                    name="tipo_servicio"
                    value={formData.tipo_servicio}
                    onChange={handleChange}
                    required
                    placeholder="Tipo de servicio"
                    className="p-3 border border-[#d8c6aa] rounded-lg focus:ring-2 focus:ring-[#7a8358] focus:border-transparent w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Precio (COP):<span className="text-red-500"> *</span></label>
                  <input
                    type="number"
                    name="precio_servicio"
                    value={formData.precio_servicio}
                    onChange={handleChange}
                    required
                    step="0.01"
                    min="0"
                    placeholder="ej: 50000.00"
                    className="p-3 border border-[#d8c6aa] rounded-lg focus:ring-2 focus:ring-[#7a8358] focus:border-transparent w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Estado:<span className="text-red-500"> *</span></label>
                  <select
                    name="estado_servicio"
                    value={formData.estado_servicio}
                    onChange={handleChange}
                    required
                    className="p-3 border border-[#d8c6aa] rounded-lg focus:ring-2 focus:ring-[#7a8358] focus:border-transparent w-full"
                  >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
                </div>
              </div>

              <textarea
                name="descripcion_servicio"
                value={formData.descripcion_servicio}
                onChange={handleChange}
                required
                placeholder="Descripción del servicio..."
                rows="3"
                className="w-full p-3 border border-[#d8c6aa] rounded-lg focus:ring-2 focus:ring-[#7a8358] focus:border-transparent"
              />

              <div>
                <input
                  type="file"
                  name="imagen_servicio"
                  onChange={handleChange}
                  accept="image/*"
                  className="w-full text-sm text-[#4e5932]
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#7a8358] file:text-white
                    hover:file:bg-[#5c6142]
                    cursor-pointer"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Selecciona una imagen para el servicio (opcional)
                </p>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/mis-servicios")}
                  className="px-6 py-2 border border-[#7a8358] text-[#7a8358] rounded-lg hover:bg-[#f5f3ee] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#7a8358] text-white rounded-lg hover:bg-[#5c6142] transition-colors"
                >
                  Crear Servicio
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

