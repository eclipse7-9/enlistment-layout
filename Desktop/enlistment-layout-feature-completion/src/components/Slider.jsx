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

  // Cambio automático cada 5 segundos
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
    <section className="bg-[#F9FAF8] py-16">
      <h2 className="text-center text-3xl md:text-4xl font-extrabold text-[#7A8358] mb-8 font-[Poppins]">
        Nuestros Servicios
      </h2>

      <div className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-2xl shadow-lg">
        {/* Slides */}
        <div
          className="flex transition-transform ease-in-out duration-700"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="min-w-full relative flex justify-center items-center"
            >
              <img
                src={slide.src}
                alt={slide.caption}
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute bottom-0 w-full bg-black/40 text-white text-center py-4 text-lg md:text-xl font-semibold">
                {slide.caption}
              </div>
            </div>
          ))}
        </div>

        {/* Botones de navegación */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-[#7A8358] text-white p-3 rounded-full shadow-lg hover:bg-[#5c6343] transition"
          aria-label="Anterior"
        >
          ❮
        </button>

        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-[#7A8358] text-white p-3 rounded-full shadow-lg hover:bg-[#5c6343] transition"
          aria-label="Siguiente"
        >
          ❯
        </button>

        {/* Indicadores (puntos) */}
        <div className="flex justify-center mt-6 space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition ${
                currentIndex === index
                  ? "bg-[#7A8358] scale-110"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Slider;
