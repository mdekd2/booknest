"use client";

import { useState } from "react";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type CategoriesAdminClientProps = {
  initialCategories: Category[];
};

export function CategoriesAdminClient({
  initialCategories,
}: CategoriesAdminClientProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [form, setForm] = useState({ id: "", name: "", slug: "" });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleEdit = (category: Category) => {
    setForm({ id: category.id, name: category.name, slug: category.slug });
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm("Delete this category?")) {
      return;
    }
    await fetch(`/api/categories/${categoryId}`, { method: "DELETE" });
    setCategories((prev) => prev.filter((category) => category.id !== categoryId));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const response = await fetch(
        form.id ? `/api/categories/${form.id}` : "/api/categories",
        {
          method: form.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: form.name, slug: form.slug }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Save failed");
      }

      const data = await response.json();
      if (form.id) {
        setCategories((prev) =>
          prev.map((category) => (category.id === data.id ? data : category))
        );
      } else {
        setCategories((prev) => [data, ...prev]);
      }
      setForm({ id: "", name: "", slug: "" });
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
          <h1 className="text-2xl font-semibold text-[#1f1a17]">Categories</h1>
          <p className="text-sm text-[#6b5f54]">
            Create and manage book categories.
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
        className="grid gap-4 rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-6 shadow-sm md:grid-cols-2"
      >
        <label className="flex flex-col gap-2 text-sm font-medium text-[#6b5f54]">
          Name
          <input
            value={form.name}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, name: event.target.value }))
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
        {error ? (
          <p className="text-sm text-[#a54b3c] md:col-span-2">{error}</p>
        ) : null}
        <div className="flex flex-wrap gap-3 md:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-[#1f3a2f] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#183026] disabled:cursor-not-allowed disabled:bg-[#b9b1a7]"
          >
            {saving ? "Saving..." : form.id ? "Update category" : "Add category"}
          </button>
          {form.id ? (
            <button
              type="button"
              onClick={() => setForm({ id: "", name: "", slug: "" })}
              className="rounded-full border border-[#e6dccf] px-6 py-2 text-sm font-semibold text-[#6b5f54] hover:border-[#d6c8b9] hover:text-[#1f1a17]"
            >
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>

      <div className="space-y-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between rounded-3xl border border-[#e6dccf] bg-[#fffaf4] p-4 shadow-sm"
          >
            <div>
              <p className="text-sm font-semibold text-[#1f1a17]">
                {category.name}
              </p>
              <p className="text-xs text-[#6b5f54]">{category.slug}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleEdit(category)}
                className="rounded-full border border-[#e6dccf] px-4 py-1 text-xs font-semibold text-[#6b5f54] hover:border-[#d6c8b9] hover:text-[#1f1a17]"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(category.id)}
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
