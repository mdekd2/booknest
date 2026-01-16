import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
});

export const bookSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required"),
  author: z.string().min(2, "Author is required"),
  description: z.string().min(10, "Description is required"),
  priceCents: z.number().int().positive(),
  currency: z.string().min(3),
  stock: z.number().int().nonnegative(),
  imageUrl: z.string().min(3),
  categoryId: z.string().min(1),
});

export const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        bookId: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
});
