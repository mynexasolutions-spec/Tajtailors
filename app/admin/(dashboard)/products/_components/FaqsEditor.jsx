"use client";

import { Plus, Trash2 } from "lucide-react";

const inputClass = "w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/35 focus:border-gold-400/50 focus:outline-none";

export default function FaqsEditor({ faqs, onChange }) {
  const update = (idx, key, value) => {
    onChange(faqs.map((f, i) => (i === idx ? { ...f, [key]: value } : f)));
  };

  const add = () => onChange([...faqs, { question: "", answer: "" }]);
  const remove = (idx) => onChange(faqs.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3">
      {faqs.map((f, i) => (
        <div key={i} className="space-y-2 rounded-xl border border-ink/10 p-3">
          <div className="flex items-center gap-2">
            <input
              placeholder="Question"
              value={f.question}
              onChange={(e) => update(i, "question", e.target.value)}
              className={inputClass}
            />
            <button type="button" onClick={() => remove(i)} className="shrink-0 rounded-lg p-2 text-ink/40 hover:bg-ivory-deep hover:text-red-500">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <textarea
            placeholder="Answer"
            rows={2}
            value={f.answer}
            onChange={(e) => update(i, "answer", e.target.value)}
            className={inputClass}
          />
        </div>
      ))}

      <button type="button" onClick={add} className="flex items-center gap-1.5 text-sm text-gold-600 hover:text-gold-700">
        <Plus className="h-4 w-4" /> Add FAQ
      </button>
    </div>
  );
}
