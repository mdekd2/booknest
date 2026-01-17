import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Sidebar from "./components/Sidebar";
import { getTranslator } from "@/lib/i18n/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = await getTranslator();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/account");
  }

  const labels = {
    dashboard: t("admin.dashboard"),
    books: t("admin.books"),
    categories: t("admin.categories"),
    orders: t("admin.orders"),
    users: t("admin.users"),
    panel: t("admin.dashboard"),
  };

  return (
    <div className="min-h-[calc(100vh-160px)]">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
          <aside className="rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-5 shadow-sm">
            <Sidebar labels={labels} />
          </aside>
          <main className="rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-6 shadow-sm">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
