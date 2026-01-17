"use client";

import { useRef, useState } from "react";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Book = {
  id: string;
  title: string;
  slug: string;
  author: string;
  description: string;
  priceCents: number;
  currency: string;
  stock: number;
  imageUrl: string;
  categoryId: string;
  category: Category;
};

type BooksAdminClientProps = {
  initialBooks: Book[];
  initialCategories: Category[];
};

const emptyForm = {
  id: "",
  title: "",
  slug: "",
  author: "",
  description: "",
  priceCents: 0,
  currency: "MRU",
  stock: 0,
  imageUrl: "",
  categoryId: "",
};

export function BooksAdminClient({
  initialBooks,
  initialCategories,
}: BooksAdminClientProps) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [categories] = useState<Category[]>(initialCategories);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleEdit = (book: Book) => {
    setForm({
      id: book.id,
      title: book.title,
      slug: book.slug,
      author: book.author,
      description: book.description,
      priceCents: book.priceCents,
      currency: book.currency,
      stock: book.stock,
      imageUrl: book.imageUrl,
      categoryId: book.categoryId,
    });
  };

  const handleDelete = async (bookId: string) => {
    if (!confirm("Delete this book?")) {
      return;
    }
    await fetch(`/api/books/${bookId}`, { method: "DELETE" });
    setBooks((prev) => prev.filter((book) => book.id !== bookId));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSaving(true);

    if (form.id && form.id === "undefined") {
      setSaving(false);
      setError("Missing book id.");
      return;
    }

    const payload = {
      title: form.title,
      slug: form.slug,
      author: form.author,
      description: form.description,
      priceCents: Number(form.priceCents),
      currency: form.currency,
      stock: Number(form.stock),
      imageUrl: form.imageUrl,
      categoryId: form.categoryId,
    };

    try {
      const response = await fetch(
        form.id ? `/api/books/${form.id}` : "/api/books",
        {
          method: form.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Save failed");
      }

      const data = await response.json();
      if (form.id) {
        setBooks((prev) =>
          prev.map((book) => (book.id === data.id ? data : book))
        );
      } else {
        setBooks((prev) => [data, ...prev]);
      }
      setForm(emptyForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload/book-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Upload failed");
      }

      const data = await response.json();
      setForm((prev) => ({ ...prev, imageUrl: data.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1f1a17]">Books</h1>
          <p className="text-sm text-[#6b5f54]">
            Create and manage the BookNest catalog.
          </p>
        </div>
        <Link
          href="/admin"
          className="rounded-full border border-[#e6dccf] px-4 py-2 text-sm font-medium text-[#6b5f54] hover:border-[#d6c8b9] hover:text-[#1f1a17]"
        >
          Back to dashboard
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-6 shadow-sm lg:grid-cols-2"
      >
        <label className="flex flex-col gap-2 text-sm font-medium text-[#6b5f54]">
          Title
          <input
            value={form.title}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, title: event.target.value }))
            }
            required
            className="rounded-lg border border-[#e6dccf] bg-white/80 px-3 py-2 text-sm outline-none focus:border-[#1f3a2f]"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-[#6b5f54]">
          Slug
          <input
            value={form.slug}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, slug: event.target.value }))
            }
            required
            className="rounded-lg border border-[#e6dccf] bg-white/80 px-3 py-2 text-sm outline-none focus:border-[#1f3a2f]"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-[#6b5f54]">
          Author
          <input
            value={form.author}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, author: event.target.value }))
            }
            required
            className="rounded-lg border border-[#e6dccf] bg-white/80 px-3 py-2 text-sm outline-none focus:border-[#1f3a2f]"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-[#6b5f54]">
          Category
          <select
            value={form.categoryId}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, categoryId: event.target.value }))
            }
            required
            className="rounded-lg border border-[#e6dccf] bg-white/80 px-3 py-2 text-sm outline-none focus:border-[#1f3a2f]"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-[#6b5f54]">
          Price (cents)
          <input
            type="number"
            min={0}
            value={form.priceCents}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                priceCents: Number(event.target.value),
              }))
            }
            required
            className="rounded-lg border border-[#e6dccf] bg-white/80 px-3 py-2 text-sm outline-none focus:border-[#1f3a2f]"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-[#6b5f54]">
          Stock
          <input
            type="number"
            min={0}
            value={form.stock}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                stock: Number(event.target.value),
              }))
            }
            required
            className="rounded-lg border border-[#e6dccf] bg-white/80 px-3 py-2 text-sm outline-none focus:border-[#1f3a2f]"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-[#6b5f54]">
          Currency
          <input
            value={form.currency}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, currency: event.target.value }))
            }
            required
            className="rounded-lg border border-[#e6dccf] bg-white/80 px-3 py-2 text-sm outline-none focus:border-[#1f3a2f]"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-[#6b5f54]">
          Image URL
          <input
            value={form.imageUrl}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, imageUrl: event.target.value }))
            }
            required
            className="rounded-lg border border-[#e6dccf] bg-white/80 px-3 py-2 text-sm outline-none focus:border-[#1f3a2f]"
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full border border-[#e6dccf] px-4 py-2 text-xs font-semibold text-[#6b5f54] hover:border-[#d6c8b9] hover:text-[#1f1a17]"
            >
              Upload image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
            {uploading ? (
              <span className="text-xs text-[#6b5f54]">Uploading...</span>
            ) : null}
          </div>
          {form.imageUrl ? (
            <span className="text-xs text-[#6b5f54]">
              Selected: {form.imageUrl}
            </span>
          ) : null}
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-[#6b5f54] lg:col-span-2">
          Description
          <textarea
            value={form.description}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, description: event.target.value }))
            }
            rows={4}
            required
            className="rounded-lg border border-[#e6dccf] bg-white/80 px-3 py-2 text-sm outline-none focus:border-[#1f3a2f]"
          />
        </label>
        {error ? (
          <p className="text-sm text-[#a54b3c] lg:col-span-2">{error}</p>
        ) : null}
        <div className="flex flex-wrap gap-3 lg:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-[#1f3a2f] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#183026] disabled:cursor-not-allowed disabled:bg-[#b9b1a7]"
          >
            {saving ? "Saving..." : form.id ? "Update book" : "Add book"}
          </button>
          {form.id ? (
            <button
              type="button"
              onClick={() => setForm(emptyForm)}
              className="rounded-full border border-[#e6dccf] px-6 py-2 text-sm font-semibold text-[#6b5f54] hover:border-[#d6c8b9] hover:text-[#1f1a17]"
            >
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>

      <div className="space-y-3">
        {books.map((book) => (
          <div
            key={book.id}
            className="flex flex-col gap-3 rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-sm font-semibold text-[#1f1a17]">
                {book.title}
              </p>
              <p className="text-xs text-[#6b5f54]">
                {book.author} · {book.category.name}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleEdit(book)}
                className="rounded-full border border-[#e6dccf] px-4 py-1 text-xs font-semibold text-[#6b5f54] hover:border-[#d6c8b9] hover:text-[#1f1a17]"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(book.id)}
                className="rounded-full border border-[#e7c1b6] px-4 py-1 text-xs font-semibold text-[#a54b3c] hover:border-[#d9a99a]"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
