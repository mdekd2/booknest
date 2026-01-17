import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { categorySchema } from "@/lib/validators";
import { createCategory, getCategories } from "@/lib/firestore";

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const data = categorySchema.parse(body);

    const category = await createCategory(data);
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 }
    );
  }
}
