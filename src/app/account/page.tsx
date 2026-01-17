import Link from "next/link";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import AccountAuthForms from "./components/AccountAuthForms";
import { getTranslator } from "@/lib/i18n/server";

export default async function AccountPage() {
  const { t } = await getTranslator();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <AccountAuthForms />;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const recentOrders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1f1a17]">
          {t("account.title")}
        </h1>
        <p className="text-sm text-[#6b5f54]">{t("account.subtitle")}</p>
      </div>

      <section className="rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1f1a17]">
          {t("account.overview")}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <InfoCard
            label={t("account.memberSince")}
            value={user?.createdAt.toDateString() ?? "—"}
          />
          <InfoCard label={t("account.orders")} value={`${recentOrders.length}`} />
          <InfoCard label={t("account.status")} value={t("account.active")} />
        </div>
      </section>

      <section className="rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#1f1a17]">
            {t("account.recentOrders")}
          </h2>
          <Link
            href="/account/orders"
            className="text-sm font-semibold text-[#1f3a2f] underline underline-offset-4"
          >
            {t("account.viewAll")}
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="mt-4 text-sm text-[#6b5f54]">{t("account.noOrders")}</p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-2xl border border-[#e6dccf]">
            <div className="grid grid-cols-3 bg-[#f3ebe1] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#6b5f54] sm:grid-cols-4">
              <div>Order</div>
              <div>Date</div>
              <div>Total</div>
              <div className="hidden sm:block">Status</div>
            </div>
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="grid grid-cols-3 border-t border-[#e6dccf] px-4 py-3 text-sm text-[#1f1a17] sm:grid-cols-4"
              >
                <div className="font-medium">#{order.id.slice(0, 6)}</div>
                <div className="text-[#6b5f54]">
                  {order.createdAt.toLocaleDateString()}
                </div>
                <div className="font-medium">
                  {formatPrice(order.totalCents, order.currency)}
                </div>
                <div className="hidden sm:block">
                  <span className="rounded-full bg-[#e4efe8] px-2 py-1 text-xs font-semibold text-[#1f3a2f]">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1f1a17]">
          {t("account.quickActions")}
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/account/settings"
            className="rounded-full bg-[#1f3a2f] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#183026]"
          >
            {t("account.editProfile")}
          </Link>
          <Link
            href="/account/orders"
            className="rounded-full border border-[#e6dccf] px-4 py-2 text-sm font-semibold text-[#6b5f54] hover:border-[#d6c8b9] hover:text-[#1f1a17]"
          >
            {t("account.trackOrders")}
          </Link>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#e6dccf] bg-white/70 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-[#6b5f54]">
        {label}
      </div>
      <div className="mt-2 text-lg font-semibold text-[#1f1a17]">{value}</div>
    </div>
  );
}
