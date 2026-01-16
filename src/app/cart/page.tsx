"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, totalCents, updateQuantity, removeItem } = useCart();
  const [pending, setPending] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Your cart</h1>
        <p className="text-sm text-slate-500">
          Your cart is empty. Browse the collection to add books.
        </p>
        <Link
          href="/books"
          className="inline-flex rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Browse books
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">Your cart</h1>
        <p className="text-sm text-slate-500">
          Review your selections before checkout.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.bookId}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center"
            >
              <div className="relative h-32 w-24 overflow-hidden rounded-lg bg-slate-100">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {item.title}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {formatPrice(item.priceCents, item.currency)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-slate-600">
                    Qty
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      disabled={pending === item.bookId}
                      onChange={(event) => {
                        const value = Number(event.target.value);
                        setPending(item.bookId);
                        updateQuantity(item.bookId, value);
                        setPending(null);
                      }}
                      className="ml-2 w-20 rounded-md border border-slate-200 px-2 py-1 text-sm"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => removeItem(item.bookId)}
                    className="text-sm font-medium text-rose-500 hover:text-rose-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <p className="text-right text-sm font-semibold text-slate-700">
                {formatPrice(
                  item.priceCents * item.quantity,
                  item.currency
                )}
              </p>
            </div>
          ))}
        </div>
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
          <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
            <span>Subtotal</span>
            <span>{formatPrice(totalCents)}</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Taxes and shipping are calculated at checkout.
          </p>
          <Link
            href="/checkout"
            className="mt-6 inline-flex w-full justify-center rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Proceed to checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
