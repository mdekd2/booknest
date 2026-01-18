import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBookBySlug, getCategories } from "@/lib/firestore";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { getTranslator } from "@/lib/i18n/server";

type BookDetailsPageProps = {
  params: Promise<{ slug?: string }>;
};

export default async function BookDetailsPage({
  params,
}: BookDetailsPageProps) {
  const { t } = await getTranslator();
  const resolvedParams = await params;
  if (!resolvedParams.slug) {
    notFound();
  }

  const [book, categories] = await Promise.all([
    getBookBySlug(resolvedParams.slug),
    getCategories(),
  ]);

  if (!book) {
    notFound();
  }
  const category = categories.find((item) => item.id === book.categoryId);

  const hasImage =
    !!book.imageUrl && !book.imageUrl.includes("placeholder");

  return (
    <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-[#e6dccf] bg-[#fffaf4] shadow-sm">
        {hasImage ? (
          <Image
            src={book.imageUrl}
            alt={book.title}
            fill
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#6b5f54]">
            {category?.name ?? ""}
          </p>
          <h1 className="text-3xl font-semibold text-[#1f1a17]">
            {book.title}
          </h1>
          <p className="text-sm text-[#6b5f54]">
            {t("book.by")} {book.author}
          </p>
        </div>
        <p className="text-lg font-semibold text-[#1f1a17]">
          {formatPrice(book.priceCents)}
        </p>
        <p className="text-sm leading-7 text-[#6b5f54]">{book.description}</p>
        <div className="flex flex-wrap items-center gap-3">
          <AddToCartButton
            book={book}
            labels={{
              add: t("cart.addToCart"),
              added: t("cart.added"),
              outOfStock: t("cart.outOfStock"),
            }}
          />
          <Link
            href="/cart"
            className="rounded-full border border-[#e6dccf] px-4 py-2 text-sm font-semibold text-[#6b5f54] hover:border-[#d6c8b9] hover:text-[#1f1a17]"
          >
            {t("book.viewCart")}
          </Link>
        </div>
        <p className="text-sm text-[#6b5f54]">
          {book.stock > 0
            ? `${book.stock} ${t("book.copiesAvailable")}`
            : t("book.outOfStock")}
        </p>
      </div>
    </div>
  );
}
