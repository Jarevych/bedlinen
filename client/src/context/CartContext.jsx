// // src/context/CartContext.jsx
// import React, { createContext, useState, useEffect } from "react";

// export const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem("cart") || "[]");
//     } catch {
//       return [];
//     }
//   });

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   const addToCart = (item) => {
//     setCart((prev) => [...prev, item]);
//   };
//   const updateCartItem = (id, patch) => {
//     setCart((prev) =>
//       prev.map((i) => (i._id === id ? { ...i, ...patch } : i))
//     );
//   };
  
//   const removeFromCart = (id) => {
//     setCart((prev) => prev.filter((item) => item._id !== id));
//   };

//   const clearCart = () => setCart([]);

//   return (
//     <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateCartItem }}>
//       {children}
//     </CartContext.Provider>
//   );
// };
import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  const updateCartItem = (id, patch) => {
    setCart((prev) =>
      prev.map((i) => (i._id === id ? { ...i, ...patch } : i))
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateCartItem, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
