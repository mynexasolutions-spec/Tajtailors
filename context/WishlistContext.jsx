"use client";

import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext(undefined);
const STORAGE_KEY = "amairah-wishlist";

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      console.log("Wishlist: Loaded from localStorage:", saved);
      if (saved) setWishlist(JSON.parse(saved));
    } catch (e) {
      console.error("Wishlist: Error loading from localStorage:", e);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    console.log("Wishlist: Saving to localStorage:", wishlist);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const addToWishlist = (product) => {
    console.log("Wishlist: Adding product:", product);
    setWishlist((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    console.log("Wishlist: Removing product ID:", productId);
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  const toggleWishlist = (product) => {
    console.log("Wishlist: Toggling product:", product);
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      console.log("Wishlist: Product exists in wishlist?", exists);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((p) => p.id === productId);
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
