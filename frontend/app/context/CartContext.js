"use client";
// context/CartContext.js
import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [reloadKey, setReloadKey] = useState(1);

  const addToCart = (item, qty, price) => {
    let newCart = [...cart];
    for (let index = 0; index < qty; index++) {
      newCart.push([item, price]);
    }
    setCart(newCart);
    setReloadKey(Math.random());
  };

  const removeFromCart = (item, qty) => {
    let newCart = [...cart];
    const index = newCart.findIndex(([cartItem]) => cartItem === item);
    if (index !== -1) {
      newCart.splice(index, 1);
    }
    setCart(newCart);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
