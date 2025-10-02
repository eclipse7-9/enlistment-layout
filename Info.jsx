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
        <div className="info-image" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img style={{ width: "400px", height: "400px", borderRadius: "15px" }}
            src="https://www.shutterstock.com/shutterstock/photos/2195513071/display_1500/stock-vector-livestock-protection-icon-save-farm-animal-vet-help-thin-line-web-symbol-on-white-background-2195513071.jpg "
            alt="Veterinario cuidando animales"
          />
        </div>
      </div>
    </section>
  );
}

export default Info;
