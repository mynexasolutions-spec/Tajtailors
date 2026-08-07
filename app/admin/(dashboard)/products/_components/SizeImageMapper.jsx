"use client";

import { useState } from "react";
import ImageUploader from "@/components/admin/ImageUploader";

/**
 * `images` is an array of `{ url, size, color }`.
 * - `size` maps to product_images.variant_name — used in "Size"/"Color" mode
 *   (in "Color" mode the variant_name IS the color, so this still works).
 * - `color` maps to product_images.color_name — used only in "Both" mode, so
 *   one photo can cover every size of a color instead of needing one photo
 *   per exact size+color combination.
 * Either null means "General" — shows for every variant.
 */
export default function SizeImageMapper({ images, onChange, variants, mode = "size", folder = "tajtailor/products" }) {
  const isBoth = mode === "both";

  const tabNames = isBoth
    ? Array.from(new Set((variants || []).map((v) => (v.color_name || "").trim()).filter(Boolean)))
    : Array.from(new Set((variants || []).map((v) => (v.variant_name || "").trim()).filter(Boolean)));

  const tabs = ["General", ...tabNames];
  const [active, setActive] = useState("General");
  const activeTab = tabs.includes(active) ? active : "General";
  const activeKey = activeTab === "General" ? null : activeTab;
  const field = isBoth ? "color" : "size";

  const activeUrls = images.filter((img) => (img[field] || null) === activeKey).map((img) => img.url);

  const setActiveUrls = (urls) => {
    const others = images.filter((img) => (img[field] || null) !== activeKey);
    onChange([...others, ...urls.map((url) => ({ url, [field]: activeKey }))]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const key = t === "General" ? null : t;
          const count = images.filter((img) => (img[field] || null) === key).length;
          return (
            <button
              type="button"
              key={t}
              onClick={() => setActive(t)}
              className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-all duration-300 ${
                activeTab === t
                  ? "border-gold-400/60 bg-gold-400/15 text-gold-700"
                  : "border-ink/10 bg-ivory-deep text-ink/50 hover:border-gold-400/30 hover:text-ink"
              }`}
            >
              {t}
              {count > 0 && <span className="text-[10px] text-ink/45">({count})</span>}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-ink/45">
        {activeTab === "General"
          ? "These images show for every variant."
          : isBoth
          ? `These images show for every size of "${activeTab}".`
          : `These images show only when a shopper selects "${activeTab}".`}
      </p>

      {/*
        `key` forces a full remount when the tab changes. next-cloudinary's
        CldUploadWidget creates its underlying widget once and never updates
        its onSuccess callback on prop changes, so without this the widget
        keeps using whichever tab was active when it was first opened —
        every later upload (and every "removed" image, since it also
        replays a stale snapshot of the gallery) would land back on that
        original tab instead of the one currently selected.
      */}
      <ImageUploader key={activeTab} value={activeUrls} onChange={setActiveUrls} multiple folder={folder} />
    </div>
  );
}
