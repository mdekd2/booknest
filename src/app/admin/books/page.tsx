import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BooksAdminClient } from "@/components/admin/BooksAdminClient";

export default async function AdminBooksPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/account");
  }

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
