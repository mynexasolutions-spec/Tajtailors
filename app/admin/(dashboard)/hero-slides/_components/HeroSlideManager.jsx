"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, ImagePlus, Check, AlertCircle, Sparkles, Pencil } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import { createHeroSlide, updateHeroSlide, toggleHeroSlide, deleteHeroSlide } from "@/actions/admin/hero";
import { updateSiteSetting } from "@/actions/settings";

const inputClass =
  "w-full rounded-xl border border-ink/10 bg-ivory-deep px-4 py-2.5 text-sm text-ink placeholder:text-ink/35 transition-colors duration-300 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/30";
const labelClass = "mb-1.5 block text-sm font-semibold uppercase tracking-wide text-ink/45";
const panelClass =
  "rounded-[2rem] border border-gold-400/15 bg-white shadow-soft";

const HERO_ENABLED_KEY = "home_hero_enabled";

const HERO_SETTINGS_FIELDS = [
  { key: "home_hero_badge_text", label: "Badge Text", hint: "The small pill shown above the title (e.g. \"Taj Tailor\")." },
  { key: "home_hero_rating_value", label: "Star Rating", hint: "A number from 0–5, e.g. 4.9." },
  { key: "home_hero_reviews_text", label: "Reviews Text", hint: "Shown next to the star rating, e.g. \"500+ Reviews\"." },
  { key: "home_hero_shipped_text", label: "Shipped Stat", hint: "e.g. \"10k+ Bottles Shipped Pan-India\"." },
];

function HeroSettingsPanel({ settings }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(null);
  const [values, setValues] = useState(() => {
    const initial = { [HERO_ENABLED_KEY]: settings[HERO_ENABLED_KEY]?.value ?? "true" };
    HERO_SETTINGS_FIELDS.forEach((f) => {
      initial[f.key] = settings[f.key]?.value ?? "";
    });
    return initial;
  });
  const heroEnabled = values[HERO_ENABLED_KEY] !== "false";

  const handleChange = (key, value) => setValues((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    setSaved(null);
    startTransition(async () => {
      const keys = [HERO_ENABLED_KEY, ...HERO_SETTINGS_FIELDS.map((f) => f.key)];
      const results = await Promise.all(keys.map((key) => updateSiteSetting(key, values[key])));
      const failed = results.find((r) => !r.success);
      if (failed) {
        setSaved({ success: false, error: failed.error });
      } else {
        setSaved({ success: true });
        router.refresh();
        setTimeout(() => setSaved(null), 2000);
      }
    });
  };

  return (
    <div className={`${panelClass} p-6 md:p-8`}>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-display text-lg text-ink">Hero Section Settings</h2>
            <p className="text-sm text-ink/45">Applies across every slide — badge, rating and stats shown over the banner.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-1.5 rounded-full border border-gold-400/10 bg-ivory-deep px-3 py-1 text-xs font-medium text-ink/60">
            <input
              type="checkbox"
              checked={heroEnabled}
              onChange={(e) => handleChange(HERO_ENABLED_KEY, e.target.checked ? "true" : "false")}
            />
            Show on Homepage
          </label>
          <button onClick={handleSave} disabled={pending} className="btn-gold px-6 py-2.5 text-xs font-semibold disabled:opacity-60">
            {pending ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {HERO_SETTINGS_FIELDS.map((field) => (
          <div key={field.key}>
            <label className={labelClass}>{field.label}</label>
            <input
              value={values[field.key]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className={inputClass}
            />
            {field.hint && <p className="mt-1.5 text-sm text-ink/35">{field.hint}</p>}
          </div>
        ))}
      </div>

      {saved && (
        <div className={`mt-4 flex items-center gap-2 text-sm ${saved.success ? "text-emerald-600" : "text-red-600"}`}>
          {saved.success ? (
            <>
              <Check className="h-3.5 w-3.5" /> Saved successfully
            </>
          ) : (
            <>
              <AlertCircle className="h-3.5 w-3.5" /> {saved.error}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function SlideEditForm({ slide, onCancel, onSaved }) {
  const [pending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState(slide.image_url);
  const [form, setForm] = useState({
    title: slide.title || "",
    subtitle: slide.subtitle || "",
    button_text: slide.button_text || "",
    button_link: slide.button_link || "",
  });

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateHeroSlide(slide.id, { ...form, image_url: imageUrl });
      if (result.success) onSaved();
    });
  };

  return (
    <form onSubmit={handleSave} className="w-full space-y-3 rounded-2xl border border-gold-400/20 bg-ivory-deep p-4">
      <ImageUploader value={imageUrl} onChange={setImageUrl} folder="tajtailor/hero" />
      <div>
        <textarea
          placeholder={"Title\ne.g. Doorstep Tailoring,\nPerfect Fitting"}
          value={form.title}
          onChange={update("title")}
          rows={3}
          className={`${inputClass} resize-none`}
        />
        <p className="mt-1.5 text-sm text-ink/35">Use Enter for line breaks. The last line is highlighted in gold.</p>
      </div>
      <input placeholder="Subtitle" value={form.subtitle} onChange={update("subtitle")} className={inputClass} />
      <input placeholder="Button Text" value={form.button_text} onChange={update("button_text")} className={inputClass} />
      <input placeholder="Button Link (e.g. /shop)" value={form.button_link} onChange={update("button_link")} className={inputClass} />
      <div className="flex items-center gap-2 pt-1">
        <button type="submit" disabled={pending || !imageUrl} className="btn-gold flex-1 py-2.5 text-sm disabled:opacity-60">
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

export default function HeroSlideManager({ slides, settings }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState(null);
  const [form, setForm] = useState({ title: "", subtitle: "", button_text: "", button_link: "" });
  const [editingId, setEditingId] = useState(null);
  const [addError, setAddError] = useState(null);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleAdd = (e) => {
    e.preventDefault();
    setAddError(null);
    startTransition(async () => {
      const result = await createHeroSlide({ ...form, image_url: imageUrl });
      if (result.success) {
        setImageUrl(null);
        setForm({ title: "", subtitle: "", button_text: "", button_link: "" });
        router.refresh();
      } else {
        setAddError(result.error || "Something went wrong. Please try again.");
      }
    });
  };

  const handleToggle = (id, active) => {
    startTransition(async () => {
      await toggleHeroSlide(id, active);
      router.refresh();
    });
  };

  const handleDelete = (id) => {
    startTransition(async () => {
      await deleteHeroSlide(id);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <HeroSettingsPanel settings={settings} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <div className={`${panelClass} min-w-0 p-6 md:p-8`}>
        <h2 className="mb-4 font-display text-lg text-ink">Existing Slides</h2>
        {slides.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink/45">No slides yet — the homepage will use a default hero.</p>
        ) : (
          <ul className="space-y-3">
            {slides.map((s) =>
              editingId === s.id ? (
                <li key={s.id} className="rounded-2xl border border-gold-400/10 bg-ivory-deep p-4">
                  <SlideEditForm slide={s} onCancel={() => setEditingId(null)} onSaved={() => { setEditingId(null); router.refresh(); }} />
                </li>
              ) : (
                <li
                  key={s.id}
                  className="flex flex-col gap-3 rounded-2xl border border-gold-400/10 bg-ivory-deep p-4 sm:flex-row sm:items-center"
                >
                  <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl bg-ivory-deep sm:h-16 sm:w-24">
                    <Image src={s.image_url} alt="" fill sizes="96px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-ink">
                      {s.title ? s.title.split("\n")[0] : <em className="text-ink/35">No title</em>}
                    </p>
                    <p className="truncate text-sm text-ink/45">{s.subtitle}</p>
                  </div>
                  <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-start">
                    <label className="flex items-center gap-2 text-sm text-ink/60">
                      <input type="checkbox" checked={s.is_active} disabled={pending} onChange={(e) => handleToggle(s.id, e.target.checked)} />
                      Active
                    </label>
                    <button
                      onClick={() => setEditingId(s.id)}
                      disabled={pending}
                      className="rounded-xl p-2 text-ink/45 transition-colors hover:bg-gold-400/10 hover:text-gold-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      disabled={pending}
                      className="rounded-xl p-2 text-ink/45 transition-colors hover:bg-red-500/10 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              )
            )}
          </ul>
        )}
      </div>

      <form onSubmit={handleAdd} className={`${panelClass} h-fit min-w-0 space-y-4 p-6`}>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600">
            <ImagePlus className="h-4 w-4" />
          </div>
          <h2 className="font-display text-base text-ink">Add Slide</h2>
        </div>
        <ImageUploader value={imageUrl} onChange={setImageUrl} folder="tajtailor/hero" />
        <div>
          <textarea
            placeholder={"Title\ne.g. Doorstep Tailoring,\nPerfect Fitting"}
            value={form.title}
            onChange={update("title")}
            rows={3}
            className={`${inputClass} resize-none`}
          />
          <p className="mt-1.5 text-sm text-ink/35">Use Enter for line breaks. The last line is highlighted in gold.</p>
        </div>
        <input placeholder="Subtitle" value={form.subtitle} onChange={update("subtitle")} className={inputClass} />
        <input placeholder="Button Text" value={form.button_text} onChange={update("button_text")} className={inputClass} />
        <input placeholder="Button Link (e.g. /shop)" value={form.button_link} onChange={update("button_link")} className={inputClass} />
        <button type="submit" disabled={pending || !imageUrl} className="btn-gold w-full disabled:opacity-60">
          {pending ? "Adding…" : "Add Slide"}
        </button>
        {!imageUrl && <p className="text-center text-sm text-ink/35">Upload an image to enable this button.</p>}
        {addError && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {addError}
          </div>
        )}
      </form>
      </div>
    </div>
  );
}
