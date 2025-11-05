import React, { useState, useEffect } from "react";

function Slider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const slides = [
    {
      src: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb",
      caption: "Atención veterinaria especializada",
    },
    {
      src: "https://images.unsplash.com/photo-1560807707-8cc77767d783",
      caption: "Productos de calidad para el cuidado animal",
    },
    {
      src: "https://images.unsplash.com/photo-1555685812-ef43c6c4b49a",
      caption: "Servicios médicos completos",
    },
    {
      src: "https://images.unsplash.com/photo-1603232644142-03e08874b1e3",
      caption: "Múltiples ubicaciones para tu conveniencia",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const prevSlide = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      setFade(true);
    }, 300);
  };

  const nextSlide = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      setFade(true);
    }, 300);
  };

  const goToSlide = (index) => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setFade(true);
    }, 300);
  };

  return (
    <section className="relative w-full h-[500px] overflow-hidden bg-[#F9FAF8]">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.src}
            alt={slide.caption}
            className={`w-full h-full object-cover transform transition-transform duration-700 ${
              fade ? "scale-100" : "scale-105"
            }`}
          />

          {/* Overlay oscuro */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div
              className={`text-center text-white px-6 md:px-12 transition-all duration-700 ${
                fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
            >
              <h2 className="text-2xl md:text-4xl font-bold mb-4 font-[Poppins] drop-shadow-lg">
                {slide.caption}
              </h2>
              <button className="mt-4 px-5 py-2 bg-[#7A8358] hover:bg-[#5c6343] text-white rounded-full shadow-md text-base md:text-lg transition">
                Conoce más
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Botones de navegación */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-6 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-4 rounded-full shadow-lg hover:scale-110 hover:bg-[#7A8358]/70 transition"
      >
        ❮
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-6 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-4 rounded-full shadow-lg hover:scale-110 hover:bg-[#7A8358]/70 transition"
      >
        ❯
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-6 w-full flex justify-center space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? "bg-[#7A8358] scale-125 shadow-md"
                : "bg-gray-300 hover:bg-gray-400 scale-100"
            }`}
          ></button>
        ))}
      </div>
    </section>
  );
}

export default Slider;
