import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function DomiciliarioRegister() {
  const [formData, setFormData] = useState({
    nombre_usuario: "",
    apellido_usuario: "",
    correo_usuario: "",
    telefono_usuario: "",
    password_usuario: "",
    confirmar: "",
    id_region: "",
    id_ciudad: "",
    domiciliario_key: "",  // Clave para crear domiciliarios
  });

  const [regiones, setRegiones] = useState([]);
  const [ciudades, setCiudades] = useState([]);

  useEffect(() => {
    // Cargar regiones al montar el componente
    const fetchRegiones = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/regiones/");
        setRegiones(response.data);
      } catch (error) {
        console.error("Error al cargar regiones:", error);
      }
    };
    fetchRegiones();
  }, []);

  useEffect(() => {
    // Cargar ciudades cuando se selecciona una región
    const fetchCiudades = async () => {
      if (formData.id_region) {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/ciudades/region/${formData.id_region}`
          );
          setCiudades(response.data);
        } catch (error) {
          console.error("Error al cargar ciudades:", error);
        }
      } else {
        setCiudades([]);
      }
    };
    fetchCiudades();
  }, [formData.id_region]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password_usuario !== formData.confirmar) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden",
        confirmButtonColor: "#7a8358",
      });
      return;
    }

    try {
      const userData = {
        nombre_usuario: formData.nombre_usuario,
        apellido_usuario: formData.apellido_usuario,
        correo_usuario: formData.correo_usuario,
        telefono_usuario: formData.telefono_usuario,
        password_usuario: formData.password_usuario,
        id_region: Number(formData.id_region),
        id_ciudad: Number(formData.id_ciudad),
        imagen_usuario: null,
        id_rol: 2, // Forzar rol de domiciliario
        estado_usuario: "activo"
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/usuarios/register-domiciliario",
        userData,
        {
          params: {
            domiciliario_key: formData.domiciliario_key
          }
        }
      );

      await Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: "El domiciliario ha sido registrado correctamente",
        confirmButtonColor: "#7a8358",
      });

      // Limpiar el formulario
      setFormData({
        nombre_usuario: "",
        apellido_usuario: "",
        correo_usuario: "",
        telefono_usuario: "",
        password_usuario: "",
        confirmar: "",
        id_region: "",
        id_ciudad: "",
        domiciliario_key: "",
      });

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.detail || "Error al registrar el domiciliario",
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
                  Registro de Domiciliario
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#4e5932]">
                        Nombre
                      </label>
                      <input
                        type="text"
                        name="nombre_usuario"
                        value={formData.nombre_usuario}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-[#b9a88f] shadow-sm focus:border-[#7a8358] focus:ring focus:ring-[#7a8358] focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#4e5932]">
                        Apellido
                      </label>
                      <input
                        type="text"
                        name="apellido_usuario"
                        value={formData.apellido_usuario}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-[#b9a88f] shadow-sm focus:border-[#7a8358] focus:ring focus:ring-[#7a8358] focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#4e5932]">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        name="correo_usuario"
                        value={formData.correo_usuario}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-[#b9a88f] shadow-sm focus:border-[#7a8358] focus:ring focus:ring-[#7a8358] focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#4e5932]">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        name="telefono_usuario"
                        value={formData.telefono_usuario}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-[#b9a88f] shadow-sm focus:border-[#7a8358] focus:ring focus:ring-[#7a8358] focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#4e5932]">
                        Región
                      </label>
                      <select
                        name="id_region"
                        value={formData.id_region}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-[#b9a88f] shadow-sm focus:border-[#7a8358] focus:ring focus:ring-[#7a8358] focus:ring-opacity-50"
                      >
                        <option value="">Seleccione una región</option>
                        {regiones.map((region) => (
                          <option key={region.id_region} value={region.id_region}>
                            {region.nombre_region}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#4e5932]">
                        Ciudad
                      </label>
                      <select
                        name="id_ciudad"
                        value={formData.id_ciudad}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-[#b9a88f] shadow-sm focus:border-[#7a8358] focus:ring focus:ring-[#7a8358] focus:ring-opacity-50"
                      >
                        <option value="">Seleccione una ciudad</option>
                        {ciudades.map((ciudad) => (
                          <option key={ciudad.id_ciudad} value={ciudad.id_ciudad}>
                            {ciudad.nombre_ciudad}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#4e5932]">
                        Contraseña
                      </label>
                      <input
                        type="password"
                        name="password_usuario"
                        value={formData.password_usuario}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-[#b9a88f] shadow-sm focus:border-[#7a8358] focus:ring focus:ring-[#7a8358] focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#4e5932]">
                        Confirmar Contraseña
                      </label>
                      <input
                        type="password"
                        name="confirmar"
                        value={formData.confirmar}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-[#b9a88f] shadow-sm focus:border-[#7a8358] focus:ring focus:ring-[#7a8358] focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#4e5932]">
                        Clave de Registro
                      </label>
                      <input
                        type="password"
                        name="domiciliario_key"
                        value={formData.domiciliario_key}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-[#b9a88f] shadow-sm focus:border-[#7a8358] focus:ring focus:ring-[#7a8358] focus:ring-opacity-50"
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        Esta clave es requerida para registrar domiciliarios
                      </p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7a8358] hover:bg-[#5c6142] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7a8358]"
                    >
                      Registrar Domiciliario
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

export default DomiciliarioRegister;