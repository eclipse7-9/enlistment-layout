// src/components/Hero.jsx
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="bg-[#F5F3EE] flex flex-col md:flex-row items-center justify-between px-8 md:px-16 lg:px24 py-16 md:py-24">
      <div className="md:w-1/2 text-center md:text-left">
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#7A8358] leading-tight font-[Poppins]">Cuidado especializado para animales de granja</h2>
        <p className="mt-6 text-gray-700 text-base md:text-lg leading-relaxed">
          En <span className="font-semibold text-[#7A8358]">PET-HEALTH SERVICES</span> entendemos que los animales de granja requieren
          atención especializada. Desde vacas y caballos hasta cerdos y aves de
          corral, nuestro equipo de expertos ofrece servicios veterinarios,
          productos y asesoramiento para mantener a tus animales saludables y
          productivos.
        </p>
  <Link to="/reservar-servicios" className="btn btn-primary inline-block text-center">¡Conoce nuestros servicios!</Link>
      </div>
      <div className="hero-image">
        <img
          src="/img/logo.png"
          alt="Animales de granja - PET HEALTH-SERVICES"
          className="w-60 h-auto mx-auto my-10 block rounded-xl"
        />
      </div>
    </section>
  );
}

export default Hero;


