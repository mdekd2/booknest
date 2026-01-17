"use client";

import { signOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase/client";

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await signOut(firebaseAuth);
          await fetch("/api/auth/logout", { method: "POST" });
          window.location.href = "/";
        } catch {
          window.location.href = "/";
        }
      }}
      className="w-full rounded-2xl bg-[#1f3a2f] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#183026]"
    >
      Log out
    </button>
  );
}
