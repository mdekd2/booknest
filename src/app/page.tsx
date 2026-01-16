import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BookCard } from "@/components/books/BookCard";

export default async function Home() {
  const [categories, featuredBooks] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.book.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  return (
    <div className="space-y-12">
      <section className="rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-500 px-8 py-12 text-white shadow-lg">
        <div className="max-w-2xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-200">
            Discover your next favorite book
          </p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            BookNest is your cozy corner for thoughtful reads.
          </h1>
          <p className="text-base text-indigo-100">
            Browse curated collections, build your cart, and check out securely
            with Stripe.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/books"
              className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
            >
              Browse books
            </Link>
            <Link
              href="/account"
              className="rounded-full border border-white/40 px-6 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">
            Featured books
          </h2>
          <Link
            href="/books"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">
          Shop by category
        </h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/books?category=${category.slug}`}
              className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 hover:border-slate-300"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
