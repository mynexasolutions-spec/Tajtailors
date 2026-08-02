"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";

/**
 * `value` is either a single URL string (multiple=false) or an array of URL
 * strings (multiple=true). `onChange` receives the same shape back.
 */
export default function ImageUploader({ value, onChange, multiple = false, folder = "tajtailor" }) {
  const urls = multiple ? value || [] : value ? [value] : [];

  const restoreBodyScroll = () => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "";
      // Also ensure any lingering modal wrappers are unlocked
      const htmlEl = document.documentElement;
      if (htmlEl) {
        htmlEl.style.overflow = "";
      }
    }
  };

  const handleSuccess = (result) => {
    restoreBodyScroll();
    const url = result?.info?.secure_url;
    if (!url) return;
    if (multiple) onChange([...(value || []), url]);
    else onChange(url);
  };

  const removeAt = (idx) => {
    if (multiple) onChange((value || []).filter((_, i) => i !== idx));
    else onChange(null);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {urls.map((url, idx) => (
          <div key={url} className="relative h-24 w-24 overflow-hidden rounded-xl border border-ink/10">
            <Image src={url} alt="" fill sizes="96px" className="object-cover" />
            <button
              type="button"
              onClick={() => removeAt(idx)}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {(multiple || urls.length === 0) && (
          <CldUploadWidget
            signatureEndpoint="/api/cloudinary/sign"
            options={{ folder, multiple: false, sources: ["local", "url", "camera"] }}
            onSuccess={handleSuccess}
            onClose={restoreBodyScroll}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="flex h-24 w-24 flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-ink/15 text-ink/40 transition-colors hover:border-gold-400/50 hover:text-gold-600"
              >
                <ImagePlus className="h-5 w-5" />
                <span className="text-[10px]">Upload</span>
              </button>
            )}
          </CldUploadWidget>
        )}
      </div>
    </div>
  );
}
