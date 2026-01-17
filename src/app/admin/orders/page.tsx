import { getAllOrders } from "@/lib/firestore";
import { getTranslator } from "@/lib/i18n/server";
import { AdminOrdersClient } from "@/components/admin/AdminOrdersClient";

export default async function AdminOrdersPage() {
  const { t } = await getTranslator();
  const orders = await getAllOrders();

  const serialized = orders.map((order) => ({
    ...order,
    createdAt: order.createdAt?.toISOString() ?? "",
  }));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-[#1f1a17]">
        {t("admin.orders")}
      </h1>
      <p className="text-sm text-[#6b5f54]">
        {t("orders.subtitle")}
      </p>
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e6dccf] bg-white/60 p-6 text-sm text-[#6b5f54]">
          {t("admin.noOrders")}
        </div>
      ) : (
        <AdminOrdersClient
          initialOrders={serialized}
          labels={{
            status: t("orders.status"),
            orderTotal: t("orders.orderTotal"),
            pending: t("status.pending"),
            confirmed: t("status.confirmed"),
            ready: t("status.ready"),
            inTransit: t("status.inTransit"),
            delivered: t("status.delivered"),
            cancelled: t("status.cancelled"),
          }}
        />
      )}
    </div>
  );
}
