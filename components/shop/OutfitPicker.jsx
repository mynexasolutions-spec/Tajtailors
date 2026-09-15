"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Info, PackageCheck, Shirt, Star, ShoppingBag, X } from "lucide-react";

// fabricId/variantId are only passed by the fabric-first flow (fabric page's
// "choose" link) — from a fabric-agnostic entry point (e.g. the homepage
// garment-type cards) they're omitted and the outfit's own product page
// handles fabric selection instead. garmentAddOns (e.g. every Pajama style,
// for a Kurta — or every Kurta, browsing Pajama) lets the customer pick one
// right here, before even landing on the chosen outfit's own page — carried
// forward via ?addon=<id> so it arrives already selected there instead of
// asking again.
export default function OutfitPicker({ options, fabricId, variantId, garmentAddOns = [], addOnLabel }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(null);
  const [addOnId, setAddOnId] = useState(null);
  // On mobile the add-on list lives in a sheet instead of inline — inline it
  // either sits before the styles (delaying what the customer came here for)
  // or after them (buried below however many styles there are). A sheet
  // reachable from a floating chip is visible either way, at a fixed cost.
  const [addOnSheetOpen, setAddOnSheetOpen] = useState(false);
  const selected = options.find((o) => o.id === selectedId) || null;
  const selectedAddOn = garmentAddOns.find((a) => a.id === addOnId) || null;

  const goToSelected = () => {
    if (!selected) return;
    const params = new URLSearchParams();
    if (fabricId) {
      // Fabric was already chosen (fabric-first flow) — land on the Fabric
      // step so the customer can confirm color/meters-needed before moving
      // on, instead of skipping straight past that.
      params.set("fabric", fabricId);
      params.set("variant", variantId);
    } else {
      // No fabric picked yet — step=measure jumps straight to the
      // Measurements tab instead of landing on the gallery/description
      // first, since picking a style here already IS the "browsing" step.
      // A separate "Details" link on each card covers anyone who still
      // wants the full description/reviews.
      params.set("step", "measure");
    }
    if (addOnId) params.set("addon", addOnId);
    router.push(`/shop/${selected.slug}?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
    <div className="flex flex-col gap-6 lg:flex-row-reverse lg:items-start lg:gap-8">
      {/* Cross-sell — desktop-only inline sidebar, sticky so it stays in view
          no matter how long the style grid grows. On mobile there's no good
          inline spot (before the styles delays what the customer came for;
          after them gets buried once there are many), so it lives in a
          floating-chip + bottom-sheet instead — see below the grid. */}
      {garmentAddOns.length > 0 && (
        <div className="hidden lg:block lg:sticky lg:top-24 lg:w-80 lg:shrink-0 rounded-2xl border border-dashed border-gold-400/30 bg-gold-400/[0.04] p-4 space-y-3">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-600">
              <PackageCheck className="h-4 w-4" /> Add a Matching {addOnLabel || "Piece"} Too
            </p>
            <p className="mt-1 pl-6 text-xs font-semibold text-ink/50">Optional — bundled into the same order below.</p>
          </div>
          {/* Capped + scrollable so a long catalog of Pajama styles doesn't
              stretch this sidebar past the viewport — it scrolls within
              itself instead of pushing the sticky rail's height out. */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:max-h-[calc(100vh-14rem)] lg:overflow-y-auto lg:pr-1">
            {garmentAddOns.map((a) => {
              const isSelected = addOnId === a.id;
              return (
                <div
                  key={a.id}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-soft transition-all duration-300 ${
                    isSelected
                      ? "border-gold-400 shadow-gold ring-2 ring-gold-400/30"
                      : "border-ink/10 hover:-translate-y-1 hover:border-gold-400/40 hover:shadow-gold"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setAddOnId((prev) => (prev === a.id ? null : a.id))}
                    className="block w-full text-left"
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-white">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(202,161,75,0.04),transparent_70%)] pointer-events-none" />
                      {a.image ? (
                        <Image src={a.image} alt={a.name} fill sizes="150px" className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-ink/15">
                          <Shirt className="h-8 w-8" strokeWidth={1.1} />
                        </div>
                      )}
                      {isSelected && (
                        <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-gold-gradient text-ink shadow-gold">
                          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </span>
                      )}
                    </div>
                    <div className="space-y-0 p-2.5">
                      <p className="truncate text-xs font-bold text-ink group-hover:text-gold-700 transition-colors duration-300">{a.name}</p>
                      <p className="text-[11px] font-bold text-gold-600">
                        +₹{a.price.toLocaleString("en-IN")}<span className="font-semibold text-ink/50"> stitching + {a.metersRequired}m</span>
                      </p>
                    </div>
                  </button>
                  {a.slug && (
                    <Link
                      href={`/shop/${a.slug}`}
                      target="_blank"
                      className="mx-2.5 mb-2.5 flex items-center justify-center gap-1 rounded-lg border border-ink/10 py-1.5 text-[10px] font-bold uppercase tracking-wide text-ink/50 transition-colors hover:border-gold-400/40 hover:text-gold-700"
                    >
                      <Info className="h-3 w-3" /> Details
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1 space-y-3">
      {/* Options grid — tap a card to select it (tick appears), then confirm
          with Continue below. Two explicit steps instead of an instant jump
          on click, so a stray tap doesn't yank the customer to another page. */}
      <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-3">
        {options.map((o, i) => {
          const isSelected = selectedId === o.id;
          return (
            <div
              key={o.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedId(o.id)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelectedId(o.id)}
              className={`group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border bg-white text-left shadow-soft transition-all duration-500 animate-fadeUp opacity-0 cursor-pointer ${
                isSelected
                  ? "border-gold-400 shadow-gold ring-2 ring-gold-400/30"
                  : "border-ink/10 hover:-translate-y-1.5 hover:border-gold-400/50 hover:shadow-gold"
              }`}
              style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
            >
              <div className="relative aspect-square w-full overflow-hidden bg-white">
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
                {/* Separate from the select action — opens the full product
                    page (gallery, description, reviews) for anyone who wants
                    to inspect a style before picking it. */}
                <Link
                  href={`/shop/${o.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-2 flex items-center justify-center gap-1 rounded-lg border border-ink/10 py-1.5 text-[11px] font-bold uppercase tracking-wide text-ink/50 transition-colors hover:border-gold-400/40 hover:text-gold-700"
                >
                  <Info className="h-3 w-3" /> Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </div>

      {/* Mobile-only floating chip — opens the add-on sheet. Fixed position
          means it's reachable the instant the page loads, regardless of how
          far down the grid the customer has scrolled. */}
      {garmentAddOns.length > 0 && (
        <button
          type="button"
          onClick={() => setAddOnSheetOpen(true)}
          className={`fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full border py-2.5 pl-3.5 pr-4 text-xs font-bold shadow-2xl backdrop-blur-md transition-all lg:hidden ${
            selectedAddOn ? "border-gold-400 bg-gold-400/15 text-gold-700" : "border-gold-400/40 bg-white/95 text-ink"
          }`}
        >
          <PackageCheck className="h-4 w-4 text-gold-600" />
          {selectedAddOn ? selectedAddOn.name : `Add ${addOnLabel || "Piece"}`}
        </button>
      )}

      {/* Add-on bottom sheet — mobile only, opened via the floating chip above. */}
      {addOnSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setAddOnSheetOpen(false)} />
          <div className="relative w-full max-h-[75vh] overflow-y-auto rounded-t-3xl bg-white p-5 pb-8 shadow-2xl animate-fadeUp">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-600">
                  <PackageCheck className="h-4 w-4" /> Add a Matching {addOnLabel || "Piece"} Too
                </p>
                <p className="mt-1 text-xs font-semibold text-ink/50">Optional — bundled into the same order.</p>
              </div>
              <button type="button" onClick={() => setAddOnSheetOpen(false)} className="rounded-full border border-ink/10 p-1.5 text-ink/50">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {garmentAddOns.map((a) => {
                const isSelected = addOnId === a.id;
                return (
                  <div
                    key={a.id}
                    className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-soft transition-all duration-300 ${
                      isSelected ? "border-gold-400 shadow-gold ring-2 ring-gold-400/30" : "border-ink/10"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setAddOnId((prev) => (prev === a.id ? null : a.id));
                        setAddOnSheetOpen(false);
                      }}
                      className="block w-full text-left"
                    >
                      <div className="relative aspect-square w-full overflow-hidden bg-white">
                        {a.image ? (
                          <Image src={a.image} alt={a.name} fill sizes="180px" className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-ink/15">
                            <Shirt className="h-8 w-8" strokeWidth={1.1} />
                          </div>
                        )}
                        {isSelected && (
                          <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-gold-gradient text-ink shadow-gold">
                            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                          </span>
                        )}
                      </div>
                      <div className="space-y-0 p-2.5">
                        <p className="truncate text-xs font-bold text-ink">{a.name}</p>
                        <p className="text-[11px] font-bold text-gold-600">
                          +₹{a.price.toLocaleString("en-IN")}<span className="font-semibold text-ink/50"> stitching + {a.metersRequired}m</span>
                        </p>
                      </div>
                    </button>
                    {a.slug && (
                      <Link
                        href={`/shop/${a.slug}`}
                        target="_blank"
                        className="mx-2.5 mb-2.5 flex items-center justify-center gap-1 rounded-lg border border-ink/10 py-1.5 text-[10px] font-bold uppercase tracking-wide text-ink/50"
                      >
                        <Info className="h-3 w-3" /> Details
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
            {selectedAddOn && (
              <button
                type="button"
                onClick={() => {
                  setAddOnId(null);
                  setAddOnSheetOpen(false);
                }}
                className="mt-4 w-full rounded-xl border border-dashed border-ink/20 py-2.5 text-xs font-bold uppercase tracking-wide text-ink/50"
              >
                Remove Add-on
              </button>
            )}
          </div>
        </div>
      )}

      {/* Spacer so the fixed confirm bar below never covers the last row of cards */}
      <div className="h-24 sm:h-24" />

      {/* Confirm bar — pinned to the bottom of the screen so it's always in
          view while browsing, instead of only appearing once you scroll past
          the grid. */}
      <div className="fixed inset-x-0 bottom-0 z-30 px-4 pb-4 sm:pb-6 pointer-events-none">
        <div
          className={`pointer-events-auto mx-auto flex max-w-xl items-center justify-between gap-4 rounded-2xl border bg-white shadow-2xl transition-all duration-500 p-3 pl-5 sm:p-4 sm:pl-6 ${
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
            {selected && selectedAddOn && (
              <p className="truncate text-xs font-bold text-gold-600">+ {selectedAddOn.name}</p>
            )}
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
