import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { checkoutSchema } from "@/lib/validators";
import { FieldValue } from "firebase-admin/firestore";
import { createOrder, getBooks } from "@/lib/firestore";
import { getAdminDb } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  let session;
  try {
    session = await requireUser();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { items } = checkoutSchema.parse(body);

    const books = await getBooks();

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

    const order = await createOrder({
      userId: session.user.id,
      userEmail: session.user.email,
      totalCents,
      currency: "MRU",
      status: "PENDING",
      items: items.map((item) => {
        const book = bookMap.get(item.bookId);
        return {
          bookId: item.bookId,
          title: book?.title ?? "Unknown",
          quantity: item.quantity,
          priceCents: book?.priceCents ?? 0,
          imageUrl: book?.imageUrl ?? "",
        };
      }),
    });

    const adminDb = getAdminDb();
    const batch = adminDb.batch();
    for (const item of items) {
      const ref = adminDb.collection("books").doc(item.bookId);
      batch.update(ref, { stock: FieldValue.increment(-item.quantity) });
    }
    await batch.commit();

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
