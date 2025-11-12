import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAlert } from "../context/AlertContext";

const MiCuentaEmprendedor = () => {
  const { user, logout } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre_usuario: "",
    apellido_usuario: "",
    correo_usuario: "",
    telefono_usuario: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/usuarios/${user.id_usuario}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setFormData({
          nombre_usuario: response.data.nombre_usuario,
          apellido_usuario: response.data.apellido_usuario,
          correo_usuario: response.data.correo_usuario,
          telefono_usuario: response.data.telefono_usuario,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error);
        showAlert({ type: 'error', title: 'Error', message: 'No se pudieron cargar tus datos' });
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8000/usuarios/${user.id_usuario}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      showAlert({ type: 'success', title: '¡Éxito!', message: 'Tus datos han sido actualizados' });
    } catch (error) {
      console.error("Error al actualizar datos:", error);
      showAlert({ type: 'error', title: 'Error', message: error.response?.data?.detail || 'Error al actualizar tus datos' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f3ee] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7a8358]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f3ee] pt-20 pb-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-[#7a8358] mb-8 text-center">
            Mi Perfil
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-sm font-medium text-[#4e5932] mb-2"
                  htmlFor="nombre_usuario"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre_usuario"
                  name="nombre_usuario"
                  value={formData.nombre_usuario}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-[#d8c6aa] rounded-lg focus:ring-2 focus:ring-[#7a8358] focus:border-transparent"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-[#4e5932] mb-2"
                  htmlFor="apellido_usuario"
                >
                  Apellido
                </label>
                <input
                  type="text"
                  id="apellido_usuario"
                  name="apellido_usuario"
                  value={formData.apellido_usuario}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-[#d8c6aa] rounded-lg focus:ring-2 focus:ring-[#7a8358] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-[#4e5932] mb-2"
                htmlFor="correo_usuario"
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                id="correo_usuario"
                name="correo_usuario"
                value={formData.correo_usuario}
                onChange={handleChange}
                required
                className="w-full p-3 border border-[#d8c6aa] rounded-lg focus:ring-2 focus:ring-[#7a8358] focus:border-transparent"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-[#4e5932] mb-2"
                htmlFor="telefono_usuario"
              >
                Teléfono
              </label>
              <input
                type="tel"
                id="telefono_usuario"
                name="telefono_usuario"
                value={formData.telefono_usuario}
                onChange={handleChange}
                required
                className="w-full p-3 border border-[#d8c6aa] rounded-lg focus:ring-2 focus:ring-[#7a8358] focus:border-transparent"
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleLogout}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Cerrar Sesión
              </button>

              <button
                type="submit"
                className="px-6 py-3 bg-[#7a8358] text-white rounded-lg hover:bg-[#5c6142] transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MiCuentaEmprendedor;