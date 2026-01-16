"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { items, totalCents } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            bookId: item.bookId,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Checkout failed");
      }

      const data = await response.json();
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">
          Sign in to checkout
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Create an account or log in to complete your purchase.
        </p>
        <Link
          href="/account"
          className="mt-6 inline-flex rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Go to account
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">
          Your cart is empty
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Add books to your cart before checking out.
        </p>
        <Link
          href="/books"
          className="mt-6 inline-flex rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Browse books
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          Checkout overview
        </h1>
        <ul className="space-y-3 text-sm text-slate-600">
          {items.map((item) => (
            <li key={item.bookId} className="flex items-center justify-between">
              <span>
                {item.title} × {item.quantity}
              </span>
              <span>
                {formatPrice(item.priceCents * item.quantity, item.currency)}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Total</h2>
        <p className="mt-2 text-2xl font-semibold text-slate-900">
          {formatPrice(totalCents)}
        </p>
        {error ? (
          <p className="mt-3 text-sm text-rose-500">{error}</p>
        ) : null}
        <button
          type="button"
          onClick={handleCheckout}
          disabled={loading}
          className="mt-6 inline-flex w-full justify-center rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? "Redirecting..." : "Pay with Stripe"}
        </button>
        <p className="mt-2 text-xs text-slate-400">
          You will be redirected to Stripe Checkout.
        </p>
      </aside>
    </div>
  );
}
