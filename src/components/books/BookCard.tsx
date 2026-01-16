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
};

export function BookCard({ book }: BookCardProps) {
  return (
    <Link
      href={`/books/${book.slug}`}
      className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-slate-100">
        <Image
          src={book.imageUrl}
          alt={book.title}
          fill
          className="object-cover transition group-hover:scale-[1.02]"
        />
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="text-base font-semibold text-slate-900">{book.title}</h3>
        <p className="text-sm text-slate-500">{book.author}</p>
        <p className="text-sm font-medium text-slate-700">
          {formatPrice(book.priceCents, book.currency)}
        </p>
        <p className="text-xs text-slate-400">
          {book.stock > 0 ? `${book.stock} in stock` : "Out of stock"}
        </p>
      </div>
    </Link>
  );
}
