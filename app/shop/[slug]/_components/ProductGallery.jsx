"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ZoomIn, X } from "lucide-react";
import SherwaniGlyph from "@/components/SherwaniGlyph";
import { useProductVariant } from "./ProductVariantContext";

export default function ProductGallery({ images, name }) {
  const ctx = useProductVariant();
  const selected = ctx?.selected || null;
  const selectedSizeName = selected?.variant_name || null;
  const selectedColorName = selected?.color_name || null;

  // "General" images (no variant_name and no color_name) show for every
  // variant. "Both" mode products match by color_name — one photo covers
  // every size of that color. Everything else (plain "Size"/"Color" mode
  // products) matches by the exact variant_name, same as before. Falls back
  // to the full set if nothing matches so the gallery is never empty.
  const sizeFiltered = (images || []).filter((img) => {
    if (!img.variant_name && !img.color_name) return true;
    if (selectedColorName && img.color_name) return img.color_name === selectedColorName;
    return img.variant_name === selectedSizeName;
  });
  const list = sizeFiltered.length > 0 ? sizeFiltered : images && images.length > 0 ? images : [{ id: "placeholder", image_url: null }];

  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setActive(0);
  }, [selectedSizeName, selectedColorName]);

  const activeImage = list[active]?.image_url;

  return (
    <div className="w-full relative">

      {/* Ambient glow behind the frame */}
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[3rem] bg-gold-400/5 blur-3xl" />

      {/* Main Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-[2.5rem] border border-gold-400/25 bg-gradient-to-b from-ivory to-ivory-deep shadow-soft group transition-all duration-500 hover:border-gold-400/40 hover:shadow-[0_0_50px_rgba(212,163,89,0.12)]">

        {/* Shimmering top sheen */}
        <div className="absolute inset-x-0 top-0 h-px bg-gold-gradient bg-[length:200%_200%] animate-shimmer z-20" />

        {/* Soft background light */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(202,161,75,0.05),transparent_70%)] pointer-events-none" />

        {activeImage ? (
          <Image
            src={activeImage}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="rounded-[2rem] object-cover scale-100 group-hover:scale-103 transition-transform duration-700 ease-out p-3 sm:p-5"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <SherwaniGlyph className="h-2/3 w-auto text-gold-500/50 animate-floatSlow" />
          </div>
        )}

        {activeImage && (
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label="View full image"
            className="absolute bottom-5 right-5 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-gold-gradient text-ink opacity-100 shadow-gold transition-all duration-300 hover:scale-105 md:opacity-0 md:group-hover:opacity-100"
          >
            <ZoomIn className="h-4.5 w-4.5" />
          </button>
        )}

        {/* Double Luxury Borders */}
        <div className="absolute inset-4 rounded-[2rem] border border-gold-400/10 pointer-events-none z-20" />
      </div>

      {/* Thumbnail Selection */}
      {list.length > 1 && (
        <div className="mt-5 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {list.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border transition-all duration-300 ${
                active === i
                  ? "border-gold-400 ring-2 ring-gold-400/25 scale-95 shadow-[0_0_20px_rgba(212,163,89,0.2)] bg-gold-400/5"
                  : "border-ink/10 bg-white opacity-70 hover:opacity-100 hover:border-gold-400/30 hover:-translate-y-0.5"
              }`}
            >
              {img.image_url && (
                <Image src={img.image_url} alt="" fill sizes="64px" className="rounded-xl object-cover p-1.5" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox — portaled to <body> so it always renders above the sticky header */}
      {lightboxOpen &&
        activeImage &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-md p-6 sm:p-10"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close"
              className="group absolute right-5 top-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/30 bg-white/15 text-white backdrop-blur-sm transition-all hover:border-gold-400/50 hover:text-gold-300"
            >
              <X className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
            </button>
            <div className="relative h-full w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
              <Image src={activeImage} alt={name} fill sizes="90vw" className="object-contain" />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
