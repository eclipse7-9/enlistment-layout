import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function EmprendedorRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre_usuario: "",
    apellido_usuario: "",
    correo_usuario: "",
    telefono_usuario: "",
    password_usuario: "",
    confirmar_password: "",
    id_region: "",
    id_ciudad: "",
  });

  const [regiones, setRegiones] = useState([]);
  const [ciudades, setCiudades] = useState([]);

  // Cargar regiones al montar el componente
  useState(() => {
    const fetchRegiones = async () => {
      try {
        const response = await axios.get("http://localhost:8000/regiones/");
        setRegiones(response.data);
      } catch (error) {
        console.error("Error al cargar regiones:", error);
      }
    };
    fetchRegiones();
  }, []);

  // Cargar ciudades cuando se selecciona una región
  const handleRegionChange = async (regionId) => {
    setFormData({ ...formData, id_region: regionId, id_ciudad: "" });
    if (regionId) {
      try {
        const response = await axios.get(
          `http://localhost:8000/ciudades/region/${regionId}`
        );
        setCiudades(response.data);
      } catch (error) {
        console.error("Error al cargar ciudades:", error);
      }
    } else {
      setCiudades([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password_usuario !== formData.confirmar_password) {
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
        id_rol: 2, // Rol de emprendedor
        estado_usuario: "activo"
      };

      const response = await axios.post(
        "http://localhost:8000/usuarios/register",
        userData
      );

      await Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: "Tu cuenta de emprendedor ha sido creada",
        confirmButtonColor: "#7a8358",
      });

      // Iniciar sesión automáticamente
      const loginResponse = await axios.post(
        "http://localhost:8000/usuarios/login",
        {
          correo_usuario: formData.correo_usuario,
          password_usuario: formData.password_usuario,
        }
      );

      // Guardar el token en localStorage
      localStorage.setItem("token", loginResponse.data.token);
      localStorage.setItem("user", JSON.stringify(loginResponse.data));

      // Redirigir a la página de crear servicio
      navigate("/crear-servicio");

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.detail || "Error al registrar",
        confirmButtonColor: "#7a8358",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f3ee] py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-[#7a8358] mb-8 text-center">
            Registro de Emprendedor
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datos personales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#4e5932] mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.nombre_usuario}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre_usuario: e.target.value })
                  }
                  required
                  className="w-full p-3 border border-[#d8c6aa] rounded-lg focus:ring-2 focus:ring-[#7a8358] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4e5932] mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  value={formData.apellido_usuario}
                  onChange={(e) =>
                    setFormData({ ...formData, apellido_usuario: e.target.value })
                  }
                  required
                  className="w-full p-3 border border-[#d8c6aa] rounded-lg focus:ring-2 focus:ring-[#7a8358] focus:border-transparent"
                />
              </div>
            </div>

            {/* Contacto */}
            <div>
              <label className="block text-sm font-medium text-[#4e5932] mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={formData.correo_usuario}
                onChange={(e) =>
                  setFormData({ ...formData, correo_usuario: e.target.value })
                }
                required
                className="w-full p-3 border border-[#d8c6aa] rounded-lg focus:ring-2 focus:ring-[#7a8358] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4e5932] mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.telefono_usuario}
                onChange={(e) =>
                  setFormData({ ...formData, telefono_usuario: e.target.value })
                }
                required
                className="w-full p-3 border border-[#d8c6aa] rounded-lg focus:ring-2 focus:ring-[#7a8358] focus:border-transparent"
              />
            </div>

            {/* Ubicación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#4e5932] mb-2">
                  Región
                </label>
                <select
                  value={formData.id_region}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  required
                  className="w-full p-3 border border-[#d8c6aa] rounded-lg focus:ring-2 focus:ring-[#7a8358] focus:border-transparent"
                >
                  <option value="">Selecciona una región</option>
                  {regiones.map((region) => (
                    <option key={region.id_region} value={region.id_region}>
                      {region.nombre_region}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4e5932] mb-2">
                  Ciudad
                </label>
                <select
                  value={formData.id_ciudad}
                  onChange={(e) =>
                    setFormData({ ...formData, id_ciudad: e.target.value })
                  }
                  required
                  className="w-full p-3 border border-[#d8c6aa] rounded-lg focus:ring-2 focus:ring-[#7a8358] focus:border-transparent"
                >
                  <option value="">Selecciona una ciudad</option>
                  {ciudades.map((ciudad) => (
                    <option key={ciudad.id_ciudad} value={ciudad.id_ciudad}>
                      {ciudad.nombre_ciudad}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contraseña */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#4e5932] mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={formData.password_usuario}
                  onChange={(e) =>
                    setFormData({ ...formData, password_usuario: e.target.value })
                  }
                  required
                  className="w-full p-3 border border-[#d8c6aa] rounded-lg focus:ring-2 focus:ring-[#7a8358] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4e5932] mb-2">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  value={formData.confirmar_password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmar_password: e.target.value,
                    })
                  }
                  required
                  className="w-full p-3 border border-[#d8c6aa] rounded-lg focus:ring-2 focus:ring-[#7a8358] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="px-6 py-3 border border-[#7a8358] text-[#7a8358] rounded-lg hover:bg-[#f5f3ee]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-[#7a8358] text-white rounded-lg hover:bg-[#5c6142]"
              >
                Registrarse
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}