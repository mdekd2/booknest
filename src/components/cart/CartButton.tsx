"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";

export function CartButton({ label = "Cart" }: { label?: string }) {
  const { totalItems } = useCart();

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center gap-2 rounded-full border border-[#e6dccf] bg-white/60 px-4 py-2 text-sm font-medium text-[#6b5f54] shadow-sm transition hover:border-[#d6c8b9] hover:text-[#1f1a17]"
    >
      {label}
      {totalItems > 0 ? (
        <span className="absolute -right-2 -top-2 rounded-full bg-[#1f3a2f] px-2 py-0.5 text-xs text-white shadow-sm">
          {totalItems}
        </span>
      ) : null}
    </Link>
  );
}
