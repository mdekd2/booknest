import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { categorySchema } from "@/lib/validators";
import { updateCategory, deleteCategory } from "@/lib/firestore";

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const resolvedParams = await params;
  if (!resolvedParams?.id) {
    return NextResponse.json({ error: "Missing category id." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const data = categorySchema.parse(body);

    const category = await updateCategory(resolvedParams.id, data);
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const resolvedParams = await params;
  if (!resolvedParams?.id) {
    return NextResponse.json({ error: "Missing category id." }, { status: 400 });
  }

  await deleteCategory(resolvedParams.id);
  return NextResponse.json({ ok: true });
}
