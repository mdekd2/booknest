import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CategoriesAdminClient } from "@/components/admin/CategoriesAdminClient";

export default async function AdminCategoriesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/account");
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return <CategoriesAdminClient initialCategories={categories} />;
}
