import React from "react";

function Info() {
  return (
    <section className="bg-[#F9FAF8] py-20 px-6 md:px-12 lg:px-24">
      {/* Título */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#7A8358] font-[Poppins]">
          Sobre Nosotros
        </h2>
      </div>

      {/* Contenedor de texto + imagen */}
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Texto */}
        <div className="lg:w-1/2 text-gray-700 text-base md:text-lg leading-relaxed space-y-5">
          <p>
            En{" "}
            <strong className="text-[#7A8358] font-semibold">
              Pet-Health Services
            </strong>{" "}
            somos especialistas en el cuidado de animales de granja. Nuestro
            compromiso es garantizar su salud, bienestar y productividad a través
            de servicios veterinarios de alta calidad, productos confiables y
            asesoría profesional.
          </p>

          <p>
            Con años de experiencia en el sector, ayudamos a productores y
            criadores a mejorar el rendimiento de sus animales, prevenir
            enfermedades y mantener entornos saludables. Creemos que un animal
            sano es sinónimo de una producción sostenible y responsable.
          </p>
        </div>

        {/* Imagen */}
        <div className="lg:w-1/2 flex justify-center">
          <img
            src="/img/veterinario_cuidado.png"
            alt="Veterinario cuidando animales"
            className="rounded-2xl shadow-lg w-full max-w-lg object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </section>
  );
}

export default Info;
