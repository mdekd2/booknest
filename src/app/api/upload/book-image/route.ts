import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getAdminStorage } from "@/lib/firebase/admin";

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
  const objectPath = `images/books/${filename}`;
  const bytes = await file.arrayBuffer();

  const storage = getAdminStorage();
  const bucket = storage.bucket();
  if (!bucket?.name) {
    return NextResponse.json(
      { error: "Storage bucket is not configured." },
      { status: 500 }
    );
  }

  const fileRef = bucket.file(objectPath);
  await fileRef.save(Buffer.from(bytes), {
    contentType: file.type,
    resumable: false,
  });
  try {
    await fileRef.makePublic();
  } catch {
    // Ignore if public access is restricted; signed URL could be added later.
  }

  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${objectPath}`;
  return NextResponse.json({ url: publicUrl });
}
