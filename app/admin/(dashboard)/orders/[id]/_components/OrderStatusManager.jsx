"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus, updatePaymentStatus } from "@/actions/admin/orders";

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

const STATUS_STYLES = {
  pending: "text-ink/70",
  processing: "text-gold-600",
  shipped: "text-blue-700",
  delivered: "text-green-700",
  cancelled: "text-red-600",
  paid: "text-green-700",
  failed: "text-red-600",
  refunded: "text-blue-700",
};

const selectClass =
  "w-full rounded-xl border border-ink/10 bg-ivory-deep px-4 py-2.5 text-sm capitalize text-ink transition-colors duration-300 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/30 disabled:opacity-50";
const labelClass = "mb-1.5 block text-sm font-semibold uppercase tracking-wide text-ink/45";

export default function OrderStatusManager({ order }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleOrderStatus = (e) => {
    startTransition(async () => {
      await updateOrderStatus(order.id, e.target.value);
      router.refresh();
    });
  };

  const handlePaymentStatus = (e) => {
    startTransition(async () => {
      await updatePaymentStatus(order.id, e.target.value);
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Order Status</label>
        <select
          defaultValue={order.order_status}
          onChange={handleOrderStatus}
          disabled={pending}
          className={`${selectClass} ${STATUS_STYLES[order.order_status] || ""}`}
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s} className="bg-white capitalize text-ink">{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass}>Payment Status</label>
        <select
          defaultValue={order.payment_status}
          onChange={handlePaymentStatus}
          disabled={pending}
          className={`${selectClass} ${STATUS_STYLES[order.payment_status] || ""}`}
        >
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s} className="bg-white capitalize text-ink">{s}</option>
          ))}
        </select>
      </div>
      {pending && <p className="text-sm text-gold-600/80">Updating…</p>}
    </div>
  );
}
