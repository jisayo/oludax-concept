"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type WishlistContextType = {
  items: string[];
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  count: number;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("oludax_wishlist");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed.filter((id) => typeof id === "string"));
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("oludax_wishlist", JSON.stringify(Array.isArray(items) ? items : []));
    } catch {}
  }, [items]);

  const addItem = useCallback((id: string) => {
    if (!id) return;
    setItems((prev) => {
      const safe = Array.isArray(prev) ? prev : [];
      return safe.includes(id) ? safe : [...safe, id];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    if (!id) return;
    setItems((prev) => {
      const safe = Array.isArray(prev) ? prev : [];
      return safe.filter((item) => item !== id);
    });
  }, []);

  const toggleItem = useCallback((id: string) => {
    if (!id) return;
    setItems((prev) => {
      const safe = Array.isArray(prev) ? prev : [];
      return safe.includes(id) ? safe.filter((item) => item !== id) : [...safe, id];
    });
  }, []);

  const isInWishlist = useCallback(
    (id: string) => (Array.isArray(items) ? items.includes(id) : false),
    [items]
  );

  const safeCount = Array.isArray(items) ? items.length : 0;

  return (
    <WishlistContext.Provider
      value={{ items: Array.isArray(items) ? items : [], addItem, removeItem, toggleItem, isInWishlist, count: safeCount }}
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
