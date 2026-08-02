"use client";

import { useActionState } from "react";
import { Truck, Check, AlertCircle } from "lucide-react";
import { updateShippingSettings } from "@/actions/admin/shipping";

const inputClass =
  "w-full rounded-xl border border-ink/10 bg-ivory-deep px-4 py-2.5 text-sm text-ink transition-colors duration-300 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/30";
const labelClass = "mb-1.5 block text-sm font-semibold uppercase tracking-wide text-ink/45";

export default function ShippingForm({ shipping }) {
  const [state, formAction, pending] = useActionState(updateShippingSettings, {});

  return (
    <form
      action={formAction}
      className="max-w-md space-y-5 rounded-[2rem] border border-gold-400/15 bg-white p-6 shadow-soft md:p-8"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600">
          <Truck className="h-4 w-4" />
        </div>
        <h2 className="font-display text-base text-ink">Delivery Rates</h2>
      </div>

      {state.error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-sm text-green-700">
          <Check className="h-4 w-4 shrink-0" /> Shipping settings saved.
        </div>
      )}

      <div>
        <label className={labelClass}>Flat Shipping Rate (₹)</label>
        <input type="number" name="flat_rate" defaultValue={shipping.flat_rate} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Free Shipping Above (₹)</label>
        <input type="number" name="free_threshold" defaultValue={shipping.free_threshold} className={inputClass} />
        <p className="mt-1.5 text-sm text-ink/35">Orders above this amount ship for free.</p>
      </div>
      <div>
        <label className={labelClass}>Cash on Delivery Fee (₹)</label>
        <input type="number" name="cod_charge" defaultValue={shipping.cod_charge} className={inputClass} />
      </div>
      <button type="submit" disabled={pending} className="btn-gold w-full disabled:opacity-60">
        {pending ? "Saving…" : "Save Settings"}
      </button>
    </form>
  );
}
