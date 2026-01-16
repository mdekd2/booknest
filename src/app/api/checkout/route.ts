import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkoutSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.STRIPE_SUCCESS_URL || !process.env.STRIPE_CANCEL_URL) {
    return NextResponse.json(
      { error: "Stripe redirect URLs are not configured." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { items } = checkoutSchema.parse(body);
    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

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

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: session.user.email ?? undefined,
      line_items: items.map((item) => {
        const book = bookMap.get(item.bookId);
        return {
          quantity: item.quantity,
          price_data: {
            currency: book?.currency ?? "USD",
            unit_amount: book?.priceCents ?? 0,
            product_data: {
              name: book?.title ?? "Book",
              description: book?.author,
              images: book?.imageUrl ? [`${baseUrl}${book.imageUrl}`] : [],
            },
          },
        };
      }),
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
      metadata: {
        userId: session.user.id,
        cart: JSON.stringify(items),
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Checkout failed" },
      { status: 400 }
    );
  }
}
