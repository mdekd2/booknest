import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BookCard } from "@/components/books/BookCard";

type BooksPageProps = {
  searchParams: {
    q?: string;
    category?: string;
    sort?: "price-asc" | "price-desc";
  };
};

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const query = searchParams.q?.trim();
  const categorySlug = searchParams.category;
  const sort = searchParams.sort;

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const books = await prisma.book.findMany({
    where: {
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { author: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(categorySlug
        ? { category: { slug: categorySlug } }
        : {}),
    },
    orderBy:
      sort === "price-desc"
        ? { priceCents: "desc" }
        : sort === "price-asc"
        ? { priceCents: "asc" }
        : { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Browse books</h1>
          <p className="text-sm text-slate-500">
            Search by title, author, or filter by category.
          </p>
        </div>
        <Link
          href="/cart"
          className="rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-700 hover:border-slate-300"
        >
          View cart
        </Link>
      </div>

      <form className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 md:col-span-2">
          Search
          <input
            name="q"
            defaultValue={query ?? ""}
            placeholder="Search for a book or author"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Category
          <select
            name="category"
            defaultValue={categorySlug ?? ""}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          >
            <option value="">All</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Sort by
          <select
            name="sort"
            defaultValue={sort ?? ""}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          >
            <option value="">Newest</option>
            <option value="price-asc">Price: Low to high</option>
            <option value="price-desc">Price: High to low</option>
          </select>
        </label>
        <div className="md:col-span-4">
          <button
            type="submit"
            className="rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Apply filters
          </button>
        </div>
      </form>

      {books.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          No books match your search yet. Try another keyword or category.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
