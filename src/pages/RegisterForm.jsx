import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaPaw } from "react-icons/fa";
import { GiCow, GiPig } from "react-icons/gi";
import { motion } from "framer-motion";
import { useAlert } from "../context/AlertContext";

function RegisterForm() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [formData, setFormData] = useState({
    nombre_usuario: "",
    apellido_usuario: "",
    telefono_usuario: "",
    correo_usuario: "",
    password_usuario: "",
    confirmar: "",
    id_region: "",
    id_ciudad: "",
  });

  const [regiones, setRegiones] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [selectedRole, setSelectedRole] = useState("cliente");

  // Cargar regiones al montar el componente
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/ubicaciones/regiones")
      .then((res) => setRegiones(res.data))
      .catch((err) => {
        console.error("Error al cargar regiones:", err);
        setRegiones([]);
      });
  }, []);

  // role selection handled in-form; no navigation here

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Estado para manejar la verificación
  const [verificationStep, setVerificationStep] = useState('initial'); // 'initial', 'verification', 'code'
  const [verificationCode, setVerificationCode] = useState('');

  const handleRequestVerification = async (e) => {
    e.preventDefault();

    if (formData.password_usuario !== formData.confirmar) {
      showAlert({ type: 'warning', message: '⚠️ Las contraseñas no coinciden' });
      return;
    }

    try {
      // Solicitar código de verificación
      await axios.post("http://127.0.0.1:8000/usuarios/request-verification", {
        correo_usuario: formData.correo_usuario
      });

      showAlert({ type: 'success', message: '✅ Código de verificación enviado a tu correo' });
      setVerificationStep('code');
    } catch (error) {
      showAlert({ type: 'error', message: '❌ Error al enviar el código de verificación' });
      console.error(error);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();

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
        id_rol: selectedRole === 'emprendedor' ? 2 : 4,
        estado_usuario: "activo",
      };

      // Mostrar datos que se van a enviar
      const dataToSend = {
        correo_usuario: formData.correo_usuario,
        code: verificationCode,
        user_data: userData,
      };
      console.log("Datos que se envían al servidor:", JSON.stringify(dataToSend, null, 2));

      const response = await axios.post("http://127.0.0.1:8000/usuarios/verify-and-register", dataToSend);

  showAlert({ type: 'success', message: '✅ Registro completado exitosamente. Por favor inicia sesión.' });

      // Tras registro, redirigir al login (el usuario iniciará sesión manualmente)
      navigate('/login');
    } catch (error) {
      if (error.response) {
        showAlert({ type: 'error', message: `❌ Error: ${error.response.data.detail || "Error en el registro"}` });
      } else {
        showAlert({ type: 'error', message: '❌ No se pudo conectar con el servidor' });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (verificationStep === 'initial') {
      handleRequestVerification(e);
    } else {
      handleVerifyAndRegister(e);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/img/repeating-triangles.png')] bg-cover bg-center bg-fixed animate-bg">
      <div className="min-h-screen bg-[#D4BBA3]/60 flex flex-col md:flex-row">
        <motion.div
          className="flex-1 flex items-center justify-center p-6 md:p-10 order-1 md:order-none"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          {/* dropdown removed from here; placed inside the form near header */}

          <motion.form
              onSubmit={handleSubmit}
              className="bg-white/85 backdrop-blur-md border border-[#d8c6aa] rounded-2xl p-8 w-full max-w-2xl space-y-4 shadow-xl"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
            <div className="text-center mb-6">
              <FaPaw className="text-4xl mx-auto text-[#7a8358] mb-2 animate-bounce" />
              <h2 className="text-2xl font-bold text-[#4e5932]">Crear Cuenta</h2>
              <p className="text-sm text-[#6d6d6d]">Completa los campos para registrarte 🐾</p>
              {/* Dropdown para seleccionar rol (solo cambia el valor que se enviará) */}
              <div className="mt-4 flex flex-col items-center gap-2">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-3 py-2 border border-[#b9a88f] rounded-lg focus:ring-2 focus:ring-[#7a8358]"
                >
                  <option value="cliente">Cliente</option>
                  <option value="emprendedor">Emprendedor</option>
                </select>
                <div className="text-xs text-gray-600">
                  Registrando como: <span className="font-semibold text-[#4e5932]">{selectedRole === 'emprendedor' ? 'Emprendedor' : 'Cliente'}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[ 
                ["Nombre:", "nombre_usuario", "text", "Ingrese su nombre"],
                ["Apellido:", "apellido_usuario", "text", "Ingrese su apellido"],
                ["Teléfono:", "telefono_usuario", "tel", "Ej: 3001234567"],
                ["Correo electrónico:", "correo_usuario", "email", "ejemplo@correo.com"],
                ["Contraseña:", "password_usuario", "password", "Ingrese su contraseña"],
                ["Confirmar contraseña:", "confirmar", "password", "Repita su contraseña"],
              ].map(([label, name, type, placeholder]) => (
                <div key={name}>
                  <label className="block text-[#4e5932] font-semibold mb-1">{label}<span className="text-red-500"> *</span></label>
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

            {/* Regiones / Ciudades */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#4e5932] font-semibold mb-1">Región:</label>
                <select
                  name="id_region"
                  value={formData.id_region}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) => ({ ...prev, id_region: value, id_ciudad: "" }));

                    if (value) {
                      axios
                        .get(`http://127.0.0.1:8000/ubicaciones/ciudades?region_id=${value}`)
                        .then((res) => setCiudades(res.data))
                        .catch(() => setCiudades([]));
                    } else {
                      setCiudades([]);
                    }
                  }}
                  required
                  className="w-full px-3 py-2 border border-[#b9a88f] rounded-lg focus:ring-2 focus:ring-[#7a8358]"
                >
                  <option value="">Seleccione una región</option>
                  {regiones.map((r) => (
                    <option key={r.id_region} value={r.id_region}>{r.nombre_region}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#4e5932] font-semibold mb-1">Ciudad:</label>
                <select
                  name="id_ciudad"
                  value={formData.id_ciudad}
                  onChange={(e) => setFormData((prev) => ({ ...prev, id_ciudad: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-[#b9a88f] rounded-lg focus:ring-2 focus:ring-[#7a8358]"
                  disabled={!formData.id_region}
                >
                  <option value="">Seleccione una ciudad</option>
                  {ciudades.map((c) => (
                    <option key={c.id_ciudad} value={c.id_ciudad}>{c.nombre_ciudad}</option>
                  ))}
                </select>
              </div>
            </div>

            <label className="flex items-center space-x-2 text-[#4e5932]">
              <input type="checkbox" required className="accent-[#7a8358]" />
              <span>
                Acepto las <Link to="/politicas-privacidad" className="underline text-[#4e5932] font-semibold">políticas de privacidad</Link>
              </span>
            </label>

            <div className="space-y-3">
              {verificationStep === 'initial' ? (
                <motion.button
                  type="submit"
                  className="w-full bg-[#7a8358] hover:bg-[#69724c] text-white font-semibold py-2 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Solicitar código de verificación
                </motion.button>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-[#4e5932] font-semibold mb-1">Código de verificación:</label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Ingrese el código enviado a su correo"
                      className="w-full px-3 py-2 border border-[#b9a88f] rounded-lg focus:ring-2 focus:ring-[#7a8358]"
                      required
                    />
                  </div>
                  <motion.button
                    type="submit"
                    className="w-full bg-[#7a8358] hover:bg-[#69724c] text-white font-semibold py-2 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Verificar y registrarse
                  </motion.button>
                </>
              )}

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
            transition={{ duration: 1 }}
          >
            ¡Únete a Pet Health Service’s!
          </motion.h1>
          <motion.p
            className="text-sm mt-2 text-center opacity-90"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Regístrate y cuida a tus animales con nosotros 🐾
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

export default RegisterForm;
