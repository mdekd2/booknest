import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkoutSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { items } = checkoutSchema.parse(body);

    const books = await prisma.book.findMany({
      where: { id: { in: items.map((item) => item.bookId) } },
    });

    const bookMap = new Map(books.map((book) => [book.id, book]));
    for (const item of items) {
      const book = bookMap.get(item.bookId);
      if (!book || book.stock < item.quantity) {
        return NextResponse.json(
          { error: "Some items are no longer available." },
          { status: 400 }
        );
      }
    }

    const totalCents = items.reduce((sum, item) => {
      const book = bookMap.get(item.bookId);
      return sum + (book?.priceCents ?? 0) * item.quantity;
    }, 0);

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId: session.user.id,
          totalCents,
          currency: "MRU",
          status: "PENDING",
        },
      });

      await tx.orderItem.createMany({
        data: items.map((item) => ({
          orderId: created.id,
          bookId: item.bookId,
          quantity: item.quantity,
          priceCents: bookMap.get(item.bookId)?.priceCents ?? 0,
        })),
      });

      return created;
    });

    return NextResponse.json({
      orderId: order.id,
      totalCents: order.totalCents,
      currency: order.currency,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Checkout failed" },
      { status: 400 }
    );
  }
}
