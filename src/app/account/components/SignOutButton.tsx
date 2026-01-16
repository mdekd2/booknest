"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="w-full rounded-2xl bg-[#1f3a2f] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#183026]"
    >
      Log out
    </button>
  );
}
