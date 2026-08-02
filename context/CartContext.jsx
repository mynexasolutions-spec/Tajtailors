"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(undefined);
const STORAGE_KEY = "amairah-cart";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setCart(JSON.parse(saved));
    } catch (e) {
      // ignore corrupt cart data
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  // Most cart items are keyed by their real variantId. Composite "stitching"
  // items (outfit + fabric + measurements) carry their own `cartKey` instead,
  // since several distinct configurations can share the same underlying
  // outfit variantId — the DB foreign key stays correct while the cart still
  // treats each configuration as a separate line.
  const keyOf = (item) => item.cartKey || item.variantId;

  const addToCart = (item, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => keyOf(i) === keyOf(item));
      if (existing) {
        return prev.map((i) =>
          keyOf(i) === keyOf(item) ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
    setDrawerOpen(true);
  };

  const removeFromCart = (cartKey) => {
    setCart((prev) => prev.filter((i) => keyOf(i) !== cartKey));
  };

  const updateQuantity = (cartKey, quantity) => {
    if (quantity <= 0) return removeFromCart(cartKey);
    setCart((prev) => prev.map((i) => (keyOf(i) === cartKey ? { ...i, quantity } : i)));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        drawerOpen,
        setDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
