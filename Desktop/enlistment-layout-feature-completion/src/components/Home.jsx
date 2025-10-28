import React from "react";
import { motion } from "framer-motion";

const Home = () => {
  const servicios = [
    {
      id: 1,
      nombre: "Vacunación",
      descripcion:
        "Protege a tus animales con vacunas especializadas que garantizan su bienestar y previenen enfermedades.",
      imagen:"/img/vacunacion.png",
    },
    {
      id: 2,
      nombre: "Chequeo general",
      descripcion:
        "Revisamos la salud completa de tus animales con equipos modernos y personal calificado.",
      imagen:"/img/chequeo.png",
    },
    {
      id: 3,
      nombre: "Cirugía menor",
      descripcion:
        "Realizamos procedimientos quirúrgicos seguros y controlados por profesionales experimentados.",
      imagen:"/img/cirugia.png",
    },
  ];

  return (
    <section
      id="servicios"
      className="relative bg-[url('https://cdn.pixabay.com/photo/2016/11/21/16/03/cows-1846381_1280.jpg')] bg-cover bg-center bg-fixed py-20 px-6 md:px-12 lg:px-24 overflow-hidden"
    >
      {/* Capa oscura */}
      <div className="absolute inset-0 bg-white bg-opacity-60"></div>

      {/* Contenido principal */}
      <div className="relative z-10 text-center text-[#7A8358] mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-extrabold font-[Poppins]"
        >
          Servicios Destacados
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-gray-700 mt-4 text-base md:text-lg max-w-2xl mx-auto"
        >
          Conoce nuestros servicios más destacados, diseñados para brindar el
          mejor cuidado a tus animales.
        </motion.p>
      </div>

      {/* Lista de servicios */}
      <div className="relative z-10 flex flex-col gap-10 max-w-4xl mx-auto">
        {servicios.map((servicio, index) => (
          <motion.div
            key={servicio.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row items-center"
          >
            <img
              src={servicio.imagen}
              alt={servicio.nombre}
              className="w-full md:w-1/3 h-56 object-cover"
            />

            <div className="p-6 text-center md:text-left">
              <h3 className="text-2xl font-bold text-[#7A8358] mb-2 font-[Poppins]">
                {servicio.nombre}
              </h3>
              <p className="text-gray-700">{servicio.descripcion}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Home;
