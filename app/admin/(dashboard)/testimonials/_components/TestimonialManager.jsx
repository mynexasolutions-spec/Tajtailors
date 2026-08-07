"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, Pencil, Quote } from "lucide-react";
import StarRating from "@/components/StarRating";
import ImageUploader from "@/components/admin/ImageUploader";
import { createTestimonial, updateTestimonial, toggleTestimonial, deleteTestimonial } from "@/actions/admin/testimonials";

const inputClass =
  "w-full rounded-xl border border-ink/10 bg-ivory-deep px-4 py-2.5 text-sm text-ink placeholder:text-ink/35 transition-colors duration-300 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/30";
const panelClass =
  "rounded-[2rem] border border-gold-400/15 bg-white shadow-soft";

const RATING_OPTIONS = [5, 4.5, 4, 3.5, 3];

function RatingPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {RATING_OPTIONS.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onChange(r)}
          className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors duration-300 ${
            Number(value) === r
              ? "border-gold-400/50 bg-gold-400/10 text-gold-700"
              : "border-ink/10 bg-ivory-deep text-ink/60 hover:border-gold-400/30"
          }`}
        >
          {r}★
        </button>
      ))}
    </div>
  );
}

function TestimonialEditForm({ testimonial, onCancel, onSaved }) {
  const [pending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState(testimonial.image_url);
  const [form, setForm] = useState({
    customer_name: testimonial.customer_name || "",
    location: testimonial.location || "",
    review_text: testimonial.review_text || "",
    rating: testimonial.rating || 5,
  });

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateTestimonial(testimonial.id, { ...form, image_url: imageUrl });
      if (result.success) onSaved();
    });
  };

  return (
    <form onSubmit={handleSave} className="w-full space-y-3 rounded-2xl border border-gold-400/20 bg-ivory-deep p-4">
      <ImageUploader value={imageUrl} onChange={setImageUrl} folder="tajtailor/testimonials" />
      <input placeholder="Customer Name" value={form.customer_name} onChange={update("customer_name")} className={inputClass} required />
      <input placeholder="Location (e.g. Delhi)" value={form.location} onChange={update("location")} className={inputClass} />
      <textarea placeholder="Review text" value={form.review_text} onChange={update("review_text")} rows={4} className={inputClass} required />
      <div>
        <label className="mb-1.5 block text-sm font-semibold uppercase tracking-wide text-ink/45">Rating</label>
        <RatingPicker value={form.rating} onChange={(r) => setForm((f) => ({ ...f, rating: r }))} />
      </div>
      <div className="flex items-center gap-2 pt-1">
        <button type="submit" disabled={pending} className="btn-gold flex-1 py-2.5 text-sm disabled:opacity-60">
          {pending ? "Saving…" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={pending}
          className="rounded-xl border border-gold-400/10 px-4 py-2.5 text-sm text-ink/60 transition-colors hover:border-gold-400/25 hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function TestimonialManager({ testimonials }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState(null);
  const [form, setForm] = useState({ customer_name: "", location: "", review_text: "", rating: 5 });
  const [editingId, setEditingId] = useState(null);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleAdd = (e) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await createTestimonial({ ...form, image_url: imageUrl });
      if (result.success) {
        setImageUrl(null);
        setForm({ customer_name: "", location: "", review_text: "", rating: 5 });
        router.refresh();
      }
    });
  };

  const handleToggle = (id, active) => {
    startTransition(async () => {
      await toggleTestimonial(id, active);
      router.refresh();
    });
  };

  const handleDelete = (id) => {
    startTransition(async () => {
      await deleteTestimonial(id);
      router.refresh();
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <div className={`${panelClass} order-2 min-w-0 p-6 md:p-8 lg:order-1`}>
        <h2 className="mb-4 font-display text-lg text-ink">Existing Testimonials</h2>
        {testimonials.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink/45">No testimonials yet — the homepage will show default sample quotes.</p>
        ) : (
          <ul className="space-y-3">
            {testimonials.map((t) =>
              editingId === t.id ? (
                <li key={t.id}>
                  <TestimonialEditForm
                    testimonial={t}
                    onCancel={() => setEditingId(null)}
                    onSaved={() => { setEditingId(null); router.refresh(); }}
                  />
                </li>
              ) : (
                <li
                  key={t.id}
                  className="flex flex-col gap-3 rounded-2xl border border-gold-400/10 bg-ivory-deep p-4 sm:flex-row sm:items-center"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-ivory-deep">
                    {t.image_url ? (
                      <Image src={t.image_url} alt="" fill sizes="56px" className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-ink/25">
                        <Quote className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <StarRating rating={t.rating} size={12} />
                    <p className="truncate text-sm text-ink">{t.customer_name} {t.location && <span className="text-ink/45">· {t.location}</span>}</p>
                    <p className="truncate text-sm text-ink/45">{t.review_text}</p>
                  </div>
                  <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-start">
                    <label className="flex items-center gap-2 text-sm text-ink/60">
                      <input type="checkbox" checked={t.is_active} disabled={pending} onChange={(e) => handleToggle(t.id, e.target.checked)} />
                      Active
                    </label>
                    <button
                      onClick={() => setEditingId(t.id)}
                      disabled={pending}
                      className="rounded-xl p-2 text-ink/45 transition-colors hover:bg-gold-400/10 hover:text-gold-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      disabled={pending}
                      className="rounded-xl p-2 text-ink/45 transition-colors hover:bg-red-500/10 hover:text-red-600"
                    >
                      {pending ? (
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </li>
              )
            )}
          </ul>
        )}
      </div>

      <form onSubmit={handleAdd} className={`${panelClass} order-1 h-fit min-w-0 space-y-4 p-6 lg:order-2`}>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600">
            <Quote className="h-4 w-4" />
          </div>
          <h2 className="font-display text-base text-ink">Add Testimonial</h2>
        </div>
        <ImageUploader value={imageUrl} onChange={setImageUrl} folder="tajtailor/testimonials" />
        <input placeholder="Customer Name" value={form.customer_name} onChange={update("customer_name")} className={inputClass} required />
        <input placeholder="Location (e.g. Delhi)" value={form.location} onChange={update("location")} className={inputClass} />
        <textarea placeholder="Review text" value={form.review_text} onChange={update("review_text")} rows={4} className={inputClass} required />
        <div>
          <label className="mb-1.5 block text-sm font-semibold uppercase tracking-wide text-ink/45">Rating</label>
          <RatingPicker value={form.rating} onChange={(r) => setForm((f) => ({ ...f, rating: r }))} />
        </div>
        <button type="submit" disabled={pending} className="btn-gold w-full disabled:opacity-60">
          Add Testimonial
        </button>
      </form>
    </div>
  );
}
