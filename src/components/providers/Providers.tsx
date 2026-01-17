"use client";

import { CartProvider } from "@/components/cart/CartProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}
