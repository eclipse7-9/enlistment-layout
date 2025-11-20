import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAlert } from "../context/AlertContext";
import { motion } from "framer-motion";
import { FaLightbulb, FaImage, FaDollarSign, FaQuestionCircle, FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2";

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

    // pedir contraseña antes de permitir cambios (solo emprendedor tiene esta vista)
    const { value: password } = await Swal.fire({
      title: "Confirma tu contraseña para guardar cambios",
      input: "password",
      inputLabel: "Contraseña",
      inputPlaceholder: "Ingresa tu contraseña",
      inputAttributes: { autocapitalize: "off", autocorrect: "off" },
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#7a8358",
    });

    if (!password) return;

    try {
      // Verificar contraseña usando el endpoint de login (devuelve 200 si credenciales válidas)
      const loginCheck = await axios.post("http://localhost:8000/usuarios/login", {
        correo_usuario: formData.correo_usuario || user.correo,
        password_usuario: password,
      });

      if (!loginCheck || !loginCheck.data || !loginCheck.data.access_token) {
        Swal.fire({ icon: "error", title: "Contraseña incorrecta", text: "No se pudo verificar tu contraseña.", confirmButtonColor: "#7a8358" });
        return;
      }

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-[#f5f3ee] via-[#f0ead6] to-[#e6dfc7] pt-20 pb-12 px-6"
    >
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-[#e6dec8]">
          <h1 className="text-3xl font-bold text-[#7a8358] mb-6 text-center">Mi Perfil</h1>

          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-white to-[#fbfbf8] border border-[#efe7cf] shadow-sm">
              <h3 className="font-semibold text-[#4e5932] mb-2">Campos necesarios para crear un servicio</h3>
              <ul className="text-sm text-[#4e5932] space-y-2">
                <li className="flex items-start gap-2"><FaLightbulb className="text-[#7a8358] mt-1" /> <span><strong>Tipo de servicio*</strong>: Nombre claro del servicio.</span></li>
                <li className="flex items-start gap-2"><FaDollarSign className="text-[#7a8358] mt-1" /> <span><strong>Precio*</strong>: Formato numérico (ej: 50000.00).</span></li>
                <li className="flex items-start gap-2"><FaImage className="text-[#7a8358] mt-1" /> <span><strong>Imagen</strong>: Opcional pero recomendada.</span></li>
                <li className="flex items-start gap-2"><FaCheckCircle className="text-[#7a8358] mt-1" /> <span><strong>Descripción*</strong>: Texto explicativo y condiciones.</span></li>
              </ul>
              <div className="mt-4 text-center">
                <button onClick={() => navigate('/crear-servicio')} className="px-4 py-2 bg-gradient-to-r from-[#7a8358] to-[#6b744e] text-white rounded-lg shadow hover:opacity-95 transition">Ir a Crear Servicio</button>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white border border-[#efe7cf] shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-[#4e5932] mb-2">Información de la cuenta</h3>
                <p className="text-sm text-[#4e5932] mb-2"><strong>Correo:</strong> {formData.correo_usuario}</p>
                <p className="text-sm text-[#4e5932] mb-2"><strong>Teléfono:</strong> {formData.telefono_usuario}</p>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={handleLogout} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">Cerrar Sesión</button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#4e5932] mb-2" htmlFor="nombre_usuario">Nombre</label>
                <input type="text" id="nombre_usuario" name="nombre_usuario" value={formData.nombre_usuario} onChange={handleChange} required className="w-full p-3 border border-[#d8c6aa] rounded-lg focus:ring-2 focus:ring-[#7a8358] focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4e5932] mb-2" htmlFor="apellido_usuario">Apellido</label>
                <input type="text" id="apellido_usuario" name="apellido_usuario" value={formData.apellido_usuario} onChange={handleChange} required className="w-full p-3 border border-[#d8c6aa] rounded-lg focus:ring-2 focus:ring-[#7a8358] focus:border-transparent" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4e5932] mb-2" htmlFor="correo_usuario">Correo Electrónico</label>
              <input type="email" id="correo_usuario" name="correo_usuario" value={formData.correo_usuario} onChange={handleChange} required className="w-full p-3 border border-[#d8c6aa] rounded-lg focus:ring-2 focus:ring-[#7a8358] focus:border-transparent" />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4e5932] mb-2" htmlFor="telefono_usuario">Teléfono</label>
              <input type="tel" id="telefono_usuario" name="telefono_usuario" value={formData.telefono_usuario} onChange={handleChange} required className="w-full p-3 border border-[#d8c6aa] rounded-lg focus:ring-2 focus:ring-[#7a8358] focus:border-transparent" />
            </div>

            <div className="flex justify-end gap-4">
              <button type="button" onClick={() => navigate('/mis-servicios')} className="px-6 py-2 border border-[#7a8358] text-[#7a8358] rounded-lg hover:bg-[#f5f3ee] transition-colors">Cancelar</button>
              <motion.button whileHover={{ scale: 1.03 }} type="submit" className="px-6 py-2 bg-gradient-to-r from-[#7a8358] to-[#6b744e] text-white rounded-lg hover:opacity-95 transition">Guardar Cambios</motion.button>
            </div>
          </form>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-8">
            <h2 className="text-2xl font-bold text-[#7a8358] mb-4">Preguntas Frecuentes (FAQ)</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-[#f9f9f7] border border-[#d8c6aa] rounded-lg shadow">
                <h3 className="text-lg font-semibold flex items-center gap-2"><FaQuestionCircle className="text-[#7a8358]" /> ¿Cómo me comunico con un administrador?</h3>
                <p className="text-[#4e5932] mt-2">Envía un correo a <strong>phsadmin@gmail.com</strong> y explica tu solicitud.</p>
              </div>
              <div className="p-4 bg-[#f9f9f7] border border-[#d8c6aa] rounded-lg shadow">
                <h3 className="text-lg font-semibold flex items-center gap-2"><FaQuestionCircle className="text-[#7a8358]" /> ¿Qué campos son obligatorios para crear un servicio?</h3>
                <p className="text-[#4e5932] mt-2">Tipo de servicio, descripción y precio. Imagen recomendada para mayor visibilidad.</p>
              </div>
              <div className="p-4 bg-[#f9f9f7] border border-[#d8c6aa] rounded-lg shadow">
                <h3 className="text-lg font-semibold flex items-center gap-2"><FaQuestionCircle className="text-[#7a8358]" /> ¿Por qué me piden la contraseña para guardar cambios?</h3>
                <p className="text-[#4e5932] mt-2">Pedimos una verificación adicional para proteger la cuenta al modificar datos sensibles.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default MiCuentaEmprendedor;