import { getServerUser } from "@/lib/auth";
import AccountSidebar from "./components/AccountSidebar";
import { getTranslator } from "@/lib/i18n/server";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = await getTranslator();
  const session = await getServerUser();

  if (!session?.user?.id) {
    return <>{children}</>;
  }

  const navItems = [
    { href: "/account", label: t("account.overview") },
    { href: "/account/orders", label: t("account.orders") },
    { href: "/account/settings", label: t("account.settings") },
  ];

  return (
    <div className="min-h-[calc(100vh-160px)]">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
          <aside className="rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-6 shadow-sm">
            <AccountSidebar
              user={session.user}
              memberLabel={t("account.member")}
              navItems={navItems}
            />
          </aside>
          <main className="rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-6 shadow-sm">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
