import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

function PasswordRecovery({ onClose }) {
  const [step, setStep] = useState("request"); // request, verify, reset
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    try {
      // Primero verificamos si el usuario es administrador
      const userResponse = await axios.get(`http://127.0.0.1:8000/usuarios/check-role/${email}`);
      const isAdminUser = userResponse.data?.id_rol === 1;
      setIsAdmin(isAdminUser);

      if (!isAdminUser) {
        // Si no es admin, solicitar código
        await axios.post("http://127.0.0.1:8000/usuarios/request-password-recovery", {
          correo_usuario: email
        });

        await Swal.fire({
          icon: "success",
          title: "Código enviado",
          text: "Se ha enviado un código de recuperación a tu correo",
          confirmButtonColor: "#7a8358",
        });
        
        setStep("verify");
      } else {
        // Si es admin, ir directamente al cambio de contraseña
        setStep("reset");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.detail || "Hubo un problema al procesar la solicitud",
        confirmButtonColor: "#7a8358",
      });
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden",
        confirmButtonColor: "#7a8358",
      });
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/usuarios/verify-and-reset-password", {
        correo_usuario: email,
        code: isAdmin ? "" : code, // Si es admin, no enviamos código
        new_password: newPassword
      });

      await Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Tu contraseña ha sido actualizada",
        confirmButtonColor: "#7a8358",
      });

      onClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.detail || "Error al restablecer la contraseña",
        confirmButtonColor: "#7a8358",
      });
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
      >
        {/* Fondo con blur */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
        
        {/* Modal */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative min-h-screen flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-auto">
            {/* Encabezado */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-[#4e5932]">
                Recuperar Contraseña
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Paso 1: Solicitud inicial */}
            {step === "request" ? (
          <form onSubmit={handleRequestCode} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#4e5932] mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#b9a88f] bg-white focus:outline-none focus:ring-2 focus:ring-[#7a8358] transition-all duration-200"
                placeholder="ejemplo@correo.com"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Te enviaremos un código de verificación para restablecer tu contraseña
              </p>
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#7a8358] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#5c6142] transition-colors duration-200 shadow-sm"
            >
              Enviar Código
            </motion.button>
          </form>
        ) : step === "verify" ? (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#4e5932] mb-2">
                Código de Verificación
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ingresa el código recibido"
                className="w-full px-4 py-3 rounded-lg border border-[#b9a88f] bg-white focus:outline-none focus:ring-2 focus:ring-[#7a8358] transition-all duration-200"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Revisa tu correo electrónico y copia el código que te enviamos
              </p>
            </div>
            {/* Campos de contraseña */}
            <div>
              <label className="block text-sm font-semibold text-[#4e5932] mb-2">
                Nueva Contraseña
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingresa tu nueva contraseña"
                className="w-full px-4 py-3 rounded-lg border border-[#b9a88f] bg-white focus:outline-none focus:ring-2 focus:ring-[#7a8358] transition-all duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#4e5932] mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu nueva contraseña"
                className="w-full px-4 py-3 rounded-lg border border-[#b9a88f] bg-white focus:outline-none focus:ring-2 focus:ring-[#7a8358] transition-all duration-200"
                required
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#7a8358] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#5c6142] transition-colors duration-200 shadow-sm"
            >
              Restablecer Contraseña
            </motion.button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#4e5932] mb-2">
                Código de Verificación
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ingresa el código recibido"
                className="w-full px-4 py-3 rounded-lg border border-[#b9a88f] bg-white focus:outline-none focus:ring-2 focus:ring-[#7a8358] transition-all duration-200"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Revisa tu correo electrónico y copia el código que te enviamos
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#4e5932] mb-2">
                Nueva Contraseña
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingresa tu nueva contraseña"
                className="w-full px-4 py-3 rounded-lg border border-[#b9a88f] bg-white focus:outline-none focus:ring-2 focus:ring-[#7a8358] transition-all duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#4e5932] mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu nueva contraseña"
                className="w-full px-4 py-3 rounded-lg border border-[#b9a88f] bg-white focus:outline-none focus:ring-2 focus:ring-[#7a8358] transition-all duration-200"
                required
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#7a8358] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#5c6142] transition-colors duration-200 shadow-sm"
            >
              Restablecer Contraseña
            </motion.button>
          </form>
        )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default PasswordRecovery;