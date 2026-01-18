import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth";
import { getTranslator } from "@/lib/i18n/server";
import { getAdminDb } from "@/lib/firebase/admin";

export default async function AccountSettingsPage() {
  const { t, locale } = await getTranslator();
  const session = await getServerUser();
  if (!session?.user?.id) {
    redirect("/account");
  }

  const adminDb = getAdminDb();
  const userSnapshot = await adminDb
    .collection("users")
    .doc(session.user.id)
    .get();
  const userData = userSnapshot.data() as
    | { createdAt?: { toDate: () => Date }; name?: string; email?: string }
    | undefined;
  const formatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });
  const joinedAt = userData?.createdAt?.toDate
    ? formatter.format(userData.createdAt.toDate())
    : "—";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1f1a17]">
          {t("account.settings")}
        </h1>
        <p className="text-sm text-[#6b5f54]">{t("account.settingsIntro")}</p>
      </div>
      <div className="rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1f1a17]">
          {t("account.profileInfo")}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <InfoItem
            label={t("account.profileName")}
            value={userData?.name ?? session.user.name ?? "—"}
          />
          <InfoItem
            label={t("account.profileEmail")}
            value={userData?.email ?? session.user.email ?? "—"}
          />
          <InfoItem
            label={t("account.profileRole")}
            value={session.user.role ?? "USER"}
          />
          <InfoItem label={t("account.profileJoined")} value={joinedAt} />
        </div>
      </div>
      <div className="rounded-3xl border border-[#e6dccf] bg-white/70 p-6 text-sm text-[#6b5f54]">
        {t("account.settingsNote")}
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#e6dccf] bg-white/80 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-[#6b5f54]">
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold text-[#1f1a17]">{value}</div>
    </div>
  );
}
