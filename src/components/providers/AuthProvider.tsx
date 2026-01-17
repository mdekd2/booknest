"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firebaseAuth, firebaseDb } from "@/lib/firebase/client";

type AuthContextValue = {
  user: User | null;
  role: "ADMIN" | "USER" | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  role: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"ADMIN" | "USER" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (nextUser) => {
      setUser(nextUser);
      setRole(null);
      if (!nextUser) {
        setLoading(false);
        return;
      }

      try {
        const token = await nextUser.getIdToken();
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: token }),
        });

        const profile = await getDoc(doc(firebaseDb, "users", nextUser.uid));
        const data = profile.data() as { role?: "ADMIN" | "USER" } | undefined;
        setRole(data?.role ?? "USER");
      } catch {
        setRole("USER");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({ user, role, loading }),
    [user, role, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
