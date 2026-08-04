"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Shirt, Star, ShoppingBag } from "lucide-react";

export default function OutfitPicker({ options, fabricId, variantId }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(null);
  const selected = options.find((o) => o.id === selectedId) || null;

  const goToSelected = () => {
    if (!selected) return;
    router.push(`/shop/${selected.slug}?fabric=${fabricId}&variant=${variantId}`);
  };

  return (
    <div className="space-y-6">
      {/* Options grid — tap a card to select it (tick appears), then confirm
          with Continue below. Two explicit steps instead of an instant jump
          on click, so a stray tap doesn't yank the customer to another page. */}
      <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {options.map((o, i) => {
          const isSelected = selectedId === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => setSelectedId(o.id)}
              className={`group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border bg-white text-left shadow-soft transition-all duration-500 animate-fadeUp opacity-0 ${
                isSelected
                  ? "border-gold-400 shadow-gold ring-2 ring-gold-400/30"
                  : "border-ink/10 hover:-translate-y-1.5 hover:border-gold-400/50 hover:shadow-gold"
              }`}
              style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(202,161,75,0.04),transparent_70%)] pointer-events-none" />
                {o.image ? (
                  <Image
                    src={o.image}
                    alt={o.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-ink/15">
                    <Shirt className="h-12 w-12" strokeWidth={1.1} />
                  </div>
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                {o.badge && (
                  <span className="absolute left-3 top-3 rounded-full bg-gold-gradient px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-ink shadow-gold">
                    {o.badge}
                  </span>
                )}
                {isSelected ? (
                  <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-gold-gradient text-ink shadow-gold">
                    <Check className="h-4 w-4" strokeWidth={2.75} />
                  </span>
                ) : (
                  <span className="pointer-events-none absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 bg-white/85 backdrop-blur-md text-ink/50 shadow-sm opacity-0 transition-all duration-300 group-hover:border-gold-400/40 group-hover:text-gold-600 group-hover:opacity-100">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                <h3 className="font-display text-sm sm:text-base text-ink font-semibold transition-colors group-hover:text-gold-700 line-clamp-2">
                  {o.name}
                </h3>
                <div className="mt-auto flex items-center justify-between gap-2 pt-2.5">
                  <span className="text-sm sm:text-base font-bold text-ink">
                    {o.price != null ? `₹${o.price.toLocaleString("en-IN")}` : "—"}
                    <span className="ml-1 text-xs font-semibold text-ink/50">stitching</span>
                  </span>
                  {o.rating > 0 && (
                    <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-ink">
                      <Star className="h-3 w-3 fill-gold-500 text-gold-500" /> {o.rating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Spacer so the fixed confirm bar below never covers the last row of cards */}
      <div className="h-20 sm:h-24" />

      {/* Confirm bar — pinned to the bottom of the screen so it's always in
          view while browsing, instead of only appearing once you scroll past
          the grid. */}
      <div className="fixed inset-x-0 bottom-0 z-30 px-4 pb-4 sm:pb-6 pointer-events-none">
        <div
          className={`pointer-events-auto mx-auto flex max-w-xl items-center justify-between gap-4 rounded-2xl border bg-white/95 p-3 pl-5 shadow-2xl backdrop-blur-md transition-all duration-500 sm:p-4 sm:pl-6 ${
            selected ? "border-gold-400/40 translate-y-0 opacity-100" : "border-ink/10 translate-y-1 opacity-90"
          }`}
        >
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gold-600">
              {selected ? "Selected" : "Nothing selected yet"}
            </p>
            <p className="truncate text-sm sm:text-base font-bold text-ink">
              {selected ? selected.name : "Tap a style above to select it"}
            </p>
          </div>
          <button
            type="button"
            onClick={goToSelected}
            disabled={!selected}
            className="btn-gold flex shrink-0 items-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-widest disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ShoppingBag className="h-4 w-4 text-ink" /> Continue
          </button>
        </div>
      </div>
    </div>
  );
}
