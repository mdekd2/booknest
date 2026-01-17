import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTranslator } from "@/lib/i18n/server";

export default async function AccountSettingsPage() {
  const { t } = await getTranslator();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/account");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1f1a17]">
          {t("account.settings")}
        </h1>
        <p className="text-sm text-[#6b5f54]">{t("account.subtitle")}</p>
      </div>
      <div className="rounded-3xl border border-[#e6dccf] bg-white/70 p-6 text-sm text-[#6b5f54]">
        Settings form placeholder. Hook Prisma + validation here.
      </div>
    </div>
  );
}
