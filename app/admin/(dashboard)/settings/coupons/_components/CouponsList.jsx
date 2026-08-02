"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Tag } from "lucide-react";
import { toggleCoupon, deleteCoupon } from "@/actions/admin/coupons";

export default function CouponsList({ coupons }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleToggle = (id, active) => {
    startTransition(async () => {
      await toggleCoupon(id, active);
      router.refresh();
    });
  };

  const handleDelete = (id) => {
    startTransition(async () => {
      await deleteCoupon(id);
      router.refresh();
    });
  };

  if (coupons.length === 0) {
    return (
      <div className="rounded-[2rem] border border-gold-400/15 bg-white py-12 text-center shadow-soft">
        <p className="text-sm text-ink/45">No coupons yet — create your first one.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-gold-400/15 bg-white p-4 shadow-soft sm:p-6">
      <ul className="space-y-3">
        {coupons.map((c) => {
          const expired = c.expires_at && new Date(c.expires_at) < new Date();
          return (
            <li
              key={c.id}
              className="flex flex-col gap-3 rounded-2xl border border-gold-400/15 bg-ivory-deep p-4 sm:flex-row sm:items-center"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600">
                <Tag className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-sm text-ink">{c.code}</p>
                  {expired && (
                    <span className="rounded-full border border-red-500/25 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-600">
                      Expired
                    </span>
                  )}
                </div>
                <p className="text-sm text-ink/45">
                  {c.type === "percent" ? `${c.value}% off` : `₹${c.value} off`}
                  {c.min_purchase > 0 ? ` · min ₹${c.min_purchase}` : ""}
                  {c.expires_at ? ` · expires ${new Date(c.expires_at).toLocaleDateString("en-IN")}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-start">
                <label className="flex items-center gap-2 text-sm text-ink/60">
                  <input type="checkbox" checked={c.is_active} disabled={pending} onChange={(e) => handleToggle(c.id, e.target.checked)} />
                  Active
                </label>
                <button
                  onClick={() => handleDelete(c.id)}
                  disabled={pending}
                  className="rounded-xl p-2 text-ink/45 transition-colors hover:bg-red-500/10 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
