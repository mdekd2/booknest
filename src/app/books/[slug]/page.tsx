import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

type BookDetailsPageProps = {
  params: { slug: string };
};

export default async function BookDetailsPage({
  params,
}: BookDetailsPageProps) {
  const book = await prisma.book.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!book) {
    notFound();
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-[#e6dccf] bg-[#fffaf4] shadow-sm">
        <Image
          src={book.imageUrl}
          alt={book.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#6b5f54]">
            {book.category.name}
          </p>
          <h1 className="text-3xl font-semibold text-[#1f1a17]">
            {book.title}
          </h1>
          <p className="text-sm text-[#6b5f54]">by {book.author}</p>
        </div>
        <p className="text-lg font-semibold text-[#1f1a17]">
          {formatPrice(book.priceCents, book.currency)}
        </p>
        <p className="text-sm leading-7 text-[#6b5f54]">{book.description}</p>
        <div className="flex flex-wrap items-center gap-3">
          <AddToCartButton book={book} />
          <Link
            href="/cart"
            className="rounded-full border border-[#e6dccf] px-4 py-2 text-sm font-semibold text-[#6b5f54] hover:border-[#d6c8b9] hover:text-[#1f1a17]"
          >
            View cart
          </Link>
        </div>
        <p className="text-sm text-[#6b5f54]">
          {book.stock > 0
            ? `${book.stock} copies available`
            : "Currently out of stock"}
        </p>
      </div>
    </div>
  );
}
