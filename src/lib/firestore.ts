import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";

export type Category = {
  id: string;
  name: string;
  slug: string;
  createdAt?: Date | null;
};

export type Book = {
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
  createdAt?: Date | null;
};

export type OrderItem = {
  bookId: string;
  title: string;
  quantity: number;
  priceCents: number;
  imageUrl?: string;
};

export type Order = {
  id: string;
  userId: string;
  userEmail?: string | null;
  totalCents: number;
  currency: string;
  status: string;
  items: OrderItem[];
  stripeSessionId?: string;
  createdAt?: Date | null;
};

const toDate = (value: unknown) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "object" && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate();
  }
  return null;
};

export async function getCategories() {
  const db = getAdminDb();
  const snapshot = await db.collection("categories").orderBy("name").get();
  return snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<Category, "id"> & { createdAt?: unknown };
    return { id: doc.id, ...data, createdAt: toDate(data.createdAt) };
  });
}

export async function getCategoryBySlug(slug: string) {
  const db = getAdminDb();
  const snapshot = await db
    .collection("categories")
    .where("slug", "==", slug)
    .limit(1)
    .get();
  const doc = snapshot.docs[0];
  if (!doc) return null;
  const data = doc.data() as Omit<Category, "id"> & { createdAt?: unknown };
  return { id: doc.id, ...data, createdAt: toDate(data.createdAt) };
}

export async function getBooks() {
  const db = getAdminDb();
  const snapshot = await db.collection("books").orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<Book, "id"> & { createdAt?: unknown };
    return { id: doc.id, ...data, createdAt: toDate(data.createdAt) };
  });
}

export async function getBooksByIds(ids: string[]) {
  if (ids.length === 0) return [];
  const db = getAdminDb();
  const snapshot = await db
    .collection("books")
    .where("__name__", "in", ids.slice(0, 10))
    .get();
  return snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<Book, "id"> & { createdAt?: unknown };
    return { id: doc.id, ...data, createdAt: toDate(data.createdAt) };
  });
}

export async function getBookBySlug(slug: string) {
  const db = getAdminDb();
  const snapshot = await db
    .collection("books")
    .where("slug", "==", slug)
    .limit(1)
    .get();
  const doc = snapshot.docs[0];
  if (!doc) return null;
  const data = doc.data() as Omit<Book, "id"> & { createdAt?: unknown };
  return { id: doc.id, ...data, createdAt: toDate(data.createdAt) };
}

export async function createCategory(data: Omit<Category, "id" | "createdAt">) {
  const db = getAdminDb();
  const ref = await db.collection("categories").add({
    ...data,
    createdAt: FieldValue.serverTimestamp(),
  });
  const snapshot = await ref.get();
  const stored = snapshot.data() as Omit<Category, "id"> & { createdAt?: unknown };
  return { id: ref.id, ...stored, createdAt: toDate(stored.createdAt) };
}

export async function updateCategory(id: string, data: Partial<Category>) {
  const db = getAdminDb();
  const ref = db.collection("categories").doc(id);
  await ref.update(data);
  const snapshot = await ref.get();
  const stored = snapshot.data() as Omit<Category, "id"> & { createdAt?: unknown };
  return { id: ref.id, ...stored, createdAt: toDate(stored.createdAt) };
}

export async function deleteCategory(id: string) {
  const db = getAdminDb();
  await db.collection("categories").doc(id).delete();
}

export async function createBook(data: Omit<Book, "id" | "createdAt">) {
  const db = getAdminDb();
  const ref = await db.collection("books").add({
    ...data,
    createdAt: FieldValue.serverTimestamp(),
  });
  const snapshot = await ref.get();
  const stored = snapshot.data() as Omit<Book, "id"> & { createdAt?: unknown };
  return { id: ref.id, ...stored, createdAt: toDate(stored.createdAt) };
}

export async function updateBook(id: string, data: Partial<Book>) {
  const db = getAdminDb();
  const ref = db.collection("books").doc(id);
  await ref.update(data);
  const snapshot = await ref.get();
  const stored = snapshot.data() as Omit<Book, "id"> & { createdAt?: unknown };
  return { id: ref.id, ...stored, createdAt: toDate(stored.createdAt) };
}

export async function deleteBook(id: string) {
  const db = getAdminDb();
  await db.collection("books").doc(id).delete();
}

export async function getOrdersByUser(userId: string) {
  const db = getAdminDb();
  const snapshot = await db
    .collection("orders")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();
  return snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<Order, "id"> & { createdAt?: unknown };
    return { id: doc.id, ...data, createdAt: toDate(data.createdAt) };
  });
}

export async function getAllOrders() {
  const db = getAdminDb();
  const snapshot = await db.collection("orders").orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<Order, "id"> & { createdAt?: unknown };
    return { id: doc.id, ...data, createdAt: toDate(data.createdAt) };
  });
}

export async function createOrder(data: Omit<Order, "id" | "createdAt">) {
  const db = getAdminDb();
  const ref = await db.collection("orders").add({
    ...data,
    createdAt: FieldValue.serverTimestamp(),
  });
  const snapshot = await ref.get();
  const stored = snapshot.data() as Omit<Order, "id"> & { createdAt?: unknown };
  return { id: ref.id, ...stored, createdAt: toDate(stored.createdAt) };
}

export async function updateOrderStatus(orderId: string, status: string) {
  const db = getAdminDb();
  const ref = db.collection("orders").doc(orderId);
  await ref.update({ status });
  const snapshot = await ref.get();
  const stored = snapshot.data() as Omit<Order, "id"> & { createdAt?: unknown };
  return { id: ref.id, ...stored, createdAt: toDate(stored.createdAt) };
}

export async function getOrderByStripeSessionId(sessionId: string) {
  const db = getAdminDb();
  const snapshot = await db
    .collection("orders")
    .where("stripeSessionId", "==", sessionId)
    .limit(1)
    .get();
  const doc = snapshot.docs[0];
  if (!doc) return null;
  const data = doc.data() as Omit<Order, "id"> & { createdAt?: unknown };
  return { id: doc.id, ...data, createdAt: toDate(data.createdAt) };
}
