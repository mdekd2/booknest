import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/format";

type BookCardProps = {
  book: {
    title: string;
    slug: string;
    author: string;
    priceCents: number;
    currency: string;
    imageUrl: string;
    stock: number;
  };
  labels?: {
    inStock?: string;
    outOfStock?: string;
  };
};

export function BookCard({ book, labels }: BookCardProps) {
  const inStockLabel = labels?.inStock ?? "in stock";
  const outOfStockLabel = labels?.outOfStock ?? "Out of stock";
  const hasImage =
    !!book.imageUrl && !book.imageUrl.includes("placeholder");

  return (
    <Link
      href={`/books/${book.slug}`}
      className="group flex flex-col rounded-2xl border border-[#e6dccf] bg-[#fffaf4] p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#d6c8b9] hover:shadow-md"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#f3ebe1]">
        {hasImage ? (
          <Image
            src={book.imageUrl}
            alt={book.title}
            fill
            className="object-cover transition group-hover:scale-[1.02]"
          />
        ) : null}
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="text-base font-semibold text-[#1f1a17]">{book.title}</h3>
        <p className="text-sm text-[#7b6d62]">{book.author}</p>
        <p className="text-sm font-medium text-[#2c2a25]">
          {formatPrice(book.priceCents, book.currency)}
        </p>
        <p className="text-xs text-[#9b8f84]">
          {book.stock > 0
            ? `${book.stock} ${inStockLabel}`
            : outOfStockLabel}
        </p>
      </div>
    </Link>
  );
}
