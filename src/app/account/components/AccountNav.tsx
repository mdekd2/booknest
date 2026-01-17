"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AccountNavItem = { href: string; label: string };

export default function AccountNav({ items }: { items: AccountNavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-2xl px-3 py-2 text-sm font-medium transition ${
              active
                ? "bg-[#e4efe8] text-[#1f3a2f]"
                : "text-[#6b5f54] hover:bg-[#f3ebe1] hover:text-[#1f1a17]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
