"use client";

import { useState } from "react";
import ImageUploader from "@/components/admin/ImageUploader";

/**
 * `images` is an array of `{ url, size }`, where `size` is either null
 * (shows on every bottle size — "General") or a bottle size's exact
 * `variant_name` text (e.g. "30ml").
 */
export default function SizeImageMapper({ images, onChange, variants, folder = "tajtailor/products" }) {
  const sizeNames = Array.from(
    new Set((variants || []).map((v) => (v.variant_name || "").trim()).filter(Boolean))
  );
  const tabs = ["General", ...sizeNames];
  const [active, setActive] = useState("General");
  const activeTab = tabs.includes(active) ? active : "General";
  const activeKey = activeTab === "General" ? null : activeTab;

  const activeUrls = images.filter((img) => (img.size || null) === activeKey).map((img) => img.url);

  const setActiveUrls = (urls) => {
    const others = images.filter((img) => (img.size || null) !== activeKey);
    onChange([...others, ...urls.map((url) => ({ url, size: activeKey }))]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const key = t === "General" ? null : t;
          const count = images.filter((img) => (img.size || null) === key).length;
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
