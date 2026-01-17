import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { getTranslator } from "@/lib/i18n/server";

export default async function OrdersPage() {
  const { t } = await getTranslator();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/account");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { book: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1f1a17]">
            {t("orders.title")}
          </h1>
          <p className="text-sm text-[#6b5f54]">{t("orders.subtitle")}</p>
        </div>
        <Link
          href="/books"
          className="rounded-full border border-[#e6dccf] px-4 py-2 text-sm font-medium text-[#6b5f54] hover:border-[#d6c8b9] hover:text-[#1f1a17]"
        >
          {t("orders.continue")}
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e6dccf] bg-[#fffaf4] p-10 text-center text-sm text-[#6b5f54]">
          {t("orders.empty")}
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-[#6b5f54]">
                    {t("orders.orderTotal")}
                  </p>
                  <p className="text-lg font-semibold text-[#1f1a17]">
                    {formatPrice(order.totalCents)}
                  </p>
                </div>
                <span className="rounded-full bg-[#e4efe8] px-3 py-1 text-xs font-semibold uppercase text-[#1f3a2f]">
                  {order.status}
                </span>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-[#6b5f54]">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.book.title} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
