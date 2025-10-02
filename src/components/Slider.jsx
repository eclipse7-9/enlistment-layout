import React, { useState, useEffect } from "react";

function Slider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = [
    {
      src: "https://a.storyblok.com/f/160385/312f6d02d3/veterinarios-bienestar-animal-produccion-leche.jpeg",
      caption: "Atención veterinaria especializada",
    },
    {
      src: "https://cdn.shopify.com/s/files/1/0560/3241/files/Kibble-01_grande.jpg?13060827728408065915",
      caption: "Productos de calidad para el cuidado animal",
    },
    {
      src: "https://cdn.shopify.com/s/files/1/0268/6861/files/barn-pet-livestock-horse-mammal-stallion-882743-pxhere.com_grande.jpg?v=1555683961",
      caption: "Servicios médicos completos",
    },
    {
      src: "https://cdn.shopify.com/s/files/1/0268/6861/files/0e7bc06d19c38d8aec36b674af99cd7d_grande.jpg?v=1546178523",
      caption: "Múltiples ubicaciones para tu conveniencia",
    },
  ];

  // Cambiar slide automáticamente cada 5s
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className="slider-section">
      <h2 className="section-title">Nuestros Servicios</h2>
      <div className="slider-container">
        <div
          className="slider-wrapper"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div className="slider-item" key={index}>
              <img src={slide.src} alt={slide.caption} />
              <div className="slider-caption">{slide.caption}</div>
            </div>
          ))}
        </div>

        <div className="slider-controls">
          <button className="slider-prev" onClick={prevSlide} aria-label="Anterior">
            &lt;
          </button>
          <button className="slider-next" onClick={nextSlide} aria-label="Siguiente">
            &gt;
          </button>
        </div>
      </div>

      <div className="slider-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`slider-dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </section>
  );
}

export default Slider;
