"use client";

import { useState } from "react";
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
  };
};

export function AddToCartButton({ book, labels }: AddToCartButtonProps) {
  const { addItem, items } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const current = items.find((item) => item.bookId === book.id);
  const inCart = current?.quantity ?? 0;
  const remaining = book.stock - inCart;

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
  };

  return (
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
  );
}
