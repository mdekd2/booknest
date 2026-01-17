"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";

type OrderItem = {
  bookId: string;
  title: string;
  quantity: number;
};

type Order = {
  id: string;
  createdAt: string;
  totalCents: number;
  currency: string;
  status: string;
  userEmail?: string | null;
  items: OrderItem[];
};

type AdminOrdersClientProps = {
  initialOrders: Order[];
  labels: {
    status: string;
    orderTotal: string;
    pending: string;
    confirmed: string;
    ready: string;
    inTransit: string;
    delivered: string;
    cancelled: string;
  };
};

const statusOptions = [
  { value: "PENDING", key: "pending" },
  { value: "CONFIRMED", key: "confirmed" },
  { value: "READY", key: "ready" },
  { value: "IN_TRANSIT", key: "inTransit" },
  { value: "DELIVERED", key: "delivered" },
  { value: "CANCELLED", key: "cancelled" },
] as const;

export function AdminOrdersClient({
  initialOrders,
  labels,
}: AdminOrdersClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [saving, setSaving] = useState<string | null>(null);

  const updateStatus = async (orderId: string, status: string) => {
    setSaving(orderId);
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error("Update failed");
      }
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="rounded-3xl border border-[#e6dccf] bg-white/70 p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase text-[#6b5f54]">
                {order.userEmail ?? "—"}
              </p>
              <p className="text-sm text-[#6b5f54]">
                {labels.orderTotal} {formatPrice(order.totalCents)}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#6b5f54]">
              <span>{labels.status}</span>
              <select
                value={order.status}
                onChange={(event) => updateStatus(order.id, event.target.value)}
                disabled={saving === order.id}
                className="rounded-full border border-[#e6dccf] bg-white/80 px-3 py-1 text-xs font-semibold text-[#1f1a17]"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {labels[option.key]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <ul className="mt-3 space-y-1 text-sm text-[#6b5f54]">
            {order.items.map((item, index) => (
              <li key={`${item.bookId}-${index}`}>
                {item.title} × {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
