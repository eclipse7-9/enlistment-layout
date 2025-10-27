import React, { useState, useEffect } from "react";
import axios from "axios";
import PaymentModal from "../components/PaymentModal.jsx";

const Slider = () => {
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, slides.length]);

  return (
    <div className="flex flex-wrap justify-center items-center gap-5 mb-8">
      <div className="flex-1 min-w-[250px] text-center md:text-left">
        <h2 className="font-inter text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
          <span className="font-bold">Find</span>
          <br />
          the best
          <br />
          products for
          <br />
          <span className="text-[#ff5722] font-bold">your Furries!</span>
        </h2>
      </div>

      <section className="flex-2 min-w-[300px] relative overflow-hidden rounded-xl shadow-md w-full md:w-1/2">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={index} className="min-w-full relative">
                <img
                  src={slide.src}
                  alt={slide.caption}
                  className="w-full rounded-xl"
                />
                <div className="absolute bottom-2 left-3 text-white text-lg font-semibold drop-shadow-md">
                  {slide.caption}
                </div>
              </div>
            ))}
          </div>

          {/* Controles del slider */}
          <div className="absolute top-1/2 left-0 w-full flex justify-between transform -translate-y-1/2 px-2">
            <button
              aria-label="Anterior"
              onClick={() =>
                setCurrentIndex(
                  currentIndex === 0 ? slides.length - 1 : currentIndex - 1
                )
              }
              className="bg-black/50 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg"
            >
              &lt;
            </button>
            <button
              aria-label="Siguiente"
              onClick={() => setCurrentIndex((currentIndex + 1) % slides.length)}
              className="bg-black/50 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg"
            >
              &gt;
            </button>
          </div>
        </div>

        {/* Dots */}
        <div className="text-center mt-3">
          {slides.map((_, index) => (
            <span
              key={index}
              role="button"
              aria-label={`Ir al slide ${index + 1}`}
              onClick={() => setCurrentIndex(index)}
              className={`inline-block w-2.5 h-2.5 mx-1 rounded-full cursor-pointer transition-colors duration-300 ${
                index === currentIndex ? "bg-[#ff5722]" : "bg-gray-400"
              }`}
            ></span>
          ))}
        </div>
      </section>
    </div>
  );
};

// 🧩 Tarjeta de producto
function ProductCard({ producto, onBuy }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-transform duration-200 hover:scale-105 flex flex-col justify-between">
      <img
        src={producto.imagen_producto}
        alt={producto.nombre_producto}
        className="w-full h-44 object-cover"
      />
      <div className="p-3 text-center">
        <h3 className="text-gray-800 font-semibold text-lg mb-1">
          {producto.nombre_producto}
        </h3>
        <p className="text-[#ff5722] font-bold">
          {producto.precio_producto !== undefined &&
          producto.precio_producto !== null
            ? Number(producto.precio_producto).toFixed(2) + " USD"
            : "Precio no disponible"}
        </p>
      </div>
      <div className="flex justify-around p-3">
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md"
          onClick={() => onBuy(producto)}
        >
          🛒 Comprar
        </button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md">
          ℹ️ Info
        </button>
      </div>
    </div>
  );
}

// 🧩 Componente principal
const Products = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await axios.get("http://localhost:8000/productos/");
        setProductos(res.data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const handleBuyClick = (producto) => {
    setProductoSeleccionado(producto);
    setShowModal(true);
  };

  return (
    <section className="p-5 font-inter bg-gray-100 min-h-screen">
      <Slider />
      <h2 className="text-center text-2xl md:text-3xl font-semibold text-gray-800 my-6">
        AQUÍ ENCONTRARÁS LOS MEJORES PRODUCTOS
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Cargando productos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
          {productos.map((p) => (
            <ProductCard
              key={p.id_producto}
              producto={p}
              onBuy={handleBuyClick}
            />
          ))}
        </div>
      )}

      {showModal && (
        <PaymentModal
          producto={productoSeleccionado}
          usuarioId={1}
          onClose={() => setShowModal(false)}
        />
      )}
    </section>
  );
};

export default Products;
