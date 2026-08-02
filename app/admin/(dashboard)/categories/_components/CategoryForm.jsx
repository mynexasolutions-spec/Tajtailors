"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createCategory, updateCategory } from "@/actions/admin/categories";
import ImageUploader from "@/components/admin/ImageUploader";

const inputClass =
  "w-full rounded-2xl border border-ink/10 bg-ivory-deep px-5 py-3.5 text-sm text-ink placeholder:text-ink/30 transition-all duration-500 focus:border-gold-400/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/30";
const labelClass = "mb-2 block text-xs font-semibold uppercase tracking-widest text-gold-600/90";

function slugPreview(text) {
  return (text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CategoryForm({ category }) {
  const isEditing = !!category;
  const action = isEditing ? updateCategory : createCategory;
  const [state, formAction, pending] = useActionState(action, {});
  const [imageUrl, setImageUrl] = useState(category?.image_url || null);
  const [name, setName] = useState(category?.name || "");
  const [isActive, setIsActive] = useState(category?.is_active ?? true);

  return (
    <form
      action={formAction}
      className="max-w-3xl space-y-6 rounded-[2.5rem] border border-gold-400/20 bg-white p-6 md:p-8 shadow-2xl"
    >
      {isEditing && <input type="hidden" name="id" value={category.id} />}
      <input type="hidden" name="image_url" value={imageUrl || ""} />
      <input type="hidden" name="is_active" value={isActive ? "on" : "off"} />

      {state.error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300 animate-fadeUp">
          <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[200px_1fr]">
        <div>
          <label className={labelClass}>Image</label>
          <ImageUploader value={imageUrl} onChange={setImageUrl} folder="tajtailor/categories" />
        </div>

        <div className="space-y-5">
          <div>
            <label className={labelClass}>Name</label>
            <input
              required
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fabrics"
              className={inputClass}
            />
            {name && (
              <p className="mt-2 text-sm text-ink/35">
                URL Preview: <span className="font-mono text-gold-600/70">/shop?category={slugPreview(name)}</span>
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={category?.description}
              placeholder="A short line about this collection…"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Sort Order</label>
              <input type="number" name="sort_order" defaultValue={category?.sort_order || 0} className={inputClass} />
              <p className="mt-2 text-sm text-ink/35">Lower numbers appear first on the store.</p>
            </div>

            <div>
              <label className={labelClass}>Visibility</label>
              <button
                type="button"
                onClick={() => setIsActive((v) => !v)}
                className={`flex w-full items-center justify-between rounded-2xl border px-5 py-3.5 text-sm transition-all duration-500 ${
                  isActive
                    ? "border-green-500/30 bg-green-500/10 text-green-700"
                    : "border-ink/10 bg-ivory-deep text-ink/45"
                }`}
              >
                {isActive ? "Visible" : "Hidden"}
                <span
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-500 ${
                    isActive ? "bg-green-500" : "bg-ink/15"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-500 ${
                      isActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 border-t border-ink/10 pt-6">
        <button 
          type="submit" 
          disabled={pending} 
          className="btn-gold disabled:opacity-60 px-8 py-3.5 text-xs font-semibold tracking-widest uppercase shadow-[0_4px_15px_rgba(212,163,89,0.12)] hover:shadow-[0_4px_20px_rgba(212,163,89,0.25)] hover:-translate-y-0.5 transition-all duration-300"
        >
          {pending ? "Saving…" : isEditing ? "Update Category" : "Create Category"}
        </button>
        <Link 
          href="/admin/categories" 
          className="text-xs uppercase tracking-widest font-semibold text-ink/45 hover:text-gold-600 transition-colors duration-300"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
