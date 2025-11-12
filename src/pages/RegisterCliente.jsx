import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPaw } from "react-icons/fa";
import { GiCow, GiPig } from "react-icons/gi";

function RegisterForm() {
  const navigate = useNavigate();

  const handleEmprendedorClick = () => {
    navigate('/register-emprendedor');
  };

  const handleClienteClick = () => {
    navigate('/register-cliente');
  };

  return (
    <div className="min-h-screen bg-[#F6F8F2] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <motion.div
            className="flex justify-center space-x-8 mb-6"
            initial={{ y: -10 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <GiCow className="text-6xl text-[#7a8358] opacity-90" />
            <FaPaw className="text-6xl text-[#7a8358] opacity-90" />
            <GiPig className="text-6xl text-[#7a8358] opacity-90" />
          </motion.div>
          <h2 className="text-4xl font-bold text-[#4e5932] mb-4">
            ¡Únete a Pet Health Service's!
          </h2>
          <p className="text-lg text-gray-600">
            Selecciona el tipo de cuenta que deseas crear
          </p>
        </div>

        <motion.div 
          className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Tarjeta de Cliente */}
          <div 
            onClick={handleClienteClick}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer border-2 border-[#7a8358] group"
          >
            <div className="text-center mb-6">
              <FaPaw className="text-5xl text-[#7a8358] mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-[#4e5932] mb-3">Cliente</h3>
            </div>
            <p className="text-gray-600 text-center">
              Regístrate como cliente para:
            </p>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Acceder a productos veterinarios
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Agendar servicios médicos
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Recibir atención personalizada
              </li>
            </ul>
          </div>

          {/* Tarjeta de Emprendedor */}
          <div 
            onClick={handleEmprendedorClick}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer border-2 border-[#7a8358] group"
          >
            <div className="text-center mb-6">
              <GiCow className="text-5xl text-[#7a8358] mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-[#4e5932] mb-3">Emprendedor</h3>
            </div>
            <p className="text-gray-600 text-center">
              Regístrate como emprendedor para:
            </p>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Ofrecer servicios veterinarios
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Gestionar tus servicios médicos
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Expandir tu negocio veterinario
              </li>
            </ul>
          </div>
        </motion.div>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-[#7a8358] font-semibold hover:underline"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;