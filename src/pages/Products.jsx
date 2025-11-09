import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import PaymentModal from "../components/PaymentModal";
import ReceiptToast from "../components/ReceiptToast";

// Helper global para normalizar la URL de la imagen (si es ruta relativa en backend)
const getImageSrc = (img) => {
  if (!img) return 'https://via.placeholder.com/600x400?text=Sin+imagen';
  if (typeof img !== 'string') return String(img);
  if (img.startsWith('data:')) return img;
  if (img.startsWith('http')) return img;
  // si es ruta relativa expuesta por backend, anteponer host
  return `http://localhost:8000${img}`;
};

/* 🔹 Modal con zoom por rueda + arrastre */
function ProductModal({ producto, onClose }) {
  const { cart, addToCart } = useCart();
  const [zoom, setZoom] = useState(1);
  const [showNotification, setShowNotification] = useState(false);

  console.log("Cart context:", { cart, addToCart });
  console.log("Producto en modal:", producto);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (addToCart) {
      addToCart(producto);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    } else {
      console.error("addToCart no está disponible");
    }
  };

  // Si no hay producto o falta información crítica, mostrar mensaje
  if (!producto || !producto.nombre_producto) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6 animate-fadeIn">
        <div className="bg-white rounded-3xl shadow-2xl max-w-7xl w-[90%] p-8 text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Error al cargar el producto</h2>
          <p className="text-gray-600 mb-6">No se pudo cargar la información del producto correctamente.</p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });

  if (!producto) return null;

  /* 🔸 Zoom con la rueda del mouse */
  const handleWheel = (e) => {
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
              src={getImageSrc(producto.imagen_producto)}
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
              onClick={handleAddToCart}
              className="w-full sm:w-auto px-6 py-3 bg-[#69774A] text-white font-semibold rounded-xl hover:bg-[#A4BA74] transition shadow-md hover:shadow-lg"
            >
              🛒 Agregar a pedido
            </button>
          </div>
        </div>
      </div>
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-[#69774A]/90 backdrop-blur-sm text-white px-6 py-4 rounded-2xl shadow-lg animate-slideInUp flex items-center gap-3">
          <div className="bg-white/20 rounded-full p-2">
            <span className="text-xl">✅</span>
          </div>
          <div>
            <p className="font-medium">¡Producto añadido!</p>
            <p className="text-sm text-white/80">Se agregó {producto.nombre_producto} al carrito</p>
          </div>
        </div>
      )}
    </div>
  );
}



/* 🔹 Tarjeta de producto — versión mejorada */
function ProductCard({ producto, onView }) {
  const { addToCart } = useCart();

  const precio = producto.precio_producto
    ? `${Number(producto.precio_producto).toFixed(2)} USD`
    : "Precio no disponible";

  const descripcionCorta = producto.descripcion_producto
    ? producto.descripcion_producto.length > 100
      ? producto.descripcion_producto.slice(0, 100) + "..."
      : producto.descripcion_producto
    : "Sin descripción";

  const estaEnStock = producto.stock !== undefined ? producto.stock > 0 : true;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (addToCart) addToCart(producto);
  };

  return (
    <div
      onClick={() => onView(producto)}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer group"
      role="button"
      tabIndex={0}
      onKeyPress={(e) => { if (e.key === 'Enter') onView(producto); }}
    >
      <div className="relative">
        <img
          src={getImageSrc(producto.imagen_producto)}
          alt={producto.nombre_producto}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Stock badge */}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-medium shadow ${estaEnStock ? 'bg-[#E6F2E1] text-[#2F4532]' : 'bg-red-100 text-red-700'}`}>
          {estaEnStock ? 'En stock' : 'Agotado'}
        </div>

        {/* Price pill */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-[#7A8358] to-[#A4BA74] text-white px-3 py-1 rounded-full text-sm font-semibold shadow">
          {precio}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-[#2F4532]">{producto.nombre_producto}</h3>
        <p className="text-sm text-gray-600 mt-2 min-h-[48px]">{descripcionCorta}</p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); onView(producto); }}
            className="flex-1 px-4 py-2 bg-[#7A8358] text-white rounded-lg font-medium hover:bg-[#69774a] transition"
            aria-label={`Ver ${producto.nombre_producto}`}
          >
            👁️ Ver
          </button>

          <button
            onClick={handleAdd}
            disabled={!estaEnStock}
            className={`px-4 py-2 rounded-lg font-medium transition ${estaEnStock ? 'bg-white border border-[#7A8358] text-[#7A8358] hover:bg-[#F5F7ED]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            aria-label={`Añadir ${producto.nombre_producto} al carrito`}
          >
            🛒 Añadir
          </button>
        </div>
      </div>
    </div>
  );
}

/* 🔹 Página principal */
const Products = () => {
  const { cart } = useCart();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
    const [showPayment, setShowPayment] = useState(false); // State to control payment modal
    const [receiptNotification, setReceiptNotification] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await axios.get("http://localhost:8000/productos/");
        console.log("Productos recibidos:", res.data);
        setProductos(res.data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  // Helper para normalizar la URL de la imagen (si es ruta relativa en backend)
  const getImageSrc = (img) => {
    if (!img) return 'https://via.placeholder.com/600x400?text=Sin+imagen';
    if (typeof img !== 'string') return String(img);
    if (img.startsWith('data:')) return img;
    if (img.startsWith('http')) return img;
    // si es ruta relativa expuesta por backend, anteponer host
    return `http://localhost:8000${img}`;
  };

  const handleView = (producto) => {
    console.log("Producto seleccionado:", producto);
    if (!producto || !producto.id_producto) {
      console.error("Producto inválido:", producto);
      return;
    }
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

      {/* Botón flotante del carrito */}
      <button
        onClick={() => setShowCart(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-[#69774A] hover:bg-[#A4BA74] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group z-40"
      >
        <span className="text-2xl">🛒</span>
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {cart.reduce((total, item) => total + item.cantidad, 0)}
          </span>
        )}
      </button>

      {/* Modal del carrito */}
      {showCart && (
        <CartModal
          onClose={() => setShowCart(false)}
          onCheckout={() => {
            setShowPayment(true);
            setShowCart(false);
          }}
        />
      )}
         {/* Modal de pago */}
          {showPayment && (
            <PaymentModal
              cart={cart}
              onClose={() => setShowPayment(false)}
              onPaymentSuccess={(pedido, recibo) => {
                // Mostrar notificación con recibo y cerrar modal de pago
                console.log("Pago completado", { pedido, recibo });
                setReceiptNotification(recibo);
                setShowPayment(false);
              }}
            />
          )}

          {/* Notificación del recibo */}
          {receiptNotification && (
            <ReceiptToast
              recibo={receiptNotification}
              onClose={() => setReceiptNotification(null)}
            />
          )}
    </section>
  );
};

/* 🔹 Modal del Carrito */
function CartModal({ onClose, onCheckout }) {
  const { cart, removeFromCart, updateQuantity, getTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full">
          <div className="text-center">
            <span className="text-4xl mb-4 block">🛒</span>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-6">¡Agrega algunos productos para empezar!</p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-[#69774A] text-white font-semibold rounded-xl hover:bg-[#A4BA74] transition"
            >
              Seguir comprando
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-[#7A8358]">🛒 Tu Carrito</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.map((item) => (
            <div key={item.id_producto} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
              <img
                src={item.imagen_producto}
                alt={item.nombre_producto}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.nombre_producto}</h3>
                <p className="text-gray-600 text-sm">${Number(item.precio_producto).toFixed(2)} USD</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id_producto, -1)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.cantidad}</span>
                  <button
                    onClick={() => updateQuantity(item.id_producto, 1)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id_producto)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">
                  ${(item.precio_producto * item.cantidad).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold text-[#7A8358]">
              ${getTotal().toFixed(2)} USD
            </span>
          </div>
          <button
            onClick={() => onCheckout?.()}
            className="w-full py-3 bg-[#69774A] text-white font-semibold rounded-xl hover:bg-[#A4BA74] transition"
          >
            Proceder al pago
          </button>
        </div>
      </div>
    </div>
  );
}

export default Products;
