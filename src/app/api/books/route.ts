import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { bookSchema } from "@/lib/validators";
import { createBook, getBooks, getCategories } from "@/lib/firestore";

export async function GET() {
  const [books, categories] = await Promise.all([
    getBooks(),
    getCategories(),
  ]);
  const payload = books.map((book) => ({
    ...book,
    category:
      categories.find((category) => category.id === book.categoryId) ?? null,
  }));
  return NextResponse.json(payload);
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const data = bookSchema.parse(body);

    const book = await createBook(data);
    const categoryList = await getCategories();
    const category =
      categoryList.find((item) => item.id === book.categoryId) ?? null;
    return NextResponse.json({ ...book, category });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 }
    );
  }
}
