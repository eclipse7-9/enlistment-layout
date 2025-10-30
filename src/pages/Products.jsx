import React, { useState, useEffect } from "react";
import axios from "axios";
import PaymentModal from "../components/PaymentModal.jsx";

// 🧩 Tarjeta de producto con animaciones
function ProductCard({ producto, onBuy }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden transform transition duration-500 hover:-translate-y-3 hover:scale-105 flex flex-col border border-[#E6EED8] animate-fadeInUp">
      <img
        src={producto.imagen_producto}
        alt={producto.nombre_producto}
        className="w-full h-48 object-cover rounded-t-3xl transition-transform duration-500 hover:scale-110"
      />
      <div className="p-4 flex flex-col flex-1 justify-between text-center">
        <div>
          <h3 className="text-[#4A5B2E] font-bold text-lg mb-2 font-[Poppins]">
            {producto.nombre_producto}
          </h3>
          <p className="text-[#7A8358] font-semibold text-xl">
            {producto.precio_producto
              ? `${Number(producto.precio_producto).toFixed(2)} USD`
              : "Precio no disponible"}
          </p>
        </div>

        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={() => onBuy(producto)}
            className="bg-[#7A8358] hover:bg-[#5F6C43] text-white px-5 py-2 rounded-lg font-medium transition shadow-md hover:shadow-xl animate-bounceOnce"
          >
            🛒 Comprar
          </button>
          <button className="bg-[#4A5B2E] hover:bg-[#3D4A25] text-white px-5 py-2 rounded-lg font-medium transition shadow-md hover:shadow-xl animate-bounceOnce">
            ℹ️ Info
          </button>
        </div>
      </div>
    </div>
  );
}

// 🧩 Modal de categorías con animación
function CategoryModal({ onClose, onSelect }) {
  const categorias = ["Comida", "Productos de cuidado animal", "Accesorios"];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 text-center animate-slideInDown">
        <h2 className="text-[#4A5B2E] font-bold text-2xl mb-4">
          Selecciona una categoría
        </h2>
        <div className="flex flex-col gap-3">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className="bg-[#7A8358] hover:bg-[#5F6C43] text-white py-2 rounded-lg font-medium transition"
            >
              {cat}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-5 text-gray-600 hover:text-[#4A5B2E] transition"
        >
          Cerrar
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
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

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

  const handleCategorySelect = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setShowCategoryModal(false);
  };

  const productosFiltrados = categoriaSeleccionada
    ? productos.filter((p) => p.categoria === categoriaSeleccionada)
    : productos;

  return (
    <>
      <section className="relative p-6 md:p-10 font-[Poppins] min-h-screen transition">
        {/* Título y botón */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-md animate-slideInUp">
          <h2 className="text-center text-3xl md:text-4xl font-extrabold text-[#4A5B2E]">
            🐄🐓 Encuentra los{" "}
            <span className="text-[#7A8358]">mejores productos</span> para tu granja
          </h2>
          <button
            onClick={() => setShowCategoryModal(true)}
            className="mt-4 md:mt-0 bg-[#7A8358] hover:bg-[#5F6C43] text-white px-5 py-2 rounded-lg font-medium shadow-md transition animate-bounceOnce"
          >
            Filtrar por categoría
          </button>
        </div>

        {/* Contenido principal */}
        {loading ? (
          <p className="text-center text-gray-600 text-lg animate-pulse">
            Cargando productos...
          </p>
        ) : productosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {productosFiltrados.map((p) => (
              <ProductCard
                key={p.id_producto}
                producto={p}
                onBuy={handleBuyClick}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg mt-10">
            No hay productos en esta categoría.
          </p>
        )}

        {/* Modal de pago */}
        {showModal && (
          <PaymentModal
            producto={productoSeleccionado}
            usuarioId={1}
            onClose={() => setShowModal(false)}
          />
        )}
      </section>

      {/* Modal de categorías */}
      {showCategoryModal && (
        <CategoryModal
          onClose={() => setShowCategoryModal(false)}
          onSelect={handleCategorySelect}
        />
      )}
    </>
  );
};

export default Products;
