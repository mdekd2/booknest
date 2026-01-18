import { cookies } from "next/headers";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

export type ServerSession = {
  user: {
    id: string;
    email: string | null;
    name: string | null;
    role: "ADMIN" | "USER";
  };
};

export async function getServerUser(): Promise<ServerSession | null> {
  const cookieStore = await Promise.resolve(cookies());
  const token = cookieStore.get("__session")?.value;
  if (!token) {
    return null;
  }

  const adminAuth = getAdminAuth();
  const decoded = await adminAuth.verifySessionCookie(token, true);
  const adminDb = getAdminDb();
  const profile = await adminDb.collection("users").doc(decoded.uid).get();
  const data = profile.data() as { role?: "ADMIN" | "USER"; name?: string } | undefined;

  return {
    user: {
      id: decoded.uid,
      email: decoded.email ?? null,
      name: data?.name ?? decoded.name ?? null,
      role: data?.role ?? "USER",
    },
  };
}

export async function requireUser() {
  const session = await getServerUser();
  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireUser();
  if (session.user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return session;
}
