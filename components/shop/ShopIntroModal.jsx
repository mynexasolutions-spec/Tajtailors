"use client";

import { useEffect, useState } from "react";
import { X, Shirt, Scissors, PackageCheck } from "lucide-react";

const WAYS = [
  {
    step: 1,
    icon: Shirt,
    title: "Buy Fabric & Stitch",
    desc: "Choose a fabric from our collection, pick an outfit, share your measurements — we'll stitch and deliver it to you.",
    highlight: true,
    badgeLabel: "Recommended",
  },
  {
    step: 2,
    icon: Scissors,
    title: "Stitch My Fabric",
    desc: "Got your own fabric? Send it to us — our courier picks it up from your doorstep — and we'll tailor it to your exact measurements.",
    highlight: false,
    highlightWords: "our courier picks it up from your doorstep",
  },
  {
    step: 3,
    icon: PackageCheck,
    title: "Ready-Made",
    desc: "In a hurry? Pick from our ready-to-wear kurtas — already stitched and ready to ship.",
    highlight: false,
  },
];

// Renders `desc`, wrapping `highlightWords` (if present and matched) in a
// gold-emphasis span — keeps the "we pick it up" promise from getting lost
// in a paragraph of otherwise equal-weight text.
function HighlightedDesc({ desc, highlightWords }) {
  if (!highlightWords || !desc.includes(highlightWords)) return desc;
  const [before, after] = desc.split(highlightWords);
  return (
    <>
      {before}
      <span className="font-bold text-gold-700">{highlightWords}</span>
      {after}
    </>
  );
}

export default function ShopIntroModal({ show }) {
  const [open, setOpen] = useState(false);
  // Drives the enter/exit transition separately from mount state, so closing
  // gets a proper scale-down-and-fade instead of an abrupt disappearance.
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!show) return;
    setOpen(true);
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, [show]);

  const handleClose = () => {
    setEntered(false);
    setTimeout(() => setOpen(false), 300);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <div
        className={`absolute inset-0 bg-ink/80 backdrop-blur-md transition-opacity duration-300 ${
          entered ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`relative w-full max-w-lg transition-all duration-300 ease-out ${
          entered ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-[0.97] opacity-0"
        }`}
      >
        <div className="relative overflow-hidden rounded-[1.75rem] border border-gold-400/20 bg-white shadow-2xl">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gold-gradient bg-[length:200%_200%] animate-shimmer" />

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="group absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 bg-white text-ink/60 shadow-sm transition-all duration-300 hover:border-red-400/40 hover:text-red-500"
          >
            <X className="h-4.5 w-4.5 transition-transform duration-300 group-hover:rotate-90" />
          </button>

          <div className="max-h-[85vh] overflow-y-auto p-6 sm:p-8">
            <p className="eyebrow text-xs font-bold tracking-[0.25em] text-gold-600 uppercase">
              <span className="gold-line" /> Welcome to Taj Tailor
            </p>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl font-bold leading-tight text-ink">
              3 Ways to Get Your Perfect Fit
            </h2>
            <p className="mt-2 text-sm font-semibold text-ink/55">
              Pick whichever suits you — here's how each one works.
            </p>

            <div className="mt-6 space-y-3">
              {WAYS.map((way, i) => (
                <div
                  key={way.title}
                  className={`relative flex gap-3.5 rounded-2xl p-4 transition-all duration-300 ${
                    entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                  } ${
                    way.highlight
                      ? "border-2 border-gold-400/50 bg-gold-400/[0.05] shadow-gold"
                      : "border border-ink/10 bg-white hover:border-gold-400/30 hover:bg-gold-400/[0.03]"
                  }`}
                  style={{ transitionDelay: entered ? `${120 + i * 90}ms` : "0ms" }}
                >
                  {way.highlight && (
                    <span className="absolute -top-2.5 right-4 rounded-full bg-gold-gradient px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-ink shadow-gold">
                      {way.badgeLabel}
                    </span>
                  )}

                  <span
                    className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      way.highlight ? "bg-gold-gradient text-ink shadow-gold" : "bg-gold-400/10 text-gold-600"
                    }`}
                  >
                    <way.icon className="h-5 w-5" strokeWidth={1.75} />
                    <span
                      className={`absolute -bottom-1.5 -right-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold leading-none ${
                        way.highlight ? "bg-ink text-gold-200" : "bg-gold-500 text-white"
                      }`}
                    >
                      {way.step}
                    </span>
                  </span>

                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-ink">{way.title}</h3>
                    <p className="mt-0.5 text-sm font-semibold leading-relaxed text-ink/60">
                      <HighlightedDesc desc={way.desc} highlightWords={way.highlightWords} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
