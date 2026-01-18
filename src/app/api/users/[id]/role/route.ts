import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAdminDb } from "@/lib/firebase/admin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const ALLOWED_ROLES = ["ADMIN", "USER"] as const;

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing user id." }, { status: 400 });
    }

    const body = await request.json();
    const role = String(body.role ?? "");
    if (!ALLOWED_ROLES.includes(role as (typeof ALLOWED_ROLES)[number])) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    const adminDb = getAdminDb();
    await adminDb.collection("users").doc(id).set(
      {
        role,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    return NextResponse.json({ id, role });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed." },
      { status: 400 }
    );
  }
}
