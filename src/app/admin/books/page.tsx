import { prisma } from "@/lib/prisma";
import { BooksAdminClient } from "@/components/admin/BooksAdminClient";

export default async function AdminBooksPage() {
  const [books, categories] = await Promise.all([
    prisma.book.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <BooksAdminClient
      initialBooks={books}
      initialCategories={categories}
    />
  );
}
