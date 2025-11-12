// src/components/Services.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Services = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNavigation = (path) => {
    if (user) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  const servicios = [
    {
      id: 1,
      titulo: "Productos Especializados",
      descripcion:
        "Encuentra alimentos, suplementos, medicamentos y equipos para cada tipo de animal de granja.",
      imagen:
        "https://lafinquita.com.co/wp-content/uploads/2022/10/concentradosportada-1024x535.png",
      path: "/productos",
      boton: "Ver productos",
    },
    {
      id: 2,
      titulo: "Servicios Médicos",
      descripcion:
        "Consultas veterinarias, vacunación, cirugías y programas de salud reproductiva para tus animales.",
      imagen:
        "https://axoncomunicacion.net/wp-content/uploads/2021/12/young-male-worker-of-large-animal-farm-sitting-on-squats-by-paddock-with-purebred-cattle-and-examining-one-of-several-black-and-white-cows.jpg",
      path: "/reservar-servicios",
      boton: "Servicios médicos",
    },
    {
      id: 3,
      titulo: "Nuestras Ubicaciones",
      descripcion:
        "Clínicas rurales estratégicas y servicio a domicilio para granjas. Encuentra la más cercana.",
      imagen:
        "https://www.infobae.com/resizer/v2/7KASHDCRXVFJHNJG7TOTLDEFPU.jpeg?auth=9d8836631b12668690e7e2d0bdf6e7bf7d803ec18da153a43c36070045918232&smart=true&width=1200&height=900&quality=85",
      path: "/ubicaciones",
      boton: "Ver ubicaciones",
    },
  ];

  return (
    <section className="py-16 bg-[#F5F3EE]" id="servicios">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-[#7A8358] mb-12">
          Nuestros Servicios
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {servicios.map((servicio) => (
            <div
              key={servicio.id}
              className="relative group rounded-2xl overflow-hidden shadow-lg cursor-pointer"
            >
              {/* Imagen principal */}
              <img
                src={servicio.imagen}
                alt={servicio.titulo}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Capa superpuesta al hacer hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center text-center px-6">
                <h3 className="text-2xl font-semibold text-white mb-3">
                  {servicio.titulo}
                </h3>
                <p className="text-gray-200 mb-5">{servicio.descripcion}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigation(servicio.path);
                  }}
                  className="px-5 py-2 bg-[#7A8358] text-white rounded-xl hover:bg-[#69774a] transition"
                >
                  {servicio.boton}
                </button>
              </div>

              {/* Título visible siempre (parte inferior) */}
              <div className="absolute bottom-0 bg-black/50 text-white w-full py-3 text-lg font-semibold text-center group-hover:opacity-0 transition-opacity duration-300">
                {servicio.titulo}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
