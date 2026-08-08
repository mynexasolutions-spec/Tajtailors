"use client";

import { useEffect, useState } from "react";
import { X, Shirt, PackageCheck, Truck, CheckCircle2, ChevronDown } from "lucide-react";

const STEPS = [
  {
    icon: Shirt,
    title: "Pick Any Outfit",
    desc: "Browse our outfits — Kurta, Pajama, Sherwani and more — and choose the one you want stitched.",
  },
  {
    icon: PackageCheck,
    title: "Select “I'll Send My Own Fabric”",
    desc: "This option shows up right where you'd normally pick a fabric — tap it instead.",
    highlight: true,
    badgeLabel: "That's the one",
  },
  {
    icon: Truck,
    title: "We Pick It Up",
    desc: "Our courier collects the fabric straight from your doorstep — no need to visit us.",
  },
  {
    icon: CheckCircle2,
    title: "Stitched & Delivered",
    desc: "We tailor it to your exact measurements and deliver the finished outfit home.",
  },
];

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
              <span className="gold-line" /> Great News
            </p>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl font-bold leading-tight text-ink">
              You Can Send <span className="text-gold-700">Your Own Fabric</span> Too!
            </h2>
            <p className="mt-2 text-sm font-semibold text-ink/55">
              No need to buy fabric from us — here's how it works.
            </p>

            <div className="mt-7">
              {STEPS.map((step, i) => (
                <div key={step.title}>
                  <div
                    className={`relative flex gap-4 rounded-2xl transition-all duration-300 ${
                      entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                    } ${step.highlight ? "border border-gold-400/40 bg-gold-400/[0.04] p-3" : "p-3"}`}
                    style={{ transitionDelay: entered ? `${120 + i * 100}ms` : "0ms" }}
                  >
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                        step.highlight ? "bg-gold-gradient text-ink shadow-gold" : "bg-gold-400/10 text-gold-600"
                      }`}
                    >
                      <step.icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>

                    <div className="min-w-0 flex-1 pt-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-ink">{step.title}</h3>
                        {step.highlight && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gold-600">
                            {step.badgeLabel}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm font-semibold leading-relaxed text-ink/60">{step.desc}</p>
                    </div>
                  </div>

                  {i < STEPS.length - 1 && (
                    <div className="flex gap-4 pl-3">
                      <div className="flex w-11 shrink-0 justify-center">
                        <ChevronDown className="h-4 w-4 text-gold-400/50" strokeWidth={2} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
