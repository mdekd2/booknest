"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/format";
import { useClientTranslator } from "@/lib/i18n/client";

export default function CartPage() {
  const { items, totalCents, updateQuantity, removeItem } = useCart();
  const [pending, setPending] = useState<string | null>(null);
  const { t } = useClientTranslator();

  if (items.length === 0) {
    return (
      <div className="space-y-4 rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-10 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-[#1f1a17]">
          {t("cart.title")}
        </h1>
        <p className="text-sm text-[#6b5f54]">{t("cart.empty")}</p>
        <Link
          href="/books"
          className="inline-flex rounded-full bg-[#1f3a2f] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#183026]"
        >
          {t("cart.browse")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-[#1f1a17]">
          {t("cart.title")}
        </h1>
        <p className="text-sm text-[#6b5f54]">{t("cart.review")}</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.bookId}
              className="flex flex-col gap-4 rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-4 shadow-sm sm:flex-row sm:items-center"
            >
              <div className="relative h-32 w-24 overflow-hidden rounded-2xl bg-[#f3ebe1]">
                {item.imageUrl && !item.imageUrl.includes("placeholder") ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <h2 className="text-lg font-semibold text-[#1f1a17]">
                    {item.title}
                  </h2>
                  <p className="text-sm text-[#6b5f54]">
                    {formatPrice(item.priceCents)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-[#6b5f54]">
                    {t("cart.qty")}
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
                      className="ml-2 w-20 rounded-md border border-[#e6dccf] bg-white/80 px-2 py-1 text-sm"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => removeItem(item.bookId)}
                    className="text-sm font-medium text-[#a54b3c] hover:text-[#8e3e31]"
                  >
                    {t("cart.remove")}
                  </button>
                </div>
              </div>
              <p className="text-right text-sm font-semibold text-[#2c2a25]">
                {formatPrice(
                  item.priceCents * item.quantity,
                  item.currency
                )}
              </p>
            </div>
          ))}
        </div>
        <aside className="h-fit rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1f1a17]">
            {t("cart.summary")}
          </h2>
          <div className="mt-4 flex items-center justify-between text-sm text-[#6b5f54]">
            <span>{t("cart.subtotal")}</span>
            <span>{formatPrice(totalCents)}</span>
          </div>
          <p className="mt-2 text-xs text-[#9b8f84]">
            {t("cart.taxes")}
          </p>
          <Link
            href="/checkout"
            className="mt-6 inline-flex w-full justify-center rounded-full bg-[#1f3a2f] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#183026]"
          >
            {t("cart.checkout")}
          </Link>
        </aside>
      </div>
    </div>
  );
}
