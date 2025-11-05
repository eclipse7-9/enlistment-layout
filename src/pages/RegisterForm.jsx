import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaPaw } from "react-icons/fa";
import { GiCow, GiPig } from "react-icons/gi";
import { motion } from "framer-motion";

function RegisterForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    nombre_usuario: "",
    apellido_usuario: "",
    telefono_usuario: "",
    correo_usuario: "",
    password_usuario: "",
    confirmar: "",
    direccion_usuario: "",
    codigo_postal_usuario: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password_usuario !== formData.confirmar) {
      alert("⚠️ Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/usuarios/register", {
        nombre_usuario: formData.nombre_usuario,
        apellido_usuario: formData.apellido_usuario,
        correo_usuario: formData.correo_usuario,
        telefono_usuario: formData.telefono_usuario,
        password_usuario: formData.password_usuario,
        direccion_usuario: formData.direccion_usuario,
        codigo_postal_usuario: formData.codigo_postal_usuario,
        imagen_usuario: null,
        id_rol: 4,
        estado_usuario: "activo",
      });

      alert(`✅ ${response.data.msg}`);

      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);

        const userData = {
          nombre: formData.nombre_usuario,
          correo: formData.correo_usuario,
          token: response.data.access_token,
        };
        login(userData);
      }

      navigate("/");
    } catch (error) {
      if (error.response) {
        alert(`❌ Error: ${error.response.data.detail || "Error en el registro"}`);
      } else {
        alert("❌ No se pudo conectar con el servidor");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[url('/img/repeating-triangles.png')] bg-cover bg-center bg-fixed animate-bg">
      <div className="min-h-screen bg-[#D4BBA3]/60 flex flex-col md:flex-row">
        {/* PANEL IZQUIERDO → FORMULARIO */}
        <motion.div
          className="flex-1 flex items-center justify-center p-6 md:p-10 order-1 md:order-none"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.form
            onSubmit={handleRegister}
            className="bg-white/85 backdrop-blur-md border border-[#d8c6aa] rounded-2xl p-8 w-full max-w-2xl space-y-4 shadow-xl"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <div className="text-center mb-6">
              <FaPaw className="text-4xl mx-auto text-[#7a8358] mb-2 animate-bounce" />
              <h2 className="text-2xl font-bold text-[#4e5932]">Crear Cuenta</h2>
              <p className="text-sm text-[#6d6d6d]">Completa los campos para registrarte 🐾</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["Nombre:", "nombre_usuario", "text", "Ingrese su nombre"],
                ["Apellido:", "apellido_usuario", "text", "Ingrese su apellido"],
                ["Teléfono:", "telefono_usuario", "tel", "Ej: 3001234567"],
                ["Correo electrónico:", "correo_usuario", "email", "ejemplo@correo.com"],
                ["Contraseña:", "password_usuario", "password", "Ingrese su contraseña"],
                ["Confirmar contraseña:", "confirmar", "password", "Repita su contraseña"],
                ["Dirección:", "direccion_usuario", "text", "Ingrese su dirección"],
                ["Código postal:", "codigo_postal_usuario", "text", "Ej: 110111"],
              ].map(([label, name, type, placeholder]) => (
                <div key={name}>
                  <label className="block text-[#4e5932] font-semibold mb-1">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required
                    className="w-full px-3 py-2 border border-[#b9a88f] rounded-lg focus:ring-2 focus:ring-[#7a8358]"
                  />
                </div>
              ))}
            </div>

            <label className="flex items-center space-x-2 text-[#4e5932]">
              <input type="checkbox" required className="accent-[#7a8358]" />
              <span>Acepto las políticas de privacidad</span>
            </label>

            <div className="space-y-3">
              <motion.button
                type="submit"
                className="w-full bg-[#7a8358] hover:bg-[#69724c] text-white font-semibold py-2 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Registrarse
              </motion.button>

              <motion.button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full bg-[#e3c8a8] hover:bg-[#d6b991] text-[#4e5932] font-semibold py-2 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ya tengo cuenta
              </motion.button>
            </div>
          </motion.form>
        </motion.div>

        {/* PANEL DERECHO → LOGO Y DECORACIÓN */}
        <motion.div
          className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#7a8358] text-white p-8"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.img
            src="/img/logo.png"
            alt="Logo Pet Health"
            className="w-72 mx-auto mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
          />

          <motion.div
            className="flex justify-center space-x-8"
            initial={{ y: -10 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <GiCow className="text-6xl opacity-90" />
            <FaPaw className="text-6xl opacity-90" />
            <GiPig className="text-6xl opacity-90" />
          </motion.div>

          <motion.h1
            className="text-3xl font-bold mt-8 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ¡Únete a Pet Health Service’s!
          </motion.h1>
          <motion.p
            className="text-sm mt-2 text-center opacity-90"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Regístrate y cuida a tus animales con nosotros 🐾
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

export default RegisterForm;
