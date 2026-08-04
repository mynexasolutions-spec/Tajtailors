"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Save, CheckCircle2 } from "lucide-react";
import { saveExtraWorkOptions } from "@/actions/admin/extraWork";

const inputClass =
  "w-full rounded-xl border border-ink/10 bg-ivory-deep px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-gold-400/50 focus:bg-white focus:outline-none";

let tempIdCounter = 0;

export default function ExtraWorkManager({ initialOptions }) {
  const [options, setOptions] = useState(
    initialOptions.map((o) => ({ ...o, price: String(o.price) }))
  );
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const update = (idx, patch) => setOptions((list) => list.map((o, i) => (i === idx ? { ...o, ...patch } : o)));
  const add = () => setOptions((list) => [...list, { id: `temp-${tempIdCounter++}`, label: "", price: "0", is_active: true }]);
  const remove = (idx) => setOptions((list) => list.filter((_, i) => i !== idx));

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      const payload = options.map((o) => ({ ...o, id: o.id?.startsWith("temp-") ? null : o.id }));
      const res = await saveExtraWorkOptions(payload);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-gold-400/15 bg-white p-6 shadow-soft md:p-8">
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-500">
            <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse shrink-0" />
            {error}
          </div>
        )}

        {options.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink/45">No extra work options yet — add your first one below.</p>
        ) : (
          <div className="space-y-3">
            {options.map((o, i) => (
              <div key={o.id} className="flex flex-col gap-2.5 rounded-2xl border border-ink/10 p-4 sm:flex-row sm:items-center">
                <input
                  placeholder="e.g. Karigari / Embroidery Work"
                  value={o.label}
                  onChange={(e) => update(i, { label: e.target.value })}
                  className={`${inputClass} sm:flex-1`}
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ink/45">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Price"
                    value={o.price}
                    onChange={(e) => update(i, { price: e.target.value })}
                    className={`${inputClass} w-28`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => update(i, { is_active: !o.is_active })}
                  className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    o.is_active !== false
                      ? "bg-green-500/10 text-green-700 border border-green-500/20"
                      : "bg-ink/5 text-ink/45 border border-ink/10"
                  }`}
                >
                  {o.is_active !== false ? "Active" : "Hidden"}
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="shrink-0 rounded-xl p-2.5 text-ink/40 hover:bg-red-500/10 hover:text-red-500"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={add}
          className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-gold-600 hover:text-gold-700"
        >
          <Plus className="h-4 w-4" /> Add Extra Work
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          className="btn-gold flex items-center gap-2 px-8 py-3.5 text-xs font-semibold uppercase tracking-widest disabled:opacity-60"
        >
          <Save className="h-4 w-4" /> {pending ? "Saving…" : "Save Changes"}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm font-semibold text-green-600 animate-fadeUp">
            <CheckCircle2 className="h-4 w-4" /> Saved
          </span>
        )}
      </div>
    </div>
  );
}
