import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { bookSchema } from "@/lib/validators";

type RouteParams = { params: { id: string } };

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!params?.id) {
    return NextResponse.json({ error: "Missing book id." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const data = bookSchema.parse(body);

    const book = await prisma.book.update({
      where: { id: params.id },
      data,
      include: { category: true },
    });

    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!params?.id) {
    return NextResponse.json({ error: "Missing book id." }, { status: 400 });
  }

  await prisma.book.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
