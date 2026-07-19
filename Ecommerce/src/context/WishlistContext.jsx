import React, { createContext, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useLocalStorage('verve-wishlist', []);

  const toggleWishlist = (product) => {
    setItems((currentItems) => {
      const exists = currentItems.some((item) => item.id === product.id);

      if (exists) {
        return currentItems.filter((item) => item.id !== product.id);
      }

      return [...currentItems, product];
    });
  };

  const removeFromWishlist = (productId) => setItems((currentItems) => currentItems.filter((item) => item.id !== productId));

  const values = useMemo(
    () => ({
      items,
      wishlistCount: items.length,
      toggleWishlist,
      removeFromWishlist,
      isWishlisted: (productId) => items.some((item) => item.id === productId),
    }),
    [items],
  );

  return <WishlistContext.Provider value={values}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }

  return context;
}