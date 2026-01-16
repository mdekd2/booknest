"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { CartButton } from "@/components/cart/CartButton";

export function Header() {
  const { data: session } = useSession();
  const role = session?.user?.role;

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
        <nav className="flex items-center gap-4 text-sm text-[#6b5f54]">
          <Link href="/books" className="hover:text-[#1f1a17]">
            Books
          </Link>
          <Link href="/orders" className="hover:text-[#1f1a17]">
            Orders
          </Link>
          <Link href="/account" className="hover:text-[#1f1a17]">
            Account
          </Link>
          {role === "ADMIN" ? (
            <Link href="/admin" className="hover:text-[#1f1a17]">
              Admin
            </Link>
          ) : null}
        </nav>
        <div className="flex items-center gap-3">
          <CartButton />
          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-full border border-[#e6dccf] px-4 py-2 text-sm font-medium text-[#6b5f54] hover:border-[#d6c8b9] hover:text-[#1f1a17]"
            >
              Log out
            </button>
          ) : (
            <Link
              href="/account"
              className="rounded-full border border-[#e6dccf] px-4 py-2 text-sm font-medium text-[#6b5f54] hover:border-[#d6c8b9] hover:text-[#1f1a17]"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
