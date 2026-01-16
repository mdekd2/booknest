"use client";

import { useState } from "react";
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
  currency: "USD",
  stock: 0,
  imageUrl: "/images/books/placeholder.svg",
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Books</h1>
          <p className="text-sm text-slate-500">
            Create and manage the BookNest catalog.
          </p>
        </div>
        <Link
          href="/admin"
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300"
        >
          Back to dashboard
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-2"
      >
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Title
          <input
            value={form.title}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, title: event.target.value }))
            }
            required
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Slug
          <input
            value={form.slug}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, slug: event.target.value }))
            }
            required
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Author
          <input
            value={form.author}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, author: event.target.value }))
            }
            required
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Category
          <select
            value={form.categoryId}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, categoryId: event.target.value }))
            }
            required
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
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
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
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
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Currency
          <input
            value={form.currency}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, currency: event.target.value }))
            }
            required
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Image URL
          <input
            value={form.imageUrl}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, imageUrl: event.target.value }))
            }
            required
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 lg:col-span-2">
          Description
          <textarea
            value={form.description}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, description: event.target.value }))
            }
            rows={4}
            required
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
        </label>
        {error ? (
          <p className="text-sm text-rose-500 lg:col-span-2">{error}</p>
        ) : null}
        <div className="flex flex-wrap gap-3 lg:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {saving ? "Saving..." : form.id ? "Update book" : "Add book"}
          </button>
          {form.id ? (
            <button
              type="button"
              onClick={() => setForm(emptyForm)}
              className="rounded-full border border-slate-200 px-6 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
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
            className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {book.title}
              </p>
              <p className="text-xs text-slate-500">
                {book.author} · {book.category.name}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleEdit(book)}
                className="rounded-full border border-slate-200 px-4 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(book.id)}
                className="rounded-full border border-rose-200 px-4 py-1 text-xs font-semibold text-rose-600 hover:border-rose-300"
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
