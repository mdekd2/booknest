import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { bookSchema } from "@/lib/validators";
import { getCategories, updateBook, deleteBook } from "@/lib/firestore";

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const resolvedParams = await params;
  if (!resolvedParams?.id) {
    return NextResponse.json({ error: "Missing book id." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const data = bookSchema.parse(body);

    const book = await updateBook(resolvedParams.id, data);
    const categories = await getCategories();
    const category =
      categories.find((item) => item.id === book.categoryId) ?? null;
    return NextResponse.json({ ...book, category });
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
    return NextResponse.json({ error: "Missing book id." }, { status: 400 });
  }

  await deleteBook(resolvedParams.id);
  return NextResponse.json({ ok: true });
}
