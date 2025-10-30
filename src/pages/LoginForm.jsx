import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaPaw } from "react-icons/fa";
import { GiCow, GiPig } from "react-icons/gi";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    correo_usuario: "",
    password_usuario: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.correo_usuario || !formData.password_usuario) {
      Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Por favor, ingresa tu correo y contraseña.",
        confirmButtonColor: "#7a8358",
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/usuarios/login",
        {
          correo_usuario: formData.correo_usuario,
          password_usuario: formData.password_usuario,
        }
      );

      // 🚫 Cuenta inactiva
      if (response.data.estado_usuario === "inactivo") {
        Swal.fire({
          icon: "error",
          title: "Cuenta inactiva",
          text: "Tu cuenta se encuentra desactivada. Contacta al administrador.",
          confirmButtonColor: "#7a8358",
          background: "#fff8f6",
        });
        return;
      }

      // ✅ Login exitoso
      const userData = {
        correo: response.data.correo,
        nombre: response.data.nombre_usuario,
        id_usuario: response.data.id_usuario,
        id_rol: response.data.id_rol,
        token: response.data.access_token,
      };

      login(userData);

      // 🎉 SweetAlert de bienvenida
      await Swal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        text: `Inicio de sesión exitoso, ${userData.nombre}.`,
        showConfirmButton: false,
        timer: 2000,
        background: "#f9fff6",
      });

      // 🔑 Redirección según rol
      switch (userData.id_rol) {
        case 1:
          navigate("/admin/users");
          break;
        case 3:
          navigate("/domiciliario");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de inicio de sesión",
        text: "Credenciales incorrectas o usuario no encontrado.",
        confirmButtonColor: "#7a8358",
        background: "#fff8f6",
      });
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/img/repeating-triangles.png')] bg-cover bg-center bg-fixed animate-bg">
      <div className="min-h-screen bg-[#D4BBA3]/60">
        <div className="flex min-h-screen">
          {/* Panel verde animado */}
          <motion.div
            className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#7a8358] text-white p-8 relative"
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="flex flex-col items-center text-center space-y-8">
              <motion.img
                src="/img/logo.png"
                alt="Pet Health Service's Logo"
                className="w-72 mx-auto select-none"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />

              <motion.div
                className="flex justify-center space-x-8"
                initial={{ y: -10 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <motion.div whileHover={{ scale: 1.15 }}>
                  <GiCow className="text-6xl opacity-90" />
                </motion.div>
                <motion.div whileHover={{ rotate: 15 }}>
                  <FaPaw className="text-6xl opacity-80" />
                </motion.div>
                <motion.div whileHover={{ scale: 1.15 }}>
                  <GiPig className="text-6xl opacity-90" />
                </motion.div>
              </motion.div>

              <motion.h1
                className="text-3xl font-bold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Bienvenido a Pet Health Service's
              </motion.h1>

              <motion.p
                className="text-sm opacity-90"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                Cuidamos la salud de todos tus animales 🐄🐖🐾
              </motion.p>
            </div>
          </motion.div>

          {/* Formulario */}
          <motion.div
            className="flex-1 flex items-center justify-center p-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <motion.form
              onSubmit={handleLogin}
              className="bg-white/85 backdrop-blur-md border border-[#d8c6aa] rounded-2xl p-8 w-full max-w-md space-y-6"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <div className="text-center mb-4">
                <FaPaw className="text-4xl mx-auto text-[#7a8358] mb-2 animate-bounce" />
                <h2 className="text-2xl font-bold text-[#4e5932]">
                  Iniciar Sesión
                </h2>
                <p className="text-sm text-[#6d6d6d]">
                  Ingresa tus datos para continuar 🐾
                </p>
              </div>

              <div>
                <label className="block text-[#4e5932] font-semibold mb-1">
                  Correo electrónico:
                </label>
                <input
                  type="email"
                  name="correo_usuario"
                  value={formData.correo_usuario}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                  required
                  className="w-full px-3 py-2 border border-[#b9a88f] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a8358]"
                />
              </div>

              <div>
                <label className="block text-[#4e5932] font-semibold mb-1">
                  Contraseña:
                </label>
                <input
                  type="password"
                  name="password_usuario"
                  value={formData.password_usuario}
                  onChange={handleChange}
                  placeholder="Ingrese su contraseña"
                  required
                  className="w-full px-3 py-2 border border-[#b9a88f] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a8358]"
                />
              </div>

              <motion.button
                type="submit"
                className="w-full bg-[#7a8358] hover:bg-[#69724c] text-white font-semibold py-2 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}a
                whileTap={{ scale: 0.95 }}
              >
                Ingresar
              </motion.button>

              <motion.button
                type="button"
                onClick={() => navigate("/register")}
                className="w-full bg-[#e3c8a8] hover:bg-[#d6b991] text-[#4e5932] font-semibold py-2 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Crear cuenta
              </motion.button>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
