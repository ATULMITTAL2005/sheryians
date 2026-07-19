import React, { createContext, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage('verve-cart', []);

  const addToCart = (product, quantity = 1) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.product.id === product.id);

      if (!existingItem) {
        return [...currentItems, { product, quantity }];
      }

      return currentItems.map((item) =>
        item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
      );
    });
  };

  const updateQuantity = (productId, quantity) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.product.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (productId) => setItems((currentItems) => currentItems.filter((item) => item.product.id !== productId));
  const clearCart = () => setItems([]);

  const values = useMemo(() => {
    const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    const shipping = items.length ? 12 : 0;
    const tax = Math.round(subtotal * 0.08);

    return {
      items,
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      isInCart: (productId) => items.some((item) => item.product.id === productId),
    };
  }, [items]);

  return <CartContext.Provider value={values}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}