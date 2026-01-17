import { getBooks, getCategories } from "@/lib/firestore";
import { BooksAdminClient } from "@/components/admin/BooksAdminClient";

export default async function AdminBooksPage() {
  const [books, categories] = await Promise.all([
    getBooks(),
    getCategories(),
  ]);

  const booksWithCategory = books.map((book) => ({
    ...book,
    category:
      categories.find((category) => category.id === book.categoryId) ?? {
        id: "",
        name: "",
        slug: "",
      },
  }));

  return (
    <BooksAdminClient
      initialBooks={booksWithCategory}
      initialCategories={categories}
    />
  );
}
