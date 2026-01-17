import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: Promise<{ id?: string }> };

const allowedStatuses = [
  "PENDING",
  "CONFIRMED",
  "READY",
  "IN_TRANSIT",
  "DELIVERED",
  "CANCELLED",
] as const;

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const resolvedParams = await params;
  if (!resolvedParams?.id) {
    return NextResponse.json({ error: "Missing order id." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const status = String(body.status ?? "");
    if (!allowedStatuses.includes(status as typeof allowedStatuses[number])) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: resolvedParams.id },
      data: { status },
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 400 }
    );
  }
}
