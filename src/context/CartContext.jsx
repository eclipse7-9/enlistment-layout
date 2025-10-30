import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = async (product) => {
    try {
      // 👉 ejemplo: POST a tu API
      const res = await fetch("http://localhost:3000/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!res.ok) throw new Error("Error al agregar al carrito");

      const newItem = await res.json();
      setCart((prev) => [...prev, newItem]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};
