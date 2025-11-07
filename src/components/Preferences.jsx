import React from "react";
import { Award, ShieldCheck, HeartHandshake } from "lucide-react"; // 👈 íconos modernos

function Preferences() {
  return (
    <section className="bg-[#F5F3EE] py-20 px-6 md:px-12 lg:px-24">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#7A8358] font-[Poppins]">
          ¿Por qué elegirnos?
        </h2>
        <p className="text-gray-600 mt-4 text-base md:text-lg max-w-2xl mx-auto">
          En nuestra clínica veterinaria nos comprometemos con el bienestar, la
          calidad y la confianza de cada uno de nuestros pacientes.
        </p>
      </div>

      {/* Contenedor de las tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Tarjeta 1 */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-8 text-center flex flex-col items-center">
          <div className="bg-[#E6EAD0] p-4 rounded-full mb-6">
            <Award className="text-[#7A8358]" size={48} />
          </div>
          <h3 className="text-xl font-semibold text-[#7A8358] mb-3">
            Experiencia
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Contamos con un equipo de veterinarios con amplia trayectoria en
            cuidado animal, comprometidos con el bienestar de tus mascotas.
          </p>
        </div>

        {/* Tarjeta 2 */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-8 text-center flex flex-col items-center">
          <div className="bg-[#E6EAD0] p-4 rounded-full mb-6">
            <ShieldCheck className="text-[#7A8358]" size={48} />
          </div>
          <h3 className="text-xl font-semibold text-[#7A8358] mb-3">
            Calidad
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Ofrecemos productos y servicios certificados para garantizar la
            seguridad y salud de los animales bajo nuestro cuidado.
          </p>
        </div>

        {/* Tarjeta 3 */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-8 text-center flex flex-col items-center">
          <div className="bg-[#E6EAD0] p-4 rounded-full mb-6">
            <HeartHandshake className="text-[#7A8358]" size={48} />
          </div>
          <h3 className="text-xl font-semibold text-[#7A8358] mb-3">
            Atención Personalizada
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Escuchamos y acompañamos a cada cliente con soluciones adaptadas a
            las necesidades específicas de su mascota.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Preferences;
