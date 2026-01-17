import { NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth";
import { getOrdersByUser } from "@/lib/firestore";

export async function GET() {
  const session = await getServerUser();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await getOrdersByUser(session.user.id);

  return NextResponse.json(orders);
}
