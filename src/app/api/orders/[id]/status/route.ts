import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { updateOrderStatus } from "@/lib/firestore";

type RouteParams = { params: Promise<{ id?: string }> };

const allowedStatuses = [
  "PENDING",
  "CONFIRMED",
  "READY",
  "IN_TRANSIT",
  "DELIVERED",
  "CANCELLED",
] as const;

type AllowedStatus = (typeof allowedStatuses)[number];

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const resolvedParams = await params;
  if (!resolvedParams?.id) {
    return NextResponse.json({ error: "Missing order id." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const status = String(body.status ?? "");
    if (!allowedStatuses.includes(status as AllowedStatus)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    const order = await updateOrderStatus(
      resolvedParams.id,
      status as AllowedStatus
    );

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 400 }
    );
  }
}
