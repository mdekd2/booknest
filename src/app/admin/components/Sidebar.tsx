"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/books", label: "Books" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/users", label: "Users" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <div>
        <div className="text-lg font-semibold text-[#1f1a17]">BookNest</div>
        <div className="text-xs uppercase tracking-[0.3em] text-[#6b5f54]">
          Admin panel
        </div>
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-2xl px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-[#e4efe8] text-[#1f3a2f]"
                  : "text-[#6b5f54] hover:bg-[#f3ebe1] hover:text-[#1f1a17]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#e6dccf] pt-4">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full rounded-2xl bg-[#1f3a2f] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#183026]"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
