import { getTranslator } from "@/lib/i18n/server";
import { getAllUsers } from "@/lib/firestore";
import { UsersAdminClient } from "@/components/admin/UsersAdminClient";

export default async function AdminUsersPage() {
  const { t, locale } = await getTranslator();
  const users = await getAllUsers();
  const formatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });
  const formattedUsers = users.map((user) => ({
    ...user,
    createdAt: user.createdAt ? formatter.format(user.createdAt) : null,
  }));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1f1a17]">
          {t("admin.users")}
        </h1>
        <p className="text-sm text-[#6b5f54]">{t("admin.usersIntro")}</p>
      </div>
      <UsersAdminClient
        initialUsers={formattedUsers}
        labels={{
          name: t("admin.userName"),
          email: t("admin.userEmail"),
          role: t("admin.userRole"),
          createdAt: t("admin.userCreatedAt"),
          noUsers: t("admin.noUsers"),
          makeAdmin: t("admin.makeAdmin"),
          makeUser: t("admin.makeUser"),
          saving: t("admin.saving"),
        }}
      />
    </div>
  );
}
