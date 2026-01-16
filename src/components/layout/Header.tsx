"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { CartButton } from "@/components/cart/CartButton";

export function Header() {
  const { data: session } = useSession();
  const role = session?.user?.role;

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-xl font-bold text-slate-900">
          BookNest
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-600">
          <Link href="/books" className="hover:text-slate-900">
            Books
          </Link>
          <Link href="/orders" className="hover:text-slate-900">
            Orders
          </Link>
          <Link href="/account" className="hover:text-slate-900">
            Account
          </Link>
          {role === "ADMIN" ? (
            <Link href="/admin" className="hover:text-slate-900">
              Admin
            </Link>
          ) : null}
        </nav>
        <div className="flex items-center gap-3">
          <CartButton />
          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300"
            >
              Log out
            </button>
          ) : (
            <Link
              href="/account"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
