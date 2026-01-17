import type Stripe from "stripe";
import { getAdminDb } from "@/lib/firebase/admin";
import { createOrder, getBooks } from "@/lib/firestore";

type CartItem = { bookId: string; quantity: number };

export async function createOrderFromStripeSession(
  session: Stripe.Checkout.Session
) {
  if (!session.id || session.payment_status !== "paid") {
    return null;
  }

  const adminDb = getAdminDb();
  const existingSnapshot = await adminDb
    .collection("orders")
    .where("stripeSessionId", "==", session.id)
    .limit(1)
    .get();
  const existing = existingSnapshot.docs[0];
  if (existing) {
    return { id: existing.id, ...(existing.data() as object) };
  }

  const cartRaw = session.metadata?.cart ?? "[]";
  const items = safeParseCart(cartRaw);
  if (items.length === 0 || !session.metadata?.userId) {
    return null;
  }

  const books = await getBooks();

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

  return await createOrder({
    userId: session.metadata?.userId ?? "",
    totalCents,
    currency: "MRU",
    status: "CONFIRMED",
    stripeSessionId: session.id,
    items: items.map((item) => {
      const book = bookMap.get(item.bookId);
      return {
        bookId: item.bookId,
        title: book?.title ?? "Book",
        quantity: item.quantity,
        priceCents: book?.priceCents ?? 0,
        imageUrl: book?.imageUrl ?? "",
      };
    }),
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
