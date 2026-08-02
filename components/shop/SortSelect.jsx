"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ArrowUpDown, ArrowUpNarrowWide, ArrowDownWideNarrow, Check, ChevronDown, Sparkles, Star } from "lucide-react";

const OPTIONS = [
  { value: "", label: "Newest", icon: Sparkles },
  { value: "price_asc", label: "Price: Low to High", icon: ArrowUpNarrowWide },
  { value: "price_desc", label: "Price: High to Low", icon: ArrowDownWideNarrow },
  { value: "rating", label: "Top Rated", icon: Star },
];

export default function SortSelect({ className = "" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSort = searchParams.get("sort") || "";

  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const selectValue = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("sort", value);
    else params.delete("sort");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setOpen(false);
  };

  const activeLabel = OPTIONS.find((o) => o.value === activeSort)?.label || OPTIONS[0].label;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between gap-3 rounded-full border bg-white px-5 py-3 text-sm shadow-soft transition-all duration-300 ${
          open ? "border-gold-400/70 shadow-gold" : "border-gold-400/20 hover:border-gold-400/50 hover:shadow-gold"
        }`}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <ArrowUpDown className="h-3.5 w-3.5 shrink-0 text-gold-600" />
          <span className="truncate">
            <span className="mr-1 text-ink/40">Sort:</span>
            <span className="font-semibold text-ink">{activeLabel}</span>
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-gold-600 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2.5 w-full min-w-[240px] overflow-hidden rounded-2xl border border-gold-400/20 bg-white py-2 shadow-2xl ring-1 ring-black/5 animate-fadeUp">
          {OPTIONS.map((option) => {
            const isActive = option.value === activeSort;
            const Icon = option.icon;
            return (
              <button
                key={option.value || "default"}
                type="button"
                onClick={() => selectValue(option.value)}
                className={`group relative flex w-full items-center gap-3 py-2.5 pl-5 pr-4 text-left text-sm transition-all duration-200 ${
                  isActive ? "bg-gold-400/[0.08] font-semibold text-gold-700" : "text-ink/65 hover:bg-ivory-deep hover:text-ink"
                }`}
              >
                <span
                  className={`absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-gold-gradient transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
                <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-gold-600" : "text-ink/35 group-hover:text-gold-500"}`} />
                <span className="flex-1">{option.label}</span>
                {isActive && <Check className="h-3.5 w-3.5 shrink-0 text-gold-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
