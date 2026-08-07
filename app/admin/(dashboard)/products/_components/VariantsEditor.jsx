"use client";

import { Plus, Trash2, X } from "lucide-react";

const inputClass = "w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/35 focus:border-gold-400/50 focus:outline-none";
const errorInputClass = "border-red-500/60 focus:border-red-500/60";

function computeVariantName(colorName, sizeName) {
  const color = (colorName || "").trim();
  const size = (sizeName || "").trim();
  if (color && size) return `${color} - ${size}`;
  return color || size;
}

export default function VariantsEditor({ variants, onChange, showErrors, label = "Variant" }) {
  const mode = label === "Color" ? "color" : label === "Both" ? "both" : "size";

  if (mode === "both") {
    return <BothModeEditor variants={variants} onChange={onChange} showErrors={showErrors} />;
  }

  const isColor = mode === "color";

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

// "Both" mode: each color is its own group of size rows, so stock/price can
// be set independently per color+size combination (e.g. Navy has L/XL in
// stock, White only has M) instead of one flat list.
function BothModeEditor({ variants, onChange, showErrors }) {
  const groups = [];
  const groupIndex = new Map();
  variants.forEach((v, i) => {
    const key = v.color_name || "";
    if (!groupIndex.has(key)) {
      groupIndex.set(key, groups.length);
      groups.push({ color_name: v.color_name || "", color_hex: v.color_hex || "#cccccc", rows: [] });
    }
    groups[groupIndex.get(key)].rows.push(i);
  });

  const setRow = (idx, patch) => {
    onChange(variants.map((v, i) => (i === idx ? { ...v, ...patch } : v)));
  };

  const updateColorMeta = (groupKey, patch) => {
    onChange(
      variants.map((v) => {
        if ((v.color_name || "") !== groupKey) return v;
        const next = { ...v, ...patch };
        next.variant_name = computeVariantName(next.color_name, next.size_name);
        return next;
      })
    );
  };

  const updateSize = (idx, key, value) => {
    const row = variants[idx];
    const next = { ...row, [key]: value };
    if (key === "size_name") next.variant_name = computeVariantName(next.color_name, value);
    setRow(idx, next);
  };

  const addColor = () => {
    onChange([
      ...variants,
      { variant_name: "", price: "", original_price: "", stock_quantity: "", color_hex: "#cccccc", color_name: "", size_name: "" },
    ]);
  };

  const addSize = (groupKey, colorHex) => {
    onChange([
      ...variants,
      { variant_name: "", price: "", original_price: "", stock_quantity: "", color_hex: colorHex, color_name: groupKey, size_name: "" },
    ]);
  };

  const removeColor = (groupKey) => {
    onChange(variants.filter((v) => (v.color_name || "") !== groupKey));
  };

  const removeRow = (idx) => onChange(variants.filter((_, i) => i !== idx));

  return (
    <div className="space-y-4">
      {groups.map((group, gi) => (
        <div key={gi} className="rounded-2xl border border-ink/10 p-3 space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={group.color_hex}
              onChange={(e) => updateColorMeta(group.color_name, { color_hex: e.target.value })}
              title="Swatch color shown to customers"
              className="h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-ink/10 bg-white p-1"
            />
            <input
              placeholder="Color name (e.g. Navy)"
              value={group.color_name}
              onChange={(e) => updateColorMeta(group.color_name, { color_name: e.target.value })}
              className={`${inputClass} ${showErrors && !group.color_name.trim() ? errorInputClass : ""}`}
            />
            <button
              type="button"
              onClick={() => removeColor(group.color_name)}
              className="flex h-fit shrink-0 items-center justify-center rounded-lg p-2 text-ink/40 hover:bg-ivory-deep hover:text-red-500"
              title="Remove this color and all its sizes"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2 pl-2">
            {group.rows.map((idx) => {
              const v = variants[idx];
              const sizeMissing = showErrors && !v.size_name?.trim();
              const priceMissing = showErrors && (v.price === "" || v.price == null || Number(v.price) <= 0);
              const stockMissing = showErrors && (v.stock_quantity === "" || v.stock_quantity == null || Number(v.stock_quantity) < 0);

              return (
                <div key={idx} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]">
                  <div>
                    <input
                      placeholder="Size (e.g. L)"
                      value={v.size_name || ""}
                      onChange={(e) => updateSize(idx, "size_name", e.target.value)}
                      className={`${inputClass} ${sizeMissing ? errorInputClass : ""}`}
                    />
                    {sizeMissing && <p className="mt-1 text-[11px] text-red-400">Size required</p>}
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Price"
                      value={v.price}
                      onChange={(e) => updateSize(idx, "price", e.target.value)}
                      className={`${inputClass} ${priceMissing ? errorInputClass : ""}`}
                    />
                    {priceMissing && <p className="mt-1 text-[11px] text-red-400">Valid price required</p>}
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Old price"
                      value={v.original_price}
                      onChange={(e) => updateSize(idx, "original_price", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Stock"
                      value={v.stock_quantity}
                      onChange={(e) => updateSize(idx, "stock_quantity", e.target.value)}
                      className={`${inputClass} ${stockMissing ? errorInputClass : ""}`}
                    />
                    {stockMissing && <p className="mt-1 text-[11px] text-red-400">Stock required</p>}
                  </div>
                  <button type="button" onClick={() => removeRow(idx)} className="flex h-fit items-center justify-center rounded-lg p-2 text-ink/40 hover:bg-ivory-deep hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => addSize(group.color_name, group.color_hex)}
              className="flex items-center gap-1.5 text-xs font-semibold text-gold-600 hover:text-gold-700"
            >
              <Plus className="h-3.5 w-3.5" /> Add Size to {group.color_name || "this color"}
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addColor}
        className="flex items-center gap-1.5 text-sm text-gold-600 hover:text-gold-700"
      >
        <Plus className="h-4 w-4" /> Add Color
      </button>
    </div>
  );
}
