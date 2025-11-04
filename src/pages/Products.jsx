import React, { useState, useEffect } from "react";
import axios from "axios";

/* 🔹 Modal con zoom por rueda + arrastre */
function ProductModal({ producto, onClose }) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });

  if (!producto) return null;

  /* 🔸 Zoom con la rueda del mouse */
  const handleWheel = (e) => {
    e.preventDefault();
    setZoom((prevZoom) => {
      const newZoom = e.deltaY < 0 ? prevZoom + 0.15 : prevZoom - 0.15;
      return Math.min(Math.max(newZoom, 1), 3); // entre 1x y 3x
    });
  };

  /* 🔸 Arrastre del mouse */
  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    setDragging(true);
    setStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const newX = e.clientX - start.x;
    const newY = e.clientY - start.y;
    const limit = 200 * (zoom - 1);
    setPosition({
      x: Math.max(Math.min(newX, limit), -limit),
      y: Math.max(Math.min(newY, limit), -limit),
    });
  };

  const handleMouseUp = () => setDragging(false);

  /* 🔸 Táctil (para móviles) */
  const handleTouchStart = (e) => {
    if (zoom <= 1) return;
    const touch = e.touches[0];
    setDragging(true);
    setStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;
    const touch = e.touches[0];
    const newX = touch.clientX - start.x;
    const newY = touch.clientY - start.y;
    const limit = 200 * (zoom - 1);
    setPosition({
      x: Math.max(Math.min(newX, limit), -limit),
      y: Math.max(Math.min(newY, limit), -limit),
    });
  };

  const handleTouchEnd = () => setDragging(false);

  /* 🔸 Doble clic para centrar y resetear */
  const handleDoubleClick = () => {
    if (zoom > 1) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setZoom(2);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6 animate-fadeIn"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-7xl w-[90%] flex flex-col md:flex-row overflow-hidden animate-slideInDown">
        {/* Imagen con zoom + pan */}
        <div
          className="md:w-1/2 bg-[#F5F3EE] relative flex items-center justify-center"
          onWheel={handleWheel}
        >
          <div
            className={`overflow-hidden bg-white shadow-md rounded-2xl w-full h-[550px] flex justify-center items-center ${
              zoom > 1 ? "cursor-grab active:cursor-grabbing" : ""
            }`}
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick}
            onTouchStart={handleTouchStart}
          >
            <img
              src={producto.imagen_producto}
              alt={producto.nombre_producto}
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                transition: dragging ? "none" : "transform 0.3s ease-in-out",
              }}
              className="object-contain max-h-[530px] select-none"
              draggable="false"
            />
          </div>
          <p className="absolute bottom-4 right-4 bg-white/90 text-[#4A4A4A] text-sm px-4 py-2 rounded-lg shadow-md">
            Usa la rueda del mouse para hacer zoom · Doble clic para reiniciar
          </p>
        </div>

        {/* Información */}
        <div className="md:w-1/2 p-10 flex flex-col justify-between">
          <div>
            <span className="inline-block bg-[#7A8358]/20 text-[#7A8358] text-xs font-semibold px-3 py-1 rounded-full mb-3">
              Producto agropecuario
            </span>
            <h2 className="text-4xl font-bold text-[#7A8358] mb-3">
              {producto.nombre_producto}
            </h2>
            <p className="text-2xl font-semibold text-[#4A4A4A] mb-4">
              {producto.precio_producto
                ? `${Number(producto.precio_producto).toFixed(2)} USD`
                : "Precio no disponible"}
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              {producto.descripcion_producto ||
                "Este producto no tiene descripción disponible por el momento."}
            </p>

            <div className="bg-[#F5F3EE] p-4 rounded-xl text-sm text-left text-[#4A4A4A] border border-[#e0ded9]">
              <p className="mb-2 font-semibold text-[#7A8358]">🐄 Ideal para:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Granjas, hatos o criaderos</li>
                <li>Uso veterinario especializado</li>
                <li>Animales de producción (bovinos, porcinos, aves, etc.)</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 bg-[#CF0020] text-white font-semibold rounded-xl hover:bg-[#CF4E4E] transition shadow-md hover:shadow-lg"
            >
              ✖ Cerrar
            </button>
            <button
              className="w-full sm:w-auto px-6 py-3 bg-[#69774A] text-[#4A4A4A] font-semibold rounded-xl hover:bg-[#A4BA74] transition shadow-md hover:shadow-lg"
            >
              🛒 Agregar a pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 🔹 Tarjeta de producto estilo Services */
function ProductCard({ producto, onView }) {
  return (
    <div
      className="relative group rounded-2xl overflow-hidden shadow-lg cursor-pointer"
      onClick={() => onView(producto)}
    >
      <img
        src={producto.imagen_producto}
        alt={producto.nombre_producto}
        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center text-center px-6">
        <h3 className="text-2xl font-semibold text-white mb-3">
          {producto.nombre_producto}
        </h3>
        <p className="text-gray-200 mb-4">
          {producto.descripcion_producto?.length > 90
            ? producto.descripcion_producto.slice(0, 90) + "..."
            : producto.descripcion_producto}
        </p>
        <p className="text-xl font-bold text-[#E6E6E6] mb-5">
          {producto.precio_producto
            ? `${Number(producto.precio_producto).toFixed(2)} USD`
            : "Sin precio"}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(producto);
          }}
          className="px-5 py-2 bg-[#7A8358] text-white rounded-xl hover:bg-[#69774a] transition"
        >
          👁️ Ver producto
        </button>
      </div>
      <div className="absolute bottom-0 bg-black/50 text-white w-full py-3 text-lg font-semibold text-center group-hover:opacity-0 transition-opacity duration-300">
        {producto.nombre_producto}
      </div>
    </div>
  );
}

/* 🔹 Página principal */
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

  const handleView = (producto) => {
    setProductoSeleccionado(producto);
    setShowModal(true);
  };

  return (
    <section className="py-16 bg-[#F5F3EE] min-h-screen font-[Poppins]" id="productos">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-[#7A8358] mb-12">
          🐄 Nuestros Productos para tu Granja
        </h2>

        {loading ? (
          <p className="text-center text-gray-600 text-lg animate-pulse">
            Cargando productos...
          </p>
        ) : (
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10">
            {productos.map((p) => (
              <ProductCard key={p.id_producto} producto={p} onView={handleView} />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <ProductModal
          producto={productoSeleccionado}
          onClose={() => setShowModal(false)}
        />
      )}
    </section>
  );
};

export default Products;
