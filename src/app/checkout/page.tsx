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
      <div className="rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-[#1f1a17]">
          Sign in to checkout
        </h1>
        <p className="mt-2 text-sm text-[#6b5f54]">
          Create an account or log in to complete your purchase.
        </p>
        <Link
          href="/account"
          className="mt-6 inline-flex rounded-full bg-[#1f3a2f] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#183026]"
        >
          Go to account
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-[#1f1a17]">
          Your cart is empty
        </h1>
        <p className="mt-2 text-sm text-[#6b5f54]">
          Add books to your cart before checking out.
        </p>
        <Link
          href="/books"
          className="mt-6 inline-flex rounded-full bg-[#1f3a2f] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#183026]"
        >
          Browse books
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4 rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-[#1f1a17]">
          Checkout overview
        </h1>
        <ul className="space-y-3 text-sm text-[#6b5f54]">
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
      <aside className="h-fit rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1f1a17]">Total</h2>
        <p className="mt-2 text-2xl font-semibold text-[#1f1a17]">
          {formatPrice(totalCents)}
        </p>
        {error ? (
          <p className="mt-3 text-sm text-[#a54b3c]">{error}</p>
        ) : null}
        <button
          type="button"
          onClick={handleCheckout}
          disabled={loading}
          className="mt-6 inline-flex w-full justify-center rounded-full bg-[#1f3a2f] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#183026] disabled:cursor-not-allowed disabled:bg-[#b9b1a7]"
        >
          {loading ? "Redirecting..." : "Pay with Stripe"}
        </button>
        <p className="mt-2 text-xs text-[#9b8f84]">
          You will be redirected to Stripe Checkout.
        </p>
      </aside>
    </div>
  );
}
