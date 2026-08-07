"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Save } from "lucide-react";
import { createGarmentType, updateGarmentType } from "@/actions/admin/garmentTypes";
import ImageUploader from "@/components/admin/ImageUploader";
import FieldsEditor from "./FieldsEditor";
import { MEASUREMENT_KIND_OPTIONS, normalizeMeasurementKind } from "./measurementKinds";

const inputClass =
  "w-full rounded-2xl border border-ink/10 bg-ivory-deep px-5 py-3.5 text-sm text-ink placeholder:text-ink/30 transition-all duration-500 focus:border-gold-400/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/30";
const labelClass = "mb-2 block text-xs font-semibold uppercase tracking-widest text-gold-600/90";
const panelClass =
  "relative rounded-[2.5rem] border border-gold-400/20 bg-white p-6 sm:p-8 space-y-5 shadow-xl";

function keyPreview(text) {
  return (text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/(^_|_$)/g, "");
}

export default function GarmentTypeForm({ garmentType }) {
  const isEditing = !!garmentType;
  const action = isEditing ? updateGarmentType : createGarmentType;
  const [state, formAction, pending] = useActionState(action, {});
  const [label, setLabel] = useState(garmentType?.label || "");
  const [isActive, setIsActive] = useState(garmentType?.is_active ?? true);
  const [isFeatured, setIsFeatured] = useState(garmentType?.is_featured ?? false);
  const [imageUrl, setImageUrl] = useState(garmentType?.image_url || null);
  const [measurementKind, setMeasurementKind] = useState(normalizeMeasurementKind(garmentType?.measurement_kind));
  const [fields, setFields] = useState(garmentType?.fields || []);
  const isSet = measurementKind === "kurta_pajama_set" || measurementKind === "kurta_pant_set";

  // The "age" field is a special, admin-toggled add-on, not a manually
  // configured one — it never replaces the regular fields. On the storefront
  // it shows as an "Is this for a child?" checkbox that lets the customer
  // pick between the regular fields below and a simple age picker, so the
  // same garment type serves both adults and children.
  const regularFields = fields.filter((f) => f.type !== "age");
  const allowChildAge = fields.some((f) => f.type === "age");
  const toggleChildAge = () => {
    setFields(allowChildAge ? regularFields : [...regularFields, { key: "age", label: "Age", type: "age" }]);
  };

  return (
    <form action={formAction} className="space-y-6">
      {isEditing && <input type="hidden" name="id" value={garmentType.id} />}
      <input type="hidden" name="is_active" value={isActive ? "on" : "off"} />
      <input type="hidden" name="is_featured" value={isFeatured ? "on" : "off"} />
      <input type="hidden" name="image_url" value={imageUrl || ""} />
      <input type="hidden" name="fields" value={JSON.stringify(fields)} />

      {state.error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300 animate-fadeUp">
          <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse shrink-0" />
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className={panelClass}>
            <h2 className="font-display text-base text-ink">Basic Information</h2>
            <div>
              <label className={labelClass}>Label</label>
              <input
                required
                name="label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Sherwani"
                className={inputClass}
              />
              {!isEditing && label && (
                <p className="mt-2 text-sm text-ink/35">
                  Stored key: <span className="font-mono text-gold-600/70">{keyPreview(label)}</span>
                </p>
              )}
              {isEditing && (
                <p className="mt-2 text-sm text-ink/35">
                  Key: <span className="font-mono text-gold-600/70">{garmentType.key}</span> (fixed — existing products reference it)
                </p>
              )}
            </div>

            <input type="hidden" name="measurement_kind" value={measurementKind} />

            {!isSet && (
              <div>
                <label className={labelClass}>Children's Age Option</label>
                <button
                  type="button"
                  onClick={toggleChildAge}
                  className={`flex w-full items-center justify-between rounded-2xl border px-5 py-3.5 text-sm transition-all duration-500 ${
                    allowChildAge
                      ? "border-green-500/30 bg-green-500/10 text-green-700"
                      : "border-ink/10 bg-ivory-deep text-ink/45"
                  }`}
                >
                  {allowChildAge ? "Yes — customers can also order for a child" : "No — adults only"}
                  <span
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-500 ${
                      allowChildAge ? "bg-green-500" : "bg-ink/15"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-500 ${
                        allowChildAge ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </span>
                </button>
                <p className="mt-2 text-sm text-ink/35">
                  Adds an "Is this for a child?" checkbox on the product page — when ticked, the customer picks the child's age (1–10 yrs) instead of the regular measurements below. Your style options and measurement fields stay as configured either way.
                </p>
              </div>
            )}
          </div>

          {!isSet && (
            <div className={panelClass}>
              <h2 className="font-display text-base text-ink">Measurement Fields</h2>
              <p className="-mt-3 text-sm text-ink/35">
                The actual inputs a customer fills in — number measurements, yes/no, or a custom choice.
              </p>
              <FieldsEditor
                fields={regularFields}
                onChange={(next) => setFields(allowChildAge ? [...next, { key: "age", label: "Age", type: "age" }] : next)}
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className={panelClass}>
            <h2 className="font-display text-base text-ink">Cover Image</h2>
            <ImageUploader value={imageUrl} onChange={setImageUrl} folder="tajtailor/garment-types" />
            <p className="text-sm text-ink/35">Shown instead of the default icon wherever this type appears on the storefront.</p>
          </div>

          <div className={panelClass}>
            <h2 className="font-display text-base text-ink">Settings</h2>
            <div>
              <label className={labelClass}>Sort Order</label>
              <input type="number" name="sort_order" defaultValue={garmentType?.sort_order || 0} className={inputClass} />
              <p className="mt-2 text-sm text-ink/35">Lower numbers appear first.</p>
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
                {isActive ? "Available to pick" : "Hidden"}
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

            <div>
              <label className={labelClass}>Featured on Homepage</label>
              <button
                type="button"
                onClick={() => setIsFeatured((f) => !f)}
                className={`flex w-full items-center justify-between rounded-2xl border px-5 py-3.5 text-sm transition-all duration-500 ${
                  isFeatured
                    ? "border-gold-500/30 bg-gold-400/10 text-gold-700"
                    : "border-ink/10 bg-ivory-deep text-ink/45"
                }`}
              >
                {isFeatured ? "Featured" : "Regular"}
                <span
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-500 ${
                    isFeatured ? "bg-gold-500" : "bg-ink/15"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-500 ${
                      isFeatured ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 border-t border-gold-400/10 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="btn-gold flex items-center gap-1.5 disabled:opacity-60 px-8 py-3.5 text-xs font-semibold tracking-widest uppercase shadow-[0_4px_15px_rgba(212,163,89,0.12)] hover:shadow-[0_4px_20px_rgba(212,163,89,0.25)] hover:-translate-y-0.5 transition-all duration-300"
        >
          <Save className="h-4 w-4" /> {pending ? "Saving…" : isEditing ? "Update Garment Type" : "Create Garment Type"}
        </button>
        <Link
          href="/admin/garment-types"
          className="text-xs uppercase tracking-widest font-semibold text-ink/45 hover:text-gold-600 transition-colors duration-300"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
