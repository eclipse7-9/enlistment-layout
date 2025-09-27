// src/components/Hero.jsx
function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h2>Cuidado especializado para animales de granja</h2>
        <p>
          En PET-HEALTH SERVICES entendemos que los animales de granja requieren
          atención especializada. Desde vacas y caballos hasta cerdos y aves de
          corral, nuestro equipo de expertos ofrece servicios veterinarios,
          productos y asesoramiento para mantener a tus animales saludables y
          productivos.
        </p>
        <button className="btn btn-primary">¡Conoce nuestros servicios!</button>
      </div>
      <div className="hero-image">
        <img
          src="/logo_pet_transparent-removebg-preview.png"
          alt="Animales de granja - PET HEALTH-SERVICES"
        />
      </div>
    </section>
  );
}

export default Hero;
