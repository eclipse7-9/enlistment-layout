// src/components/Services.jsx
import React from "react";
import "./Services.css"; // importa los estilos

const Services = () => {
  return (
    <section className="services">
      <h2 className="section-title">Nuestros Servicios</h2>
      <div className="service-options">
        {/* Card 1 */}
        <div className="service-card">
          <img
            src="https://lafinquita.com.co/wp-content/uploads/2022/10/concentradosportada-1024x535.png"
            alt="Productos para animales de granja"
          />
          <div className="service-card-content">
            <h3>Productos Especializados</h3>
            <p>
              Encuentra alimentos, suplementos, medicamentos y equipos
              específicos para cada tipo de animal de granja. Desde alimentos
              balanceados para vacas lecheras hasta vitaminas para aves de
              corral.
            </p>
            <a href="productos.html" className="btn btn-pro">
              Ver productos
            </a>
          </div>
        </div>

        {/* Card 2 */}
        <div className="service-card">
          <img
            src="https://axoncomunicacion.net/wp-content/uploads/2021/12/young-male-worker-of-large-animal-farm-sitting-on-squats-by-paddock-with-purebred-cattle-and-examining-one-of-several-black-and-white-cows.jpg"
            alt="Servicios médicos para animales de granja"
          />
          <div className="service-card-content">
            <h3>Servicios Médicos</h3>
            <p>
              Ofrecemos consultas veterinarias, vacunación, cirugías, cuidados
              preventivos y programas de salud reproductiva para maximizar el
              bienestar y productividad de tus animales.
            </p>
            <a href="servicios.html" className="btn btn-med">
              Servicios médicos
            </a>
          </div>
        </div>

        {/* Card 3 */}
        <div className="service-card">
          <img
            src="https://www.infobae.com/resizer/v2/7KASHDCRXVFJHNJG7TOTLDEFPU.jpeg?auth=9d8836631b12668690e7e2d0bdf6e7bf7d803ec18da153a43c36070045918232&smart=true&width=1200&height=900&quality=85"
            alt="Ubicación de nuestras clínicas"
          />
          <div className="service-card-content">
            <h3>Nuestras Ubicaciones</h3>
            <p>
              Contamos con clínicas en zonas rurales estratégicas y servicio a
              domicilio para granjas. Encuentra la ubicación más cercana y
              nuestros horarios de atención extendidos.
            </p>
            <a href="ubicaciones.html" className="btn btn-ubi">
              Ver ubicaciones
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
