import Link from "next/link";
import { stripe } from "@/lib/stripe";
import { createOrderFromStripeSession } from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import { ClearCartOnSuccess } from "@/components/cart/ClearCartOnSuccess";
import { formatPrice } from "@/lib/format";

type SuccessPageProps = {
  searchParams: { session_id?: string };
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">
          Missing session
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          We could not find your Stripe session. Check your orders instead.
        </p>
        <Link
          href="/orders"
          className="mt-6 inline-flex rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          View orders
        </Link>
      </div>
    );
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  await createOrderFromStripeSession(session);

  const order = await prisma.order.findFirst({
    where: { stripeSessionId: sessionId },
    include: { items: { include: { book: true } } },
  });

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8">
      <ClearCartOnSuccess />
      <h1 className="text-2xl font-semibold text-slate-900">
        Payment confirmed!
      </h1>
      <p className="text-sm text-slate-500">
        Thank you for your purchase. We have emailed your receipt and created
        your order.
      </p>
      {order ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">
            Order total: {formatPrice(order.totalCents, order.currency)}
          </p>
          <ul className="space-y-2 text-sm text-slate-600">
            {order.items.map((item) => (
              <li key={item.id}>
                {item.book.title} × {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          We are finalizing your order. Refresh in a moment or check your
          orders page.
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/books"
          className="rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Continue shopping
        </Link>
        <Link
          href="/orders"
          className="rounded-full border border-slate-200 px-6 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
        >
          View orders
        </Link>
      </div>
    </div>
  );
}
