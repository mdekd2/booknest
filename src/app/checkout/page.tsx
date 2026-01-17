"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/format";
import { useClientTranslator } from "@/lib/i18n/client";
import { buildWhatsAppLink, manualPayments } from "@/lib/payments/manual";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { items, totalCents } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const { t } = useClientTranslator();

  const handleCheckout = async () => {
    setError(null);
    setNotice(null);
    setLoading(true);

    try {
      const response = await fetch("/api/orders/manual", {
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
      const message = `${t("home.badge")} - ${t("checkout.overview")} #${
        data.orderId
      }\n${items
        .map(
          (item: { title: string; quantity: number }) =>
            `${item.title} × ${item.quantity}`
        )
        .join(", ")}\n${t("checkout.total")}: ${formatPrice(
        totalCents
      )}\n${t("checkout.whatsappHint")}`;
      window.location.href = buildWhatsAppLink(message);
      setNotice(t("checkout.orderCreated"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-[#1f1a17]">
          {t("checkout.signInTitle")}
        </h1>
        <p className="mt-2 text-sm text-[#6b5f54]">
          {t("checkout.signInSubtitle")}
        </p>
        <Link
          href="/account"
          className="mt-6 inline-flex rounded-full bg-[#1f3a2f] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#183026]"
        >
          {t("checkout.goToAccount")}
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-[#1f1a17]">
          {t("checkout.emptyTitle")}
        </h1>
        <p className="mt-2 text-sm text-[#6b5f54]">
          {t("checkout.emptySubtitle")}
        </p>
        <Link
          href="/books"
          className="mt-6 inline-flex rounded-full bg-[#1f3a2f] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#183026]"
        >
          {t("cart.browse")}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6 rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-[#1f1a17]">
          {t("checkout.overview")}
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
        <div className="rounded-2xl border border-[#e6dccf] bg-white/70 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#6b5f54]">
            {t("checkout.manualTitle")}
          </h2>
          <p className="mt-2 text-sm text-[#6b5f54]">
            {t("checkout.manualSubtitle")}
          </p>
          <div className="mt-4 grid gap-3 text-sm text-[#1f1a17] sm:grid-cols-3">
            <div className="rounded-2xl border border-[#e6dccf] bg-[#fffaf4] p-3">
              <p className="text-xs uppercase text-[#6b5f54]">
                {t("checkout.methodBankily")}
              </p>
              <p className="mt-1 font-semibold">{manualPayments.bankily}</p>
            </div>
            <div className="rounded-2xl border border-[#e6dccf] bg-[#fffaf4] p-3">
              <p className="text-xs uppercase text-[#6b5f54]">
                {t("checkout.methodSedad")}
              </p>
              <p className="mt-1 font-semibold">{manualPayments.sedad}</p>
            </div>
            <div className="rounded-2xl border border-[#e6dccf] bg-[#fffaf4] p-3">
              <p className="text-xs uppercase text-[#6b5f54]">
                {t("checkout.methodMasrivi")}
              </p>
              <p className="mt-1 font-semibold">{manualPayments.masrivi}</p>
            </div>
          </div>
        </div>
      </div>
      <aside className="h-fit rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1f1a17]">
          {t("checkout.total")}
        </h2>
        <p className="mt-2 text-2xl font-semibold text-[#1f1a17]">
          {formatPrice(totalCents)}
        </p>
        {notice ? (
          <p className="mt-3 text-sm text-[#1f3a2f]">{notice}</p>
        ) : null}
        {error ? (
          <p className="mt-3 text-sm text-[#a54b3c]">{error}</p>
        ) : null}
        <button
          type="button"
          onClick={handleCheckout}
          disabled={loading}
          className="mt-6 inline-flex w-full justify-center rounded-full bg-[#1f3a2f] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#183026] disabled:cursor-not-allowed disabled:bg-[#b9b1a7]"
        >
          {loading ? t("checkout.redirecting") : t("checkout.pay")}
        </button>
        <p className="mt-2 text-xs text-[#9b8f84]">
          {t("checkout.stripeNote")}
        </p>
      </aside>
    </div>
  );
}
