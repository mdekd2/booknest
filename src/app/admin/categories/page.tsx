import { getCategories } from "@/lib/firestore";
import { CategoriesAdminClient } from "@/components/admin/CategoriesAdminClient";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return <CategoriesAdminClient initialCategories={categories} />;
}
