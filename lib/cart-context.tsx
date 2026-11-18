"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type CustomizationData = {
  customerName?: string;
  message?: string;
  color?: string;
  designPreference?: string;
  specialInstructions?: string;
  imageUrl?: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  color?: string;
  size?: string;
  customization?: CustomizationData;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  subtotal: number;
  count: number;
  deliveryFee: number;
  total: number;
};

const DELIVERY_FEE = 2500;
const FREE_DELIVERY_THRESHOLD = 50000;

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("oludax_cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem("oludax_cart", JSON.stringify(items));
      } catch {}
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      // If item has customization, always add as new line
      if (item.customization) {
        const uniqueId = `${item.id}-${Date.now()}`;
        return [...prev, { ...item, id: uniqueId, qty }];
      }
      const existing = prev.find(
        (i) => i.id === item.id && !i.customization
      );
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && !i.customization
            ? { ...i, qty: i.qty + qty }
            : i
        );
      }
      return [...prev, { ...item, qty }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        subtotal,
        count,
        deliveryFee,
        total,
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
