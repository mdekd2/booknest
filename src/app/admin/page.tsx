import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/account");
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { user: true },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Admin dashboard</h1>
        <p className="text-sm text-slate-500">
          Manage the catalog and review recent orders.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/books"
          className="rounded-2xl border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-700 hover:border-slate-300"
        >
          Manage books
        </Link>
        <Link
          href="/admin/categories"
          className="rounded-2xl border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-700 hover:border-slate-300"
        >
          Manage categories
        </Link>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Recent orders</h2>
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            No orders yet.
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-slate-900">
                    {order.user.email}
                  </span>
                  <span>{formatPrice(order.totalCents, order.currency)}</span>
                </div>
                <p className="text-xs text-slate-400">
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
