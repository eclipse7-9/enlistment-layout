import React from "react";

function Info() {
  return (
    <section className="info">
      <h2 className="section-title">Sobre Nosotros</h2>
      <div className="info-container">
        <div className="info-text">
          <p>
            En <strong>Pet-Health Services</strong> somos especialistas en el cuidado 
            de animales de granja. Nuestro compromiso es garantizar su salud, bienestar 
            y productividad a través de servicios veterinarios de alta calidad, productos 
            confiables y asesoría profesional.
          </p>
          <p>
            Con años de experiencia en el sector, ayudamos a productores y criadores 
            a mejorar el rendimiento de sus animales, prevenir enfermedades y mantener 
            entornos saludables.
          </p>
        </div>
        <div className="info-image">
          <img
            src="https://www.zoetis.com.co/-/media/project/zoetis/zoetisco/images/bovinos/bovinoshero.jpg"
            alt="Veterinario cuidando animales"
          />
        </div>
      </div>
    </section>
  );
}

export default Info;
