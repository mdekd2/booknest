import { prisma } from "@/lib/prisma";
import { CategoriesAdminClient } from "@/components/admin/CategoriesAdminClient";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return <CategoriesAdminClient initialCategories={categories} />;
}
