"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X, Check, SlidersHorizontal, Layers, IndianRupee, PackageCheck } from "lucide-react";
import SortSelect from "./SortSelect";

export default function ShopFilters({ categories }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const minPriceRef = useRef(null);
  const maxPriceRef = useRef(null);

  const activeCategory = searchParams.get("category") || "";
  // A header-nav ?type= filter (e.g. "Buy Fabric & Stitch" -> type=fabric) segments
  // the catalog the same way a category does, just via a different param — "All
  // Products" must not show as selected while one of these is active.
  const activeType = searchParams.get("type") || "";
  const activeMinPrice = searchParams.get("minPrice") || "";
  const activeMaxPrice = searchParams.get("maxPrice") || "";
  const activePriceKey = activeMinPrice || activeMaxPrice ? `${activeMinPrice}-${activeMaxPrice}` : "";
  const inStockOnly = searchParams.get("inStock") === "1";

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

  const applyCustomPrice = () => {
    const min = minPriceRef.current?.value ? Number(minPriceRef.current.value) : null;
    const max = maxPriceRef.current?.value ? Number(maxPriceRef.current.value) : null;
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set("minPrice", String(min)); else params.delete("minPrice");
    if (max) params.set("maxPrice", String(max)); else params.delete("maxPrice");
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const toggleInStock = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (inStockOnly) params.delete("inStock");
    else params.set("inStock", "1");
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const activeCount = [activeCategory, activeType, activePriceKey, inStockOnly ? "stock" : ""].filter(Boolean).length;
  const hasFilters = activeCount > 0;

  const PRICE_BANDS = [
    { label: "Under ₹1,500", min: null, max: 1500 },
    { label: "₹1,500 – ₹3,500", min: 1500, max: 3500 },
    { label: "₹3,500 – ₹7,000", min: 3500, max: 7000 },
    { label: "Above ₹7,000", min: 7000, max: null },
  ];

  const OptionRow = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`group relative flex items-center justify-between overflow-hidden rounded-2xl py-3 pl-4 pr-3.5 text-left text-sm font-semibold transition-all duration-300 ${
        active
          ? "border border-gold-400/25 bg-gold-400/5 text-gold-700 font-semibold"
          : "border border-transparent text-ink/65 hover:bg-gold-400/[0.04] hover:text-ink"
      }`}
    >
      <span className="relative">{children}</span>
      {active && (
        <span className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-400/20 text-gold-700">
          <Check className="h-3 w-3" strokeWidth={2.5} />
        </span>
      )}
    </button>
  );

  const filterGroups = (
    <div className="space-y-8">
      <div>
        <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-gold-700">
          <Layers className="h-3.5 w-3.5" strokeWidth={2.5} /> Category
        </p>
        <div className="flex flex-col gap-1">
          <OptionRow active={!activeCategory && !activeType} onClick={() => setParam("category", "")}>
            All Products
          </OptionRow>
          {categories.map((cat) => (
            <OptionRow key={cat.id} active={activeCategory === cat.id} onClick={() => setParam("category", cat.id)}>
              {cat.name}
            </OptionRow>
          ))}
        </div>
      </div>

      <div className="border-t border-gold-400/10 pt-6">
        <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-gold-700">
          <IndianRupee className="h-3.5 w-3.5" strokeWidth={2.5} /> Price
        </p>
        <div className="flex flex-col gap-1">
          {PRICE_BANDS.map((band) => {
            const active = activeMinPrice === String(band.min || "") && activeMaxPrice === String(band.max || "");
            return (
              <OptionRow key={band.label} active={active} onClick={() => setPriceRange(band.min, band.max)}>
                {band.label}
              </OptionRow>
            );
          })}
        </div>

        {/* Custom range — the preset bands are a shortcut, not the ceiling;
            a shopper with a specific budget should be able to type it in. */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2">
            <input
              key={`min-${activeMinPrice}`}
              ref={minPriceRef}
              type="number"
              min="0"
              placeholder="Min ₹"
              defaultValue={activeMinPrice}
              className="w-full min-w-0 appearance-none rounded-xl border border-ink/10 bg-white px-2.5 py-2 text-sm text-ink font-semibold placeholder:text-ink/30 transition-colors focus:border-gold-400/50 focus:outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="shrink-0 text-ink/30">–</span>
            <input
              key={`max-${activeMaxPrice}`}
              ref={maxPriceRef}
              type="number"
              min="0"
              placeholder="Max ₹"
              defaultValue={activeMaxPrice}
              className="w-full min-w-0 appearance-none rounded-xl border border-ink/10 bg-white px-2.5 py-2 text-sm text-ink font-semibold placeholder:text-ink/30 transition-colors focus:border-gold-400/50 focus:outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <button
            type="button"
            onClick={applyCustomPrice}
            className="btn-gold w-full py-2.5 text-xs font-bold uppercase tracking-wider shadow-gold transition-transform duration-300 hover:scale-[1.02]"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="border-t border-gold-400/10 pt-6">
        <button
          type="button"
          onClick={toggleInStock}
          className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-sm font-semibold transition-all duration-300 ${
            inStockOnly ? "border-gold-400/40 bg-gold-400/5 text-gold-700" : "border-ink/10 text-ink/60 hover:border-gold-400/30"
          }`}
        >
          <span className="flex items-center gap-2.5">
            <PackageCheck className={`h-4 w-4 ${inStockOnly ? "text-gold-600" : "text-ink/35"}`} /> In Stock Only
          </span>
          <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-300 ${inStockOnly ? "bg-gold-gradient" : "bg-ink/15"}`}>
            <span
              className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ${
                inStockOnly ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile trigger — opens the filter drawer */}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="group relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-2xl border border-gold-400/20 bg-white px-5 py-4 shadow-soft transition-all duration-300 hover:border-gold-400/40 hover:shadow-gold md:hidden"
      >
        <span className="absolute inset-x-0 top-0 h-[2px] bg-gold-gradient bg-[length:200%_200%] animate-shimmer" />
        <span className="flex items-center gap-2.5 font-display text-base text-ink">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-400/25 bg-gold-400/10 text-gold-600 shadow-[0_0_15px_rgba(212,163,89,0.1)] transition-transform duration-300 group-hover:scale-105">
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.75} />
          </span>
          Filters
          {hasFilters && (
            <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gold-gradient px-1.5 text-xs font-bold text-ink shadow-gold">
              {activeCount}
            </span>
          )}
        </span>
        <span className="text-sm font-bold text-gold-600 transition-transform duration-300 group-hover:translate-x-0.5">Open</span>
      </button>

      {/* Desktop sidebar — always visible */}
      <div className="relative hidden overflow-hidden rounded-[2rem] border border-gold-400/15 bg-white p-6 shadow-soft md:block">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gold-gradient bg-[length:200%_200%] animate-shimmer" />

        <div className="relative mb-6 flex items-center justify-between border-b border-gold-400/10 pb-5">
          <span className="flex items-center gap-2.5 font-display text-lg text-ink">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-400/25 bg-gold-400/10 text-gold-600 shadow-[0_0_15px_rgba(212,163,89,0.12)]">
              <SlidersHorizontal className="h-4 w-4" strokeWidth={1.75} />
            </span>
            Filters
          </span>
          {hasFilters && (
            <button
              onClick={() => router.push(pathname)}
              className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-ink/45 transition-colors hover:text-red-500"
            >
              <X className="h-3.5 w-3.5" /> Clear
            </button>
          )}
        </div>
        <div className="relative">{filterGroups}</div>
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/75 backdrop-blur-md transition-opacity duration-500 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-[1000] flex h-full w-full max-w-sm flex-col border-r border-gold-400/15 bg-white shadow-2xl transition-transform duration-500 ease-out md:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative flex items-center justify-between overflow-hidden border-b border-gold-400/15 px-6 py-5">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gold-gradient bg-[length:200%_200%] animate-shimmer" />
          <span className="flex items-center gap-2.5 font-display text-lg text-ink">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-400/25 bg-gold-400/10 text-gold-600">
              <SlidersHorizontal className="h-4.5 w-4.5" strokeWidth={1.75} />
            </span>
            Filters
            {hasFilters && (
              <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gold-gradient px-1.5 text-xs font-bold text-ink shadow-gold">
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

        <div className="space-y-3 border-t border-gold-400/15 bg-white px-6 py-5">
          {hasFilters && (
            <button
              onClick={() => router.push(pathname)}
              className="flex w-full items-center justify-center gap-1.5 text-sm font-bold text-ink/50 transition-colors hover:text-red-500"
            >
              <X className="h-3.5 w-3.5" /> Clear all filters
            </button>
          )}
          <button
            onClick={() => setDrawerOpen(false)}
            className="btn-gold block w-full py-4 text-center text-xs font-semibold uppercase tracking-widest shadow-[0_4px_20px_rgba(212,163,89,0.2)] hover:shadow-[0_4px_28px_rgba(212,163,89,0.35)] hover:-translate-y-0.5 transition-all duration-300"
          >
            Show Results
          </button>
        </div>
      </aside>
    </>
  );
}
