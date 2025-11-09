import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function AdminCreateService() {
  const [formData, setFormData] = useState({
    nombre_servicio: "",
    descripcion_servicio: "",
    precio_servicio: "",
    duracion_servicio: "",
    imagen_servicio: null,
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nombre_servicio", formData.nombre_servicio);
      formDataToSend.append("descripcion_servicio", formData.descripcion_servicio);
      formDataToSend.append("precio_servicio", formData.precio_servicio);
      formDataToSend.append("duracion_servicio", formData.duracion_servicio);
      if (formData.imagen_servicio) {
        formDataToSend.append("imagen_servicio", formData.imagen_servicio);
      }

      await axios.post(
        "http://127.0.0.1:8000/servicios/",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Servicio creado correctamente",
        confirmButtonColor: "#7a8358",
      });

      // Limpiar el formulario
      setFormData({
        nombre_servicio: "",
        descripcion_servicio: "",
        precio_servicio: "",
        duracion_servicio: "",
        imagen_servicio: null,
      });

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.detail || "Error al crear el servicio",
        confirmButtonColor: "#7a8358",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold text-center text-[#4e5932] mb-8">
                  Crear Nuevo Servicio Médico
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#4e5932]">
                        Nombre del Servicio<span className="text-red-500"> *</span>
                      </label>
                      <input
                        type="text"
                        name="nombre_servicio"
                        value={formData.nombre_servicio}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-[#b9a88f] shadow-sm focus:border-[#7a8358] focus:ring focus:ring-[#7a8358] focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#4e5932]">
                        Descripción<span className="text-red-500"> *</span>
                      </label>
                      <textarea
                        name="descripcion_servicio"
                        value={formData.descripcion_servicio}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="mt-1 block w-full rounded-md border-[#b9a88f] shadow-sm focus:border-[#7a8358] focus:ring focus:ring-[#7a8358] focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#4e5932]">
                        Precio<span className="text-red-500"> *</span>
                      </label>
                      <input
                        type="number"
                        name="precio_servicio"
                        value={formData.precio_servicio}
                        onChange={handleChange}
                        required
                        min="0"
                        step="1000"
                        className="mt-1 block w-full rounded-md border-[#b9a88f] shadow-sm focus:border-[#7a8358] focus:ring focus:ring-[#7a8358] focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#4e5932]">
                        Duración (minutos)<span className="text-red-500"> *</span>
                      </label>
                      <input
                        type="number"
                        name="duracion_servicio"
                        value={formData.duracion_servicio}
                        onChange={handleChange}
                        required
                        min="1"
                        className="mt-1 block w-full rounded-md border-[#b9a88f] shadow-sm focus:border-[#7a8358] focus:ring focus:ring-[#7a8358] focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#4e5932]">
                        Imagen
                      </label>
                      <input
                        type="file"
                        name="imagen_servicio"
                        onChange={handleChange}
                        accept="image/*"
                        className="mt-1 block w-full text-sm text-[#4e5932]
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-[#7a8358] file:text-white
                          hover:file:bg-[#5c6142]"
                      />
                    </div>
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7a8358] hover:bg-[#5c6142] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7a8358]"
                    >
                      Crear Servicio
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCreateService;