"use client";

import { Plus, Trash2 } from "lucide-react";

const inputClass = "w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/35 focus:border-gold-400/50 focus:outline-none";
const errorInputClass = "border-red-500/60 focus:border-red-500/60";

export default function VariantsEditor({ variants, onChange, showErrors, label = "Variant" }) {
  const isColor = label === "Color";

  const update = (idx, key, value) => {
    onChange(variants.map((v, i) => (i === idx ? { ...v, [key]: value } : v)));
  };

  const add = () => {
    onChange([
      ...variants,
      { variant_name: "", price: "", original_price: "", stock_quantity: "", color_hex: isColor ? "#cccccc" : null },
    ]);
  };

  const remove = (idx) => onChange(variants.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3">
      {variants.map((v, i) => {
        const nameMissing = showErrors && !v.variant_name?.trim();
        const priceMissing = showErrors && (v.price === "" || v.price == null || Number(v.price) <= 0);
        const stockMissing = showErrors && (v.stock_quantity === "" || v.stock_quantity == null || Number(v.stock_quantity) < 0);

        return (
          <div
            key={i}
            className={`grid grid-cols-1 gap-2 rounded-xl border border-ink/10 p-3 ${
              isColor ? "sm:grid-cols-[auto_1fr_1fr_1fr_1fr_auto]" : "sm:grid-cols-[1fr_1fr_1fr_1fr_auto]"
            }`}
          >
            {isColor && (
              <div className="flex items-center justify-center">
                <input
                  type="color"
                  value={v.color_hex || "#cccccc"}
                  onChange={(e) => update(i, "color_hex", e.target.value)}
                  title="Swatch color shown to customers"
                  className="h-10 w-10 cursor-pointer rounded-lg border border-ink/10 bg-white p-1"
                />
              </div>
            )}
            <div>
              <input
                placeholder={`${label} name`}
                value={v.variant_name}
                onChange={(e) => update(i, "variant_name", e.target.value)}
                className={`${inputClass} ${nameMissing ? errorInputClass : ""}`}
              />
              {nameMissing && <p className="mt-1 text-[11px] text-red-400">{label} name required</p>}
            </div>
            <div>
              <input
                type="number"
                placeholder="Price"
                value={v.price}
                onChange={(e) => update(i, "price", e.target.value)}
                className={`${inputClass} ${priceMissing ? errorInputClass : ""}`}
              />
              {priceMissing && <p className="mt-1 text-[11px] text-red-400">Valid price required</p>}
            </div>
            <div>
              <input
                type="number"
                placeholder="Old price"
                value={v.original_price}
                onChange={(e) => update(i, "original_price", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Stock"
                value={v.stock_quantity}
                onChange={(e) => update(i, "stock_quantity", e.target.value)}
                className={`${inputClass} ${stockMissing ? errorInputClass : ""}`}
              />
              {stockMissing && <p className="mt-1 text-[11px] text-red-400">Stock required</p>}
            </div>
            <button type="button" onClick={() => remove(i)} className="flex h-fit items-center justify-center rounded-lg p-2 text-ink/40 hover:bg-ivory-deep hover:text-red-500">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      })}

      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 text-sm text-gold-600 hover:text-gold-700"
      >
        <Plus className="h-4 w-4" /> Add {label}
      </button>
    </div>
  );
}
