import Link from "next/link";
import { stripe } from "@/lib/stripe";
import { createOrderFromStripeSession } from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import { ClearCartOnSuccess } from "@/components/cart/ClearCartOnSuccess";
import { formatPrice } from "@/lib/format";
import { getTranslator } from "@/lib/i18n/server";

type SuccessPageProps = {
  searchParams: { session_id?: string };
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { t } = await getTranslator();
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">
          {t("success.missing")}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {t("success.missingNote")}
        </p>
        <Link
          href="/orders"
          className="mt-6 inline-flex rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          {t("success.viewOrders")}
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
    <div className="space-y-6 rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-8 shadow-sm">
      <ClearCartOnSuccess />
      <h1 className="text-2xl font-semibold text-[#1f1a17]">
        {t("success.title")}
      </h1>
      <p className="text-sm text-[#6b5f54]">{t("success.subtitle")}</p>
      {order ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-[#2c2a25]">
            {t("success.orderTotal")}:{" "}
            {formatPrice(order.totalCents, order.currency)}
          </p>
          <ul className="space-y-2 text-sm text-[#6b5f54]">
            {order.items.map((item) => (
              <li key={item.id}>
                {item.book.title} × {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-[#6b5f54]">{t("success.finalizing")}</p>
      )}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/books"
          className="rounded-full bg-[#1f3a2f] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#183026]"
        >
          {t("success.continue")}
        </Link>
        <Link
          href="/orders"
          className="rounded-full border border-[#e6dccf] px-6 py-2 text-sm font-semibold text-[#6b5f54] hover:border-[#d6c8b9] hover:text-[#1f1a17]"
        >
          {t("success.viewOrders")}
        </Link>
      </div>
    </div>
  );
}
