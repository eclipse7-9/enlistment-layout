import React from "react";
import ServiceCard from "./ServiceCard";

const Home = () => {
  const servicios = [
    { id: 1, nombre: "Vacunación", descripcion: "Protege a tus mascotas." },
    { id: 2, nombre: "Chequeo general", descripcion: "Revisión completa de salud." },
    { id: 3, nombre: "Cirugía menor", descripcion: "Procedimientos seguros y controlados." },
  ];

  return (
    <div className="home">
      <h2>Servicios Destacados</h2>
      <div className="services-container">
        {servicios.map((s) => (
          <ServiceCard key={s.id} nombre={s.nombre} descripcion={s.descripcion} />
        ))}
      </div>
    </div>
  );
};

export default Home;
