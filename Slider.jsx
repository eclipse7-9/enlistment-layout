import React from "react";

function Slider() {
  return (
    <section className="slider-section">
      <h2 className="section-title">Nuestros Servicios</h2>
      <div className="slider-container">
        <div className="slider-wrapper">
          <div className="slider-item">
            <img
              src="https://a.storyblok.com/f/160385/312f6d02d3/veterinarios-bienestar-animal-produccion-leche.jpeg"
              alt="Atención veterinaria para animales de granja"
            />
            <div className="slider-caption">Atención veterinaria especializada</div>
          </div>
          <div className="slider-item">
            <img
              src="https://cdn.shopify.com/s/files/1/0560/3241/files/Kibble-01_grande.jpg?13060827728408065915"
              alt="Productos para el cuidado de animales de granja"
            />
            <div className="slider-caption">Productos de calidad para el cuidado animal</div>
          </div>
          <div className="slider-item">
            <img
              src="https://cdn.shopify.com/s/files/1/0268/6861/files/barn-pet-livestock-horse-mammal-stallion-882743-pxhere.com_grande.jpg?v=1555683961"
              alt="Servicios médicos para animales de granja"
            />
            <div className="slider-caption">Servicios médicos completos</div>
          </div>
          <div className="slider-item">
            <img
              src="https://cdn.shopify.com/s/files/1/0268/6861/files/0e7bc06d19c38d8aec36b674af99cd7d_grande.jpg?v=1546178523"
              alt="Ubicación de nuestras clínicas veterinarias"
            />
            <div className="slider-caption">Múltiples ubicaciones para tu conveniencia</div>
          </div>
        </div>

        <div className="slider-controls">
          <button className="slider-prev" aria-label="Imagen anterior">
            &lt;
          </button>
          <button className="slider-next" aria-label="Siguiente imagen">
            &gt;
          </button>
        </div>
      </div>

      <div className="slider-dots">
        <span className="slider-dot active" data-slide="0"></span>
        <span className="slider-dot" data-slide="1"></span>
        <span className="slider-dot" data-slide="2"></span>
        <span className="slider-dot" data-slide="3"></span>
      </div>
    </section>
  );
}

export default Slider;
