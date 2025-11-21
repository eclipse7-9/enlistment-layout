import React from "react";
import { motion } from "framer-motion";

const FAQS = () => {
  const faqs = [
    { q: "¿Cómo registro mi negocio?", a: "Ve a Registrarse → Emprendedor y completa el formulario. Luego revisa tu email para verificar tu cuenta." },
    { q: "¿Cómo agrego un servicio?", a: "Desde tu cuenta de emprendedor, ve a 'Crear servicio' y completa los campos. Puedes subir una imagen opcional." },
    { q: "¿Cómo recibo pedidos?", a: "Los clientes reservarán servicios o comprarán productos; recibirás notificaciones en la campana y en tu panel de emprendedor." },
    { q: "¿Puedo editar un servicio?", a: "Sí: en el panel de servicios puedes editar o eliminar tus servicios. Los administradores también pueden editar." },
  ];

  return (
    <section className="min-h-screen bg-[#f5f3ee] py-12 px-6 md:px-16">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm border border-[#d8c6aa] shadow-lg rounded-2xl p-8">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-[#7a8358] mb-4 text-center">Preguntas Frecuentes (FAQS)</motion.h1>
        <p className="text-sm text-gray-600 mb-6">Aquí encontrarás respuestas rápidas a las preguntas más comunes.</p>

        <div className="space-y-4">
          {faqs.map((f, idx) => (
            <details key={idx} className="p-4 border rounded-lg bg-gray-50">
              <summary className="font-semibold cursor-pointer">{f.q}</summary>
              <div className="mt-2 text-sm text-gray-700">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQS;
