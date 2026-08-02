"use client";

import { useActionState, useState } from "react";
import { Layers, Check, AlertCircle, Plus, Trash2 } from "lucide-react";
import { updateQuantityDiscountSettings } from "@/actions/admin/quantityDiscount";

const inputClass =
  "w-full rounded-xl border border-ink/10 bg-ivory-deep px-4 py-2.5 text-sm text-ink transition-colors duration-300 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/30";
const labelClass = "mb-1.5 block text-sm font-semibold uppercase tracking-wide text-ink/45";

export default function QuantityDiscountForm({ settings }) {
  const [state, formAction, pending] = useActionState(updateQuantityDiscountSettings, {});
  const [enabled, setEnabled] = useState(settings.enabled);
  const [tiers, setTiers] = useState(settings.tiers.map((t) => ({ ...t })));

  const updateTier = (idx, key, value) => {
    setTiers((prev) => prev.map((t, i) => (i === idx ? { ...t, [key]: value } : t)));
  };

  const addTier = () => {
    const lastQty = tiers.length > 0 ? Math.max(...tiers.map((t) => Number(t.min_quantity) || 0)) : 0;
    setTiers((prev) => [...prev, { min_quantity: lastQty + 1, discount: 0 }]);
  };

  const removeTier = (idx) => setTiers((prev) => prev.filter((_, i) => i !== idx));

  return (
    <form
      action={formAction}
      className="max-w-xl space-y-5 rounded-[2rem] border border-gold-400/15 bg-white p-6 shadow-soft md:p-8"
    >
      <input type="hidden" name="tiers" value={JSON.stringify(tiers)} />

      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600">
          <Layers className="h-4 w-4" />
        </div>
        <h2 className="font-display text-base text-ink">Cart Quantity Discount</h2>
      </div>

      {state.error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-sm text-green-700">
          <Check className="h-4 w-4 shrink-0" /> Quantity discount rules saved.
        </div>
      )}

      <label className="flex items-center gap-3 rounded-xl border border-gold-400/15 bg-ivory-deep px-4 py-3 cursor-pointer">
        <input
          type="checkbox"
          name="enabled"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="h-4 w-4 accent-gold-400"
        />
        <span className="text-sm text-ink">Enable automatic quantity discount at checkout</span>
      </label>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className={labelClass}>Discount Tiers</label>
          <p className="text-sm text-ink/35">Based on total items in cart (any size/variant)</p>
        </div>

        <div className="space-y-2.5">
          {tiers.map((tier, i) => (
            <div key={i} className="flex items-center gap-2.5 rounded-xl border border-ink/10 p-3">
              <div className="flex-1">
                <label className="mb-1 block text-xs uppercase tracking-wide text-ink/35">Min. Items</label>
                <input
                  type="number"
                  min={1}
                  value={tier.min_quantity}
                  onChange={(e) => updateTier(i, "min_quantity", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-xs uppercase tracking-wide text-ink/35">Discount (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={tier.discount}
                  onChange={(e) => updateTier(i, "discount", e.target.value)}
                  className={inputClass}
                />
              </div>
              <button
                type="button"
                onClick={() => removeTier(i)}
                className="mt-5 shrink-0 rounded-lg p-2 text-ink/45 hover:bg-ivory-deep hover:text-red-600"
                aria-label="Remove tier"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addTier}
          className="mt-3 flex items-center gap-1.5 text-sm text-gold-600 hover:text-gold-700"
        >
          <Plus className="h-4 w-4" /> Add Tier
        </button>
      </div>

      <p className="text-sm text-ink/35">
        The highest tier the cart's total item count qualifies for is applied automatically — no coupon code needed. For example, a tier of "5" applies to 5 or more items.
      </p>

      <button type="submit" disabled={pending} className="btn-gold w-full disabled:opacity-60">
        {pending ? "Saving…" : "Save Rules"}
      </button>
    </form>
  );
}
