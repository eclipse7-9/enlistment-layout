import React, { useState, useEffect } from "react";
import axios from "axios";
import PaymentModal from "../components/PaymentModal.jsx";
import "../styles/Products.css"

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
    <div className="top-section">
      <div className="side-text">
        <h2 className="inter-font">
          <span className="bold">Find</span>
          <br />
          the best
          <br />
          products for
          <br />
          <span className="bold highlight">your Furries !</span>
        </h2>
      </div>

      <section className="slider-section">
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
            <button
              aria-label="Anterior"
              onClick={() =>
                setCurrentIndex(
                  currentIndex === 0 ? slides.length - 1 : currentIndex - 1
                )
              }
            >
              &lt;
            </button>
            <button
              aria-label="Siguiente"
              onClick={() =>
                setCurrentIndex((currentIndex + 1) % slides.length)
              }
            >
              &gt;
            </button>
          </div>
        </div>

        <div className="slider-dots">
          {slides.map((_, index) => (
            <span
              key={index}
              role="button"
              aria-label={`Ir al slide ${index + 1}`}
              className={`slider-dot ${
                index === currentIndex ? "active" : ""
              }`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      </section>
    </div>
  );
};

// 🧩 Tarjeta de producto
function ProductCard({ producto, usuarioId, onBuy }) {
  return (
    <div className="product-card">
      <img src={producto.imagen_producto} alt={producto.nombre_producto} />
      <div className="product-info">
        <h3>{producto.nombre_producto}</h3>
        <p>
          {producto.precio_producto !== undefined &&
          producto.precio_producto !== null
            ? Number(producto.precio_producto).toFixed(2) + " USD"
            : "Precio no disponible"}
        </p>
      </div>
      <div className="product-buttons">
        {/* 👇 en lugar de comprar directo, abrimos el modal */}
        <button className="btn btn-buy" onClick={() => onBuy(producto)}>
          🛒 Comprar
        </button>
        <button className="btn btn-info">ℹ️ Info</button>
      </div>
    </div>
  );
}

// 🧩 Componente principal
const Products = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // estado para abrir modal
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
    <section className="products">
      <Slider />
      <h2>AQUÍ ENCONTRARÁS LOS MEJORES PRODUCTOS</h2>

      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="product-list">
          {productos.map((p) => (
            <ProductCard
              key={p.id_producto}
              producto={p}
              usuarioId={1} // ⚠️ sustituye con el id real del usuario logueado
              onBuy={handleBuyClick}
            />
          ))}
        </div>
      )}

      {/* 👇 Mostrar modal de pago si hay producto seleccionado */}
      {showModal && (
        <PaymentModal
          producto={productoSeleccionado}
          usuarioId={1} // ⚠️ id real del usuario logueado
          onClose={() => setShowModal(false)}
        />
      )}
    </section>
  );
};

export default Products;
