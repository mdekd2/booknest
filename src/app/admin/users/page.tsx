import { getTranslator } from "@/lib/i18n/server";

export default async function AdminUsersPage() {
  const { t } = await getTranslator();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-[#1f1a17]">
        {t("admin.users")}
      </h1>
      <p className="text-sm text-[#6b5f54]">
        {t("admin.placeholderUsers")}
      </p>
      <div className="rounded-2xl border border-dashed border-[#e6dccf] bg-white/60 p-6 text-sm text-[#6b5f54]">
        {t("admin.placeholderUsers")}
      </div>
    </div>
  );
}
