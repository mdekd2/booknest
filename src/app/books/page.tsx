import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BookCard } from "@/components/books/BookCard";

type BooksPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: "price-asc" | "price-desc";
  }>;
};

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q?.trim();
  const categorySlug = resolvedParams.category;
  const sort = resolvedParams.sort;

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
      <div className="flex flex-col gap-4 rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1f1a17]">Browse books</h1>
          <p className="text-sm text-[#6b5f54]">
            Search by title, author, or filter by category.
          </p>
        </div>
        <Link
          href="/cart"
          className="rounded-full border border-[#e6dccf] px-5 py-2 text-sm font-medium text-[#6b5f54] hover:border-[#d6c8b9] hover:text-[#1f1a17]"
        >
          View cart
        </Link>
      </div>

      <form className="grid gap-4 rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-6 shadow-sm md:grid-cols-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-[#6b5f54] md:col-span-2">
          Search
          <input
            name="q"
            defaultValue={query ?? ""}
            placeholder="Search for a book or author"
            className="rounded-lg border border-[#e6dccf] bg-white/80 px-3 py-2 text-sm outline-none focus:border-[#1f3a2f]"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-[#6b5f54]">
          Category
          <select
            name="category"
            defaultValue={categorySlug ?? ""}
            className="rounded-lg border border-[#e6dccf] bg-white/80 px-3 py-2 text-sm outline-none focus:border-[#1f3a2f]"
          >
            <option value="">All</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-[#6b5f54]">
          Sort by
          <select
            name="sort"
            defaultValue={sort ?? ""}
            className="rounded-lg border border-[#e6dccf] bg-white/80 px-3 py-2 text-sm outline-none focus:border-[#1f3a2f]"
          >
            <option value="">Newest</option>
            <option value="price-asc">Price: Low to high</option>
            <option value="price-desc">Price: High to low</option>
          </select>
        </label>
        <div className="md:col-span-4">
          <button
            type="submit"
            className="rounded-full bg-[#1f3a2f] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#183026]"
          >
            Apply filters
          </button>
        </div>
      </form>

      {books.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e6dccf] bg-[#fffaf4] p-10 text-center text-sm text-[#6b5f54]">
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
