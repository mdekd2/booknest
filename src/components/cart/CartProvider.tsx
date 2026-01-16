"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  bookId: string;
  title: string;
  slug: string;
  imageUrl: string;
  priceCents: number;
  currency: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  removeItem: (bookId: string) => void;
  clear: () => void;
  totalItems: number;
  totalCents: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "booknest:cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        setItems([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((entry) => entry.bookId === item.bookId);
      if (existing) {
        return prev.map((entry) =>
          entry.bookId === item.bookId
            ? { ...entry, quantity: entry.quantity + quantity }
            : entry
        );
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((entry) =>
          entry.bookId === bookId ? { ...entry, quantity } : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  };

  const removeItem = (bookId: string) => {
    setItems((prev) => prev.filter((entry) => entry.bookId !== bookId));
  };

  const clear = () => setItems([]);

  const totals = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalCents = items.reduce(
      (sum, item) => sum + item.quantity * item.priceCents,
      0
    );
    return { totalItems, totalCents };
  }, [items]);

  const value = {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clear,
    totalItems: totals.totalItems,
    totalCents: totals.totalCents,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
