import React from "react";
import { motion } from "framer-motion";
import { FaLightbulb, FaCheckCircle, FaImage, FaDollarSign, FaQuestionCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CrearServicioGuia = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#f5f3ee] via-[#eae4d3] to-[#e6dfc7] py-12 px-6 md:px-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm border border-[#d8c6aa] shadow-2xl rounded-3xl p-8"
      >
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-[#7a8358] mb-6 text-center"
        >
          Guía para Crear un Servicio
        </motion.h1>
        <p className="text-lg text-[#4e5932] mb-6 text-center">
          Sigue estos pasos para ofrecer tus servicios de manera efectiva. Los campos marcados con * son obligatorios.
        </p>
        <ol className="list-none space-y-6 text-[#4e5932]">
          <li className="flex items-start gap-4">
            <FaLightbulb className="text-2xl text-[#7a8358]" />
            <span><strong>Define el tipo de servicio*:</strong> Especifica claramente el tipo de servicio que ofreces.</span>
          </li>
          <li className="flex items-start gap-4">
            <FaCheckCircle className="text-2xl text-[#7a8358]" />
            <span><strong>Proporciona una descripción detallada*:</strong> Incluye información relevante que ayude a los clientes a entender tu servicio.</span>
          </li>
          <li className="flex items-start gap-4">
            <FaDollarSign className="text-2xl text-[#7a8358]" />
            <span><strong>Establece un precio*:</strong> Asegúrate de que el precio sea competitivo y refleje el valor del servicio.</span>
          </li>
          <li className="flex items-start gap-4">
            <FaImage className="text-2xl text-[#7a8358]" />
            <span><strong>Sube una imagen representativa:</strong> Una buena imagen puede atraer más clientes.</span>
          </li>
        </ol>
        <div className="mt-8 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/crear-servicio")}
            className="px-6 py-3 bg-gradient-to-r from-[#7a8358] to-[#6b744e] text-white font-bold rounded-lg shadow-md hover:opacity-90 transition"
          >
            Ir a Crear Servicio
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12"
        >
          <h2 className="text-3xl font-bold text-[#7a8358] mb-4">Preguntas Frecuentes (FAQ)</h2>
          <div className="space-y-4">
            <div className="p-4 bg-[#f9f9f7] border border-[#d8c6aa] rounded-lg shadow">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <FaQuestionCircle className="text-[#7a8358]" /> ¿Cómo me puedo comunicar con un administrador?
              </h3>
              <p className="text-[#4e5932] mt-2">Puedes contactar al administrador enviando un correo a <strong>phsadmin@gmail.com</strong>.</p>
            </div>
            <div className="p-4 bg-[#f9f9f7] border border-[#d8c6aa] rounded-lg shadow">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <FaQuestionCircle className="text-[#7a8358]" /> ¿Qué hago si mi servicio no aparece en la lista?
              </h3>
              <p className="text-[#4e5932] mt-2">Asegúrate de haber completado todos los campos obligatorios y de que tu cuenta esté activa.</p>
            </div>
            <div className="p-4 bg-[#f9f9f7] border border-[#d8c6aa] rounded-lg shadow">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <FaQuestionCircle className="text-[#7a8358]" /> ¿Puedo comunicarme con los clientes desde la plataforma?
              </h3>
              <p className="text-[#4e5932] mt-2">Sí. El emprendedor puede enviar un único mensaje por cada cita. Ese mensaje debe contener únicamente información de contacto del emprendedor o, en caso de cancelar la cita, el motivo de la cancelación. No se permite usar la mensajería para otros fines (promoción, compartir enlaces externos, etc.). Los clientes podrán leer los mensajes que reciban desde la plataforma.</p>
            </div>
            <div className="p-4 bg-[#f9f9f7] border border-[#d8c6aa] rounded-lg shadow">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <FaQuestionCircle className="text-[#7a8358]" /> ¿Cómo puedo actualizar mi información de perfil?
              </h3>
              <p className="text-[#4e5932] mt-2">Dirígete a la sección "Mi Perfil" y sigue las instrucciones. Se te pedirá tu contraseña para confirmar los cambios.</p>
            </div>
            <div className="p-4 bg-[#f9f9f7] border border-[#d8c6aa] rounded-lg shadow">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <FaQuestionCircle className="text-[#7a8358]" /> ¿Qué hago si olvidé mi contraseña?
              </h3>
              <p className="text-[#4e5932] mt-2">Haz clic en "Recuperar contraseña" en la página de inicio de sesión y sigue los pasos indicados.</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CrearServicioGuia;