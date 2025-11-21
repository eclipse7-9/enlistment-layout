import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    if (!product) {
      console.error('Intento de añadir un producto nulo al carrito');
      return;
    }
    console.log('Añadiendo al carrito:', product);
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id_producto === product.id_producto);
      
      if (existingItem) {
        // Si el producto ya existe, incrementar cantidad
        return prevCart.map(item =>
          item.id_producto === product.id_producto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      
      // Si es un producto nuevo, añadirlo con cantidad 1
      return [...prevCart, { ...product, cantidad: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id_producto !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id_producto === productId) {
          const newQuantity = item.cantidad + delta;
          // Si la cantidad llega a 0 o menos, el producto se elimina
          if (newQuantity <= 0) {
            return null;
          }
          return { ...item, cantidad: newQuantity };
        }
        return item;
      }).filter(Boolean); // Eliminar productos con cantidad 0
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.precio_producto * item.cantidad), 0);
  };

  const value = {
    cart, 
    addToCart, 
    removeFromCart, 
    updateQuantity,
    clearCart,
    getTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
