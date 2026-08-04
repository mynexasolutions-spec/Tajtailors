"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, AlertCircle, ArrowRight } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import { updateSiteSetting } from "@/actions/settings";

const inputClass =
  "w-full rounded-xl border border-ink/10 bg-ivory-deep px-4 py-2.5 text-sm text-ink placeholder:text-ink/35 transition-colors duration-300 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/30";
const labelClass = "mb-1.5 block text-sm font-semibold uppercase tracking-wide text-ink/45";
const panelClass =
  "rounded-[2rem] border border-gold-400/15 bg-white p-6 shadow-soft md:p-8";

const SECTIONS = [
  {
    id: "marquee",
    title: "Marquee Strip",
    enabledKey: "home_marquee_enabled",
    fields: [
      {
        key: "home_marquee_items",
        label: "Items",
        hint: "One item per line. Start a line with * to highlight it in gold.",
        rows: 8,
      },
    ],
  },
  {
    id: "threeways",
    title: "3 Easy Ways",
    enabledKey: "home_threeways_enabled",
    fields: [
      { key: "home_threeways_heading", label: "Heading" },
      { key: "home_threeways_1_title", label: "Card 1 — Title" },
      { key: "home_threeways_1_desc", label: "Card 1 — Description" },
      { key: "home_threeways_1_button", label: "Card 1 — Button Text" },
      { key: "home_threeways_2_title", label: "Card 2 — Title" },
      { key: "home_threeways_2_desc", label: "Card 2 — Description" },
      { key: "home_threeways_2_button", label: "Card 2 — Button Text" },
      { key: "home_threeways_3_title", label: "Card 3 — Title" },
      { key: "home_threeways_3_desc", label: "Card 3 — Description" },
      { key: "home_threeways_3_button", label: "Card 3 — Button Text" },
    ],
  },
  {
    id: "howitworks",
    title: "How It Works",
    enabledKey: "home_howitworks_enabled",
    fields: [
      { key: "home_howitworks_heading", label: "Heading (last word is highlighted in gold)" },
      { key: "home_howitworks_1_title", label: "Step 1 — Title" },
      { key: "home_howitworks_1_desc", label: "Step 1 — Description" },
      { key: "home_howitworks_2_title", label: "Step 2 — Title" },
      { key: "home_howitworks_2_desc", label: "Step 2 — Description" },
      { key: "home_howitworks_3_title", label: "Step 3 — Title" },
      { key: "home_howitworks_3_desc", label: "Step 3 — Description" },
      { key: "home_howitworks_4_title", label: "Step 4 — Title" },
      { key: "home_howitworks_4_desc", label: "Step 4 — Description" },
      { key: "home_howitworks_5_title", label: "Step 5 — Title" },
      { key: "home_howitworks_5_desc", label: "Step 5 — Description" },
    ],
  },
  {
    id: "fabrics",
    title: "Premium Fabrics",
    enabledKey: "home_fabrics_enabled",
    fields: [
      { key: "home_fabrics_eyebrow", label: "Small Label" },
      { key: "home_fabrics_heading", label: "Heading" },
    ],
    note: "Manage the actual fabric products on the Products page.",
    noteHref: "/admin/products",
  },
  {
    id: "kurtas",
    title: "Kurta Collection",
    enabledKey: "home_kurtas_enabled",
    fields: [
      { key: "home_kurtas_eyebrow", label: "Small Label" },
      { key: "home_kurtas_heading", label: "Heading" },
    ],
    note: "Manage the actual kurta products on the Products page.",
    noteHref: "/admin/products",
  },
  {
    id: "spotlight",
    title: "Featured Spotlight",
    enabledKey: "home_spotlight_enabled",
    fields: [
      { key: "home_spotlight_eyebrow", label: "Small Label (e.g. 'Our Specialty', 'Customer Favorite')" },
    ],
    note: "Shows your most recently added Featured product (e.g. Kaali Haath Turpai Kurta) — mark it 'Featured' on the Products page to spotlight it here.",
    noteHref: "/admin/products",
  },
  {
    id: "testimonials",
    title: "Testimonials",
    enabledKey: "home_testimonials_enabled",
    fields: [
      { key: "home_testimonials_eyebrow", label: "Small Label" },
      { key: "home_testimonials_heading", label: "Heading" },
    ],
    note: "Manage the actual testimonials shown here (and on the About page) on the Testimonials page.",
    noteHref: "/admin/testimonials",
  },
  {
    id: "trustbar",
    title: "Trust Bar",
    enabledKey: "home_trustbar_enabled",
    fields: [
      { key: "home_trustbar_1_title", label: "Item 1 — Title" },
      { key: "home_trustbar_1_desc", label: "Item 1 — Description" },
      { key: "home_trustbar_2_title", label: "Item 2 — Title" },
      { key: "home_trustbar_2_desc", label: "Item 2 — Description" },
      { key: "home_trustbar_3_title", label: "Item 3 — Title" },
      { key: "home_trustbar_3_desc", label: "Item 3 — Description" },
      { key: "home_trustbar_4_title", label: "Item 4 — Title" },
      { key: "home_trustbar_4_desc", label: "Item 4 — Description" },
      { key: "home_trustbar_5_title", label: "Item 5 — Title" },
      { key: "home_trustbar_5_desc", label: "Item 5 — Description" },
    ],
  },
];

export default function HomeSectionsManager({ settings, only }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [savingId, setSavingId] = useState(null);
  const [saved, setSaved] = useState(null);

  const sections = only ? SECTIONS.filter((s) => only.includes(s.id)) : SECTIONS;

  const initialValues = {};
  sections.forEach((section) => {
    section.fields.forEach((f) => {
      initialValues[f.key] = settings[f.key]?.value ?? "";
    });
    if (section.imageKey) initialValues[section.imageKey] = settings[section.imageKey]?.value ?? "";
    if (section.enabledKey) initialValues[section.enabledKey] = settings[section.enabledKey]?.value ?? "true";
  });

  const [values, setValues] = useState(initialValues);

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (section) => {
    const keys = [
      ...section.fields.map((f) => f.key),
      ...(section.imageKey ? [section.imageKey] : []),
      ...(section.enabledKey ? [section.enabledKey] : []),
    ];

    setSaved(null);
    setSavingId(section.id);
    startTransition(async () => {
      const results = await Promise.all(keys.map((key) => updateSiteSetting(key, values[key])));
      const failed = results.find((r) => !r.success);
      setSavingId(null);
      if (failed) {
        setSaved({ id: section.id, success: false, error: failed.error });
      } else {
        setSaved({ id: section.id, success: true });
        router.refresh();
        setTimeout(() => setSaved(null), 2000);
      }
    });
  };

  return (
    <div className="space-y-6">
      {sections.map((section) => {
        const isSaving = pending && savingId === section.id;
        const sectionEnabled = section.enabledKey ? values[section.enabledKey] !== "false" : true;

        return (
          <div key={section.id} className={panelClass}>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-display text-lg text-ink">{section.title}</h3>
                {section.enabledKey && (
                  <label className="flex items-center gap-1.5 rounded-full border border-gold-400/15 bg-ivory-deep px-3 py-1 text-xs font-medium text-ink/60">
                    <input
                      type="checkbox"
                      checked={sectionEnabled}
                      onChange={(e) => handleChange(section.enabledKey, e.target.checked ? "true" : "false")}
                    />
                    Show on Homepage
                  </label>
                )}
              </div>
              <button
                onClick={() => handleSave(section)}
                disabled={isSaving}
                className="btn-gold w-full px-6 py-2.5 text-xs font-semibold disabled:opacity-60 sm:w-auto"
              >
                {isSaving ? "Saving…" : "Save"}
              </button>
            </div>

            <div className="space-y-5">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <label className={labelClass}>{field.label}</label>
                  {field.hint && <p className="mb-1.5 -mt-1 text-sm text-ink/35">{field.hint}</p>}
                  <textarea
                    value={values[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    rows={field.rows ?? (values[field.key]?.length > 80 ? 3 : 1)}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              ))}

              {section.imageKey && (
                <div>
                  <label className={labelClass}>Image</label>
                  <ImageUploader
                    value={values[section.imageKey]}
                    onChange={(url) => handleChange(section.imageKey, url)}
                    folder="tajtailor/home-sections"
                  />
                </div>
              )}

              {section.note && (
                <Link
                  href={section.noteHref}
                  className="flex items-center gap-1.5 text-sm text-gold-600/90 transition-colors hover:text-gold-700"
                >
                  {section.note} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>

            {saved?.id === section.id && (
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
      })}
    </div>
  );
}
