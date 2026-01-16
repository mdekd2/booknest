"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";

export function CartButton() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300"
    >
      Cart
      {totalItems > 0 ? (
        <span className="absolute -right-2 -top-2 rounded-full bg-indigo-600 px-2 py-0.5 text-xs text-white">
          {totalItems}
        </span>
      ) : null}
    </Link>
  );
}
