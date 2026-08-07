"use client";

import { Plus, Trash2 } from "lucide-react";

const inputClass = "w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/35 focus:border-gold-400/50 focus:outline-none";

const FIELD_TYPES = [
  { value: "number", label: "Number (measurement in inches)" },
  { value: "yes_no", label: "Yes / No" },
  { value: "select", label: "Choice (custom options)" },
];

function slugify(text) {
  return (text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/(^_|_$)/g, "");
}

function optionsToText(options) {
  return (options || []).map((o) => o.label).join(", ");
}

function textToOptions(text) {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((label) => ({ key: slugify(label), label }));
}

export default function FieldsEditor({ fields, onChange }) {
  const update = (idx, patch) => {
    onChange(fields.map((f, i) => (i === idx ? { ...f, ...patch } : f)));
  };

  const add = () => onChange([...fields, { key: "", label: "", type: "number" }]);
  const remove = (idx) => onChange(fields.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3">
      {fields.map((f, i) => (
        <div key={i} className="space-y-2 rounded-xl border border-ink/10 p-3">
          <div className="flex items-center gap-2">
            <input
              placeholder="Field label, e.g. Chest"
              value={f.label}
              onChange={(e) => update(i, { label: e.target.value, key: slugify(e.target.value) || f.key })}
              className={`${inputClass} min-w-0 flex-1`}
            />
            <button type="button" onClick={() => remove(i)} className="shrink-0 rounded-lg p-2 text-ink/40 hover:bg-ivory-deep hover:text-red-500">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <select
            value={f.type || "number"}
            onChange={(e) => update(i, { type: e.target.value, ...(e.target.value !== "select" ? { options: undefined } : {}) })}
            className={inputClass}
          >
            {FIELD_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          {f.type === "select" && (
            <input
              placeholder="Options, comma separated — e.g. Straight, Not Straight"
              value={optionsToText(f.options)}
              onChange={(e) => update(i, { options: textToOptions(e.target.value) })}
              className={inputClass}
            />
          )}
          <div className="flex items-center pt-0.5">
            <label className="flex items-center gap-2 text-xs font-semibold text-ink/65 cursor-pointer">
              <input
                type="checkbox"
                checked={f.required !== false}
                onChange={(e) => update(i, { required: e.target.checked })}
                className="h-3.5 w-3.5 rounded border-ink/15 text-gold-500 focus:ring-gold-400/30"
              />
              Required / Mandatory Field
            </label>
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="flex items-center gap-1.5 text-sm text-gold-600 hover:text-gold-700">
        <Plus className="h-4 w-4" /> Add Field
      </button>
    </div>
  );
}
