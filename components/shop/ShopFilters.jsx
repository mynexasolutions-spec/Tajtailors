"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X, Check, SlidersHorizontal } from "lucide-react";
import SortSelect from "./SortSelect";

export default function ShopFilters({ categories }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeCategory = searchParams.get("category") || "";
  const activeMinPrice = searchParams.get("minPrice") || "";
  const activeMaxPrice = searchParams.get("maxPrice") || "";
  const activePriceKey = activeMinPrice || activeMaxPrice ? `${activeMinPrice}-${activeMaxPrice}` : "";

  const setParam = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    // Category and the "type" param from header nav links (e.g. /shop?type=fabric)
    // both segment the same catalog — leaving a stale type= behind while picking
    // a category can silently cancel out to zero results, so a fresh category
    // choice always wins.
    if (key === "category") params.delete("type");
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const setPriceRange = (min, max) => {
    const params = new URLSearchParams(searchParams.toString());
    const isActive = activeMinPrice === String(min || "") && activeMaxPrice === String(max || "");
    if (isActive) {
      params.delete("minPrice");
      params.delete("maxPrice");
    } else {
      if (min) params.set("minPrice", String(min)); else params.delete("minPrice");
      if (max) params.set("maxPrice", String(max)); else params.delete("maxPrice");
    }
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const activeCount = [activeCategory, activePriceKey].filter(Boolean).length;
  const hasFilters = activeCount > 0;

  const PRICE_BANDS = [
    { label: "Under ₹1,500", min: null, max: 1500 },
    { label: "₹1,500 – ₹3,500", min: 1500, max: 3500 },
    { label: "₹3,500 – ₹7,000", min: 3500, max: 7000 },
    { label: "Above ₹7,000", min: 7000, max: null },
  ];

  const categoryButtonClass = (active) =>
    `group relative flex items-center justify-between rounded-xl py-2.5 pl-4 pr-3.5 text-left text-sm transition-all duration-300 ${
      active ? "bg-gold-400/[0.07] text-gold-700 font-medium" : "text-ink/60 hover:bg-ivory-deep hover:text-ink"
    }`;

  const filterGroups = (
    <div className="space-y-7">
      <div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-300/80">Category</p>
        <div className="flex flex-col gap-0.5">
          <button onClick={() => setParam("category", "")} className={categoryButtonClass(!activeCategory)}>
            <span
              className={`absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-gold-gradient transition-opacity duration-300 ${
                !activeCategory ? "opacity-100" : "opacity-0"
              }`}
            />
            All Products
            {!activeCategory && <Check className="h-3.5 w-3.5 text-gold-600" />}
          </button>
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setParam("category", cat.id)} className={categoryButtonClass(activeCategory === cat.id)}>
              <span
                className={`absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-gold-gradient transition-opacity duration-300 ${
                  activeCategory === cat.id ? "opacity-100" : "opacity-0"
                }`}
              />
              {cat.name}
              {activeCategory === cat.id && <Check className="h-3.5 w-3.5 text-gold-600" />}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-ink/[0.06] pt-6">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-300/80">Price</p>
        <div className="flex flex-col gap-0.5">
          {PRICE_BANDS.map((band) => {
            const active = activeMinPrice === String(band.min || "") && activeMaxPrice === String(band.max || "");
            return (
              <button
                key={band.label}
                onClick={() => setPriceRange(band.min, band.max)}
                className={categoryButtonClass(active)}
              >
                <span
                  className={`absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-gold-gradient transition-opacity duration-300 ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                />
                {band.label}
                {active && <Check className="h-3.5 w-3.5 text-gold-600" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile trigger — opens the filter drawer */}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-gold-400/15 bg-white px-5 py-4 shadow-soft md:hidden"
      >
        <span className="flex items-center gap-2.5 font-display text-base text-ink">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/5 text-gold-600">
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
          </span>
          Filters
          {hasFilters && (
            <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gold-400/15 px-1.5 text-xs font-semibold text-gold-700">
              {activeCount}
            </span>
          )}
        </span>
        <span className="text-sm font-medium text-gold-600">Open</span>
      </button>

      {/* Desktop sidebar — always visible */}
      <div className="relative hidden overflow-hidden rounded-[2rem] border border-gold-400/15 bg-white p-6 shadow-soft md:block">
        <div className="absolute inset-x-0 top-0 h-1 bg-gold-gradient" />
        <div className="mb-6 flex items-center justify-between border-b border-ink/10 pb-4">
          <span className="flex items-center gap-2.5 font-display text-base text-ink">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/5 text-gold-600">
              <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
            </span>
            Filters
          </span>
          {hasFilters && (
            <button
              onClick={() => router.push(pathname)}
              className="flex items-center gap-1 text-sm font-medium text-ink/50 transition-colors hover:text-red-500"
            >
              <X className="h-3.5 w-3.5" /> Clear
            </button>
          )}
        </div>
        {filterGroups}
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-md transition-opacity duration-500 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-[70] flex h-full w-full max-w-sm flex-col border-r border-gold-400/15 bg-white shadow-2xl transition-transform duration-500 ease-out md:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gold-400/15 px-6 py-5">
          <span className="flex items-center gap-2.5 font-display text-lg text-ink">
            <SlidersHorizontal className="h-5 w-5 text-gold-600" strokeWidth={1.5} />
            Filters
            {hasFilters && (
              <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gold-400/15 px-1.5 text-xs font-semibold text-gold-700">
                {activeCount}
              </span>
            )}
          </span>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close filters"
            className="group rounded-full border border-gold-400/15 bg-white p-1.5 text-ink/60 transition-all duration-300 hover:border-gold-400/40 hover:text-gold-700"
          >
            <X className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-gold-400/10">
          <div className="mb-7">
            <SortSelect />
          </div>
          {filterGroups}
        </div>

        <div className="space-y-3 border-t border-gold-400/15 bg-ivory-deep px-6 py-5">
          {hasFilters && (
            <button
              onClick={() => router.push(pathname)}
              className="flex w-full items-center justify-center gap-1.5 text-sm font-medium text-ink/50 transition-colors hover:text-red-500"
            >
              <X className="h-3.5 w-3.5" /> Clear all filters
            </button>
          )}
          <button
            onClick={() => setDrawerOpen(false)}
            className="btn-gold block w-full py-3.5 text-center text-xs font-semibold uppercase tracking-widest"
          >
            Show Results
          </button>
        </div>
      </aside>
    </>
  );
}
