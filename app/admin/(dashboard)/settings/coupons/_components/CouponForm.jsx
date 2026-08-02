"use client";

import { useActionState } from "react";
import { PlusCircle } from "lucide-react";
import { createCoupon } from "@/actions/admin/coupons";

const inputClass =
  "w-full rounded-xl border border-ink/10 bg-ivory-deep px-4 py-2.5 text-sm text-ink placeholder:text-ink/35 transition-colors duration-300 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/30";
const labelClass = "mb-1.5 block text-sm font-semibold uppercase tracking-wide text-ink/45";

export default function CouponForm() {
  const [state, formAction, pending] = useActionState(createCoupon, {});

  return (
    <form
      action={formAction}
      className="h-fit space-y-4 rounded-[2rem] border border-gold-400/15 bg-white p-6 shadow-soft"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600">
          <PlusCircle className="h-4 w-4" />
        </div>
        <h2 className="font-display text-base text-ink">Create Coupon</h2>
      </div>
      {state.error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-600">{state.error}</p>
      )}
      <div>
        <label className={labelClass}>Code</label>
        <input required name="code" placeholder="TAJTAILOR10" className={inputClass} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Type</label>
          <select name="type" className={inputClass}>
            <option value="percent">Percent Off</option>
            <option value="flat">Flat Amount Off</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Value</label>
          <input required type="number" name="value" placeholder="10" className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Minimum Purchase (₹)</label>
        <input type="number" name="min_purchase" placeholder="0" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Expires On (optional)</label>
        <input type="date" name="expires_at" className={inputClass} />
      </div>
      <button type="submit" disabled={pending} className="btn-gold w-full disabled:opacity-60">
        {pending ? "Creating…" : "Create Coupon"}
      </button>
    </form>
  );
}
