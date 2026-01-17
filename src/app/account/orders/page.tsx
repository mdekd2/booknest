import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { getTranslator } from "@/lib/i18n/server";

export default async function AccountOrdersPage() {
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
      <div>
        <h1 className="text-2xl font-semibold text-[#1f1a17]">
          {t("account.orders")}
        </h1>
        <p className="text-sm text-[#6b5f54]">{t("orders.subtitle")}</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e6dccf] bg-white/60 p-6 text-sm text-[#6b5f54]">
          {t("orders.empty")}
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-3xl border border-[#e6dccf] bg-white/70 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-[#6b5f54]">
                    {t("orders.orderTotal")}
                  </p>
                  <p className="text-lg font-semibold text-[#1f1a17]">
                    {formatPrice(order.totalCents, order.currency)}
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
