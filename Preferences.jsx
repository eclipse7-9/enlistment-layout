import React from "react";

function Preferences() {
  return (
    <section className="preferences">
      <h2 className="section-title">¿Por qué elegirnos?</h2>
      <div className="preferences-container">
        <div className="preference-card">
          <img
            src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
            alt="Experiencia"
          />
          <h3>Experiencia</h3>
          <p>Contamos con un equipo de veterinarios altamente capacitados.</p>
        </div>

        <div className="preference-card">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png"
            alt="Calidad"
          />
          <h3>Calidad</h3>
          <p>
            Ofrecemos servicios y productos de calidad para garantizar la salud
            animal.
          </p>
        </div>

        <div className="preference-card">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3068/3068307.png"
            alt="Atención personalizada"
          />
          <h3>Atención Personalizada</h3>
          <p>Brindamos soluciones adaptadas a las necesidades de cada cliente.</p>
        </div>
      </div>
    </section>
  );
}

export default Preferences;
