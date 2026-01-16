import Link from "next/link";
import Image from "next/image";
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
      <section className="relative overflow-hidden rounded-[32px] border border-[#e6dccf] bg-[#fffaf4] px-8 py-12 shadow-sm">
        <div className="absolute inset-0">
          <Image
            src="/images/background.png"
            alt="Cozy reading nook"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fff4e8]/90 via-[#fff4e8]/70 to-transparent" />
        </div>
        <div className="relative max-w-2xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="relative h-14 w-14 overflow-hidden rounded-2xl border border-[#e6dccf] bg-[#f3ebe1] shadow-sm">
              <Image
                src="/images/logo.png"
                alt="BookNest logo"
                fill
                className="object-cover"
                priority
              />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6b5f54]">
              BookNest
            </span>
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6b5f54]">
            Discover your next favorite book
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-[#1f1a17] sm:text-5xl">
            BookNest is your cozy corner for thoughtful reads.
          </h1>
          <p className="text-base text-[#6b5f54]">
            Browse curated collections, build your cart, and check out securely
            with Stripe.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/books"
              className="rounded-full bg-[#1f3a2f] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#183026]"
            >
              Browse books
            </Link>
            <Link
              href="/account"
              className="rounded-full border border-[#d6c8b9] px-6 py-2 text-sm font-semibold text-[#1f1a17] hover:border-[#c6b8a9]"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#1f1a17]">
            Featured books
          </h2>
          <Link
            href="/books"
            className="text-sm font-medium text-[#1f3a2f] hover:text-[#183026]"
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
        <h2 className="text-2xl font-semibold text-[#1f1a17]">
          Shop by category
        </h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/books?category=${category.slug}`}
              className="rounded-full border border-[#e6dccf] bg-[#fffaf4] px-5 py-2 text-sm font-medium text-[#6b5f54] shadow-sm hover:border-[#d6c8b9] hover:text-[#1f1a17]"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
