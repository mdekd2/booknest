import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7;
const ADMIN_EMAIL = "admin@admin.com";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const idToken = String(body.idToken ?? "");
    if (!idToken) {
      return NextResponse.json({ error: "Missing token." }, { status: 400 });
    }

    const adminAuth = getAdminAuth();
    const decoded = await adminAuth.verifyIdToken(idToken);
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_MS,
    });

    cookies().set("__session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_MS / 1000,
      path: "/",
    });

    const adminDb = getAdminDb();
    const userRef = adminDb.collection("users").doc(decoded.uid);
    const snapshot = await userRef.get();
    const role =
      snapshot.exists && snapshot.data()?.role
        ? snapshot.data()?.role
        : decoded.email === ADMIN_EMAIL
          ? "ADMIN"
          : "USER";

    await userRef.set(
      {
        name: decoded.name ?? snapshot.data()?.name ?? null,
        email: decoded.email ?? null,
        role,
        createdAt: snapshot.exists ? snapshot.data()?.createdAt ?? null : new Date(),
        updatedAt: new Date(),
      },
      { merge: true }
    );

    return NextResponse.json({ ok: true, role });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Session failed.",
      },
      { status: 400 }
    );
  }
}
