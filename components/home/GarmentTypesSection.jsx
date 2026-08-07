"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function GarmentTypesSection({ garmentTypes = [] }) {
  if (garmentTypes.length === 0) return null;

  return (
    <section className="relative bg-ivory py-16 sm:py-24 overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-gold-400/5 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-wrap px-4 sm:px-6 md:px-12 relative z-10">
        <Reveal className="mb-10 flex flex-col items-start justify-between gap-4 sm:mb-14 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow text-xs sm:text-sm">
              <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-400" />
              <span className="gold-line" /> Bespoke Customization
            </p>
            <h2 className="section-heading mt-3 text-4xl sm:text-5xl md:text-6xl">
              Choose Your Style
            </h2>
          </div>
          <Link
            href="/shop?category=16c4cde3-4ebe-4522-bc3e-ae28520a35fb"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-gold-400/25 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-widest text-gold-600 backdrop-blur-sm transition-all duration-300 hover:border-gold-500/50 hover:bg-gold-400/10 hover:text-gold-700"
          >
            See All Options
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {garmentTypes.map((g, i) => {
            const href = `/shop/choose/${g.key}`;

            return (
              <Reveal key={g.id} delay={i * 80}>
                <Link
                  href={href}
                  className="group relative block overflow-hidden rounded-[2rem] border border-gold-400/15 bg-white p-6 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-500/40 hover:shadow-gold"
                >
                  {/* Top shimmer hairline */}
                  <div className="absolute inset-x-0 top-0 h-[3px] bg-gold-gradient scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                  {/* Image container */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-ivory-deep border border-ink/5">
                    {g.image_url ? (
                      <Image
                        src={g.image_url}
                        alt={g.label}
                        fill
                        sizes="(max-width: 768px) 90vw, 30vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gold-600/35">
                        <Sparkles className="h-10 w-10 animate-pulse" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-lg font-bold text-ink sm:text-xl group-hover:text-gold-700 transition-colors duration-300">
                        {g.label}
                      </h3>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gold-600">
                        {g.product_count > 0
                          ? `${g.product_count} Design${g.product_count > 1 ? "s" : ""} Available`
                          : "Fully Custom Fit"}
                      </p>
                    </div>
                    
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/5 text-gold-600 transition-all duration-300 group-hover:bg-gold-gradient group-hover:text-ink group-hover:shadow-gold">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
