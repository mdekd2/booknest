import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";

type CartItem = { bookId: string; quantity: number };

export async function createOrderFromStripeSession(
  session: Stripe.Checkout.Session
) {
  if (!session.id || session.payment_status !== "paid") {
    return null;
  }

  const existing = await prisma.order.findFirst({
    where: { stripeSessionId: session.id },
  });

  if (existing) {
    return existing;
  }

  const cartRaw = session.metadata?.cart ?? "[]";
  const items = safeParseCart(cartRaw);
  if (items.length === 0 || !session.metadata?.userId) {
    return null;
  }

  const books = await prisma.book.findMany({
    where: { id: { in: items.map((item) => item.bookId) } },
  });

  const bookMap = new Map(books.map((book) => [book.id, book]));
  for (const item of items) {
    const book = bookMap.get(item.bookId);
    if (!book || book.stock < item.quantity) {
      throw new Error("INSUFFICIENT_STOCK");
    }
  }

  const totalCents = items.reduce((sum, item) => {
    const book = bookMap.get(item.bookId);
    return sum + (book?.priceCents ?? 0) * item.quantity;
  }, 0);

  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId: session.metadata?.userId ?? "",
        totalCents,
        currency: "USD",
        status: "PAID",
        stripeSessionId: session.id,
      },
    });

    await tx.orderItem.createMany({
      data: items.map((item) => ({
        orderId: order.id,
        bookId: item.bookId,
        quantity: item.quantity,
        priceCents: bookMap.get(item.bookId)?.priceCents ?? 0,
      })),
    });

    for (const item of items) {
      await tx.book.update({
        where: { id: item.bookId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return order;
  });
}

function safeParseCart(raw: string): CartItem[] {
  try {
    const parsed = JSON.parse(raw) as CartItem[];
    return parsed.filter(
      (item) =>
        typeof item.bookId === "string" &&
        typeof item.quantity === "number" &&
        item.quantity > 0
    );
  } catch {
    return [];
  }
}
