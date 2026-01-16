import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export default async function AdminPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { user: true },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#1f1a17]">Admin dashboard</h1>
        <p className="text-sm text-[#6b5f54]">
          Manage the catalog and review recent orders.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/books"
          className="rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-6 text-sm font-semibold text-[#6b5f54] shadow-sm hover:border-[#d6c8b9] hover:text-[#1f1a17]"
        >
          Manage books
        </Link>
        <Link
          href="/admin/categories"
          className="rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-6 text-sm font-semibold text-[#6b5f54] shadow-sm hover:border-[#d6c8b9] hover:text-[#1f1a17]"
        >
          Manage categories
        </Link>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#1f1a17]">Recent orders</h2>
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#e6dccf] bg-[#fffaf4] p-10 text-center text-sm text-[#6b5f54]">
            No orders yet.
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-4 text-sm text-[#6b5f54] shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-[#1f1a17]">
                    {order.user.email}
                  </span>
                  <span>{formatPrice(order.totalCents, order.currency)}</span>
                </div>
                <p className="text-xs text-[#9b8f84]">
                  Status: {order.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
