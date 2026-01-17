import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { BookCard } from "@/components/books/BookCard";
import { getTranslator } from "@/lib/i18n/server";

export default async function Home() {
  const { t } = await getTranslator();
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
              {t("home.badge")}
            </span>
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6b5f54]">
            {t("home.tagline")}
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-[#1f1a17] sm:text-5xl">
            {t("home.title")}
          </h1>
          <p className="text-base text-[#6b5f54]">
            {t("home.subtitle")}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/books"
              className="rounded-full bg-[#1f3a2f] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#183026]"
            >
              {t("home.browse")}
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#1f1a17]">
            {t("home.featured")}
          </h2>
          <Link
            href="/books"
            className="text-sm font-medium text-[#1f3a2f] hover:text-[#183026]"
          >
            {t("home.viewAll")}
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              labels={{
                inStock: t("book.inStock"),
                outOfStock: t("cart.outOfStock"),
              }}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#1f1a17]">
          {t("home.categories")}
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
