import React from "react";
import { motion } from "framer-motion";
import { FaTruck, FaCheckCircle, FaPhone, FaQuestionCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ManualDomiciliario = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#f5f3ee] via-[#eae4d3] to-[#e6dfc7] py-12 px-6 md:px-16">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm border border-[#d8c6aa] shadow-2xl rounded-3xl p-8">
        <motion.h1 className="text-4xl font-extrabold text-[#7a8358] mb-6 text-center" initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
          Guía para Domiciliarios
        </motion.h1>

        <p className="text-lg text-[#4e5932] mb-6 text-center">Sigue estas recomendaciones para gestionar entregas de forma segura y profesional.</p>

        <ol className="list-none space-y-6 text-[#4e5932]">
          <li className="flex items-start gap-4">
            <FaTruck className="text-2xl text-[#7a8358]" />
            <span><strong>Revisa la información del pedido:</strong> Confirma productos, dirección y contacto del cliente antes de aceptar.</span>
          </li>
          <li className="flex items-start gap-4">
            <FaCheckCircle className="text-2xl text-[#7a8358]" />
            <span><strong>Marca el estado correctamente:</strong> Primero 'En-proceso', luego 'Entregado'. Solo se permite 'Cancelado' si el pedido estaba en proceso.</span>
          </li>
          <li className="flex items-start gap-4">
            <FaPhone className="text-2xl text-[#7a8358]" />
            <span><strong>Comunicación:</strong> Si necesitas cancelar, marca el pedido como 'Cancelado'; el administrador será notificado.</span>
          </li>
        </ol>

        <div className="mt-8 text-center">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/domiciliario')} className="px-6 py-3 bg-gradient-to-r from-[#7a8358] to-[#6b744e] text-white font-bold rounded-lg shadow-md hover:opacity-90 transition">
            Ir al panel de Domiciliarios
          </motion.button>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-bold text-[#7a8358] mb-4">Preguntas Frecuentes (FAQ)</h2>
          <div className="space-y-4">
            <div className="p-4 bg-[#f9f9f7] border border-[#d8c6aa] rounded-lg shadow">
              <h3 className="text-xl font-semibold flex items-center gap-2"><FaQuestionCircle className="text-[#7a8358]" /> ¿Cómo reporto un problema con una entrega?</h3>
              <p className="text-[#4e5932] mt-2">Usa la opción 'Cancelar' en la campanita. El admin recibirá la notificación y podrá contactarte.</p>
            </div>
            <div className="p-4 bg-[#f9f9f7] border border-[#d8c6aa] rounded-lg shadow">
              <h3 className="text-xl font-semibold flex items-center gap-2"><FaQuestionCircle className="text-[#7a8358]" /> ¿Qué hago si no encuentro al cliente?</h3>
              <p className="text-[#4e5932] mt-2">Intenta comunicarte por teléfono. Si no es posible, marca el pedido como 'Cancelado' y espera instrucciones del admin.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ManualDomiciliario;
