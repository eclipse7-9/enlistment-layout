import React from "react";
import { useCart } from "../context/CartContext";

function CarritoModal({ onClose }) {
  const { cart, updateQuantity, removeFromCart, getTotal } = useCart();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6">
        <h2 className="text-3xl font-bold mb-6">🛒 Tu Carrito</h2>

        {cart.length === 0 ? (
          <p>El carrito está vacío.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id_producto}
                className="flex justify-between items-center border-b pb-3"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.imagen_producto || 'https://via.placeholder.com/80'}
                    alt={item.nombre_producto}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">{item.nombre_producto}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => updateQuantity(item.id_producto, -1)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span>{item.cantidad}</span>
                      <button
                        onClick={() => updateQuantity(item.id_producto, 1)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id_producto)}
                        className="ml-2 text-red-500 hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
                <p className="font-bold">
                  ${(item.precio_producto * item.cantidad).toFixed(2)}
                </p>
              </div>
            ))}

            <div className="flex justify-between font-bold text-xl border-t pt-4">
              <span>Total:</span>
              <span>${getTotal().toFixed(2)}</span>
            </div>

            <button
              onClick={onClose}
              className="mt-4 w-full py-3 bg-[#CF0020] text-white rounded-xl hover:bg-[#CF4E4E]"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CarritoModal;
