"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";

type AddToCartButtonProps = {
  book: {
    id: string;
    title: string;
    slug: string;
    imageUrl: string;
    priceCents: number;
    currency: string;
    stock: number;
  };
  labels?: {
    add?: string;
    outOfStock?: string;
    added?: string;
  };
};

export function AddToCartButton({ book, labels }: AddToCartButtonProps) {
  const { addItem, items } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showAdded, setShowAdded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const current = items.find((item) => item.bookId === book.id);
  const inCart = current?.quantity ?? 0;
  const remaining = book.stock - inCart;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleAdd = () => {
    if (remaining <= 0) {
      return;
    }
    setIsAdding(true);
    addItem(
      {
        bookId: book.id,
        title: book.title,
        slug: book.slug,
        imageUrl: book.imageUrl,
        priceCents: book.priceCents,
        currency: book.currency,
      },
      1
    );
    setIsAdding(false);
    setShowAdded(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setShowAdded(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleAdd}
        disabled={remaining <= 0 || isAdding}
        className="rounded-full bg-[#1f3a2f] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#183026] disabled:cursor-not-allowed disabled:bg-[#b9b1a7]"
      >
        {remaining <= 0
          ? labels?.outOfStock ?? "Out of stock"
          : labels?.add ?? "Add to cart"}
      </button>
      {showAdded ? (
        <p className="text-xs font-semibold text-[#1f3a2f]">
          {labels?.added ?? "Added to cart"}
        </p>
      ) : null}
    </div>
  );
}
