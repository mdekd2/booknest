"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { CartButton } from "@/components/cart/CartButton";
import { LanguageSwitcher } from "./LanguageSwitcher";

type HeaderLabels = {
  books: string;
  orders: string;
  account: string;
  admin: string;
  cart: string;
  login: string;
  logout: string;
  language: string;
};

export function Header({
  labels,
  locale,
}: {
  labels: HeaderLabels;
  locale: string;
}) {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-[#e6dccf] bg-[#fffaf4]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative h-11 w-11 overflow-hidden rounded-2xl border border-[#e6dccf] bg-[#f3ebe1] shadow-sm">
            <Image
              src="/images/logo.png"
              alt="BookNest logo"
              fill
              className="object-cover"
              priority
            />
          </span>
          <span className="text-xl font-semibold text-[#1f1a17]">BookNest</span>
        </Link>
        <nav className="hidden items-center gap-4 text-sm text-[#6b5f54] md:flex">
          <Link href="/books" className="hover:text-[#1f1a17]">
            {labels.books}
          </Link>
          <Link href="/orders" className="hover:text-[#1f1a17]">
            {labels.orders}
          </Link>
          <Link href="/account" className="hover:text-[#1f1a17]">
            {labels.account}
          </Link>
          {role === "ADMIN" ? (
            <Link href="/admin" className="hover:text-[#1f1a17]">
              {labels.admin}
            </Link>
          ) : null}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher locale={locale} label={labels.language} />
          <CartButton label={labels.cart} />
          {session ? (
            <button
              onClick={async () => {
                try {
                  await signOut({ callbackUrl: "/" });
                } catch {
                  window.location.href = "/api/auth/signout?callbackUrl=/";
                }
              }}
              className="rounded-full border border-[#e6dccf] px-4 py-2 text-sm font-medium text-[#6b5f54] hover:border-[#d6c8b9] hover:text-[#1f1a17]"
            >
              {labels.logout}
            </button>
          ) : (
            <Link
              href="/account"
              className="rounded-full border border-[#e6dccf] px-4 py-2 text-sm font-medium text-[#6b5f54] hover:border-[#d6c8b9] hover:text-[#1f1a17]"
            >
              {labels.login}
            </Link>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="rounded-full border border-[#e6dccf] p-2 text-[#6b5f54] md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <span className="block h-0.5 w-5 bg-current" />
          <span className="mt-1 block h-0.5 w-5 bg-current" />
          <span className="mt-1 block h-0.5 w-5 bg-current" />
        </button>
      </div>
      {open ? (
        <div className="border-t border-[#e6dccf] bg-[#fffaf4] px-4 pb-4 md:hidden">
          <nav className="mt-4 flex flex-col gap-3 text-sm text-[#6b5f54]">
            <Link href="/books" className="hover:text-[#1f1a17]">
              {labels.books}
            </Link>
            <Link href="/orders" className="hover:text-[#1f1a17]">
              {labels.orders}
            </Link>
            <Link href="/account" className="hover:text-[#1f1a17]">
              {labels.account}
            </Link>
            {role === "ADMIN" ? (
              <Link href="/admin" className="hover:text-[#1f1a17]">
                {labels.admin}
              </Link>
            ) : null}
          </nav>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <LanguageSwitcher locale={locale} label={labels.language} />
            <CartButton label={labels.cart} />
            {session ? (
              <button
                onClick={async () => {
                  try {
                    await signOut({ callbackUrl: "/" });
                  } catch {
                    window.location.href = "/api/auth/signout?callbackUrl=/";
                  }
                }}
                className="rounded-full border border-[#e6dccf] px-4 py-2 text-sm font-medium text-[#6b5f54] hover:border-[#d6c8b9] hover:text-[#1f1a17]"
              >
                {labels.logout}
              </button>
            ) : (
              <Link
                href="/account"
                className="rounded-full border border-[#e6dccf] px-4 py-2 text-sm font-medium text-[#6b5f54] hover:border-[#d6c8b9] hover:text-[#1f1a17]"
              >
                {labels.login}
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
