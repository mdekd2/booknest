import { NextResponse } from "next/server";
import path from "path";
import { randomUUID } from "crypto";
import { writeFile, mkdir } from "fs/promises";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only images are allowed." }, { status: 400 });
  }

  const extension = file.name.split(".").pop() || "png";
  const filename = `${randomUUID()}.${extension}`;
  const uploadsDir = path.join(process.cwd(), "public", "images", "books");

  await mkdir(uploadsDir, { recursive: true });
  const bytes = await file.arrayBuffer();
  await writeFile(path.join(uploadsDir, filename), Buffer.from(bytes));

  return NextResponse.json({ url: `/images/books/${filename}` });
}
