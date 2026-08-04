"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import Reveal from "@/components/Reveal";

const VISIBLE_COUNT = 3;

function getVisible(testimonials, startIndex) {
  return Array.from(
    { length: Math.min(VISIBLE_COUNT, testimonials.length) },
    (_, i) => testimonials[(startIndex + i) % testimonials.length]
  );
}

export default function TestimonialSection({
  testimonials = [],
  eyebrow = "Loved by Customers Across India",
  heading = "Stories From Our Community",
}) {
  const [startIndex, setStartIndex] = useState(0);

  const goTo = (target) => setStartIndex(target);
  const handleNext = () => goTo((startIndex + 1) % testimonials.length);
  const handlePrev = () => goTo((startIndex - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    if (testimonials.length <= VISIBLE_COUNT) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [startIndex, testimonials.length]);

  if (testimonials.length === 0) return null;

  const visible = getVisible(testimonials, startIndex);

  return (
    <section className="relative bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-wrap px-6 md:px-12 relative">
        <div className="pointer-events-none absolute -left-24 top-10 h-96 w-96 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-20 h-80 w-80 rounded-full bg-gold-300/10 blur-3xl" />

        <Reveal className="text-center max-w-2xl mx-auto mb-16 relative z-10">
          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-600 mb-3 block">
            {eyebrow}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-ink">
            {heading}
          </h2>
          <div className="w-16 h-[1px] bg-gold-400/40 mx-auto mt-4" />
        </Reveal>

        <Reveal delay={100} className="relative z-10">
          <div key={startIndex} className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideInRight">
            {visible.map((t, i) => (
              <div
                key={`${t.id}-${i}`}
                className={`group flex h-full flex-col rounded-3xl border border-gold-400/20 bg-gradient-to-br from-white via-ivory to-ivory-deep p-8 shadow-soft transition-all duration-500 hover:border-gold-400/40 hover:-translate-y-1 ${i === 0 ? "" : "hidden md:flex"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star
                        key={si}
                        className={`w-4 h-4 ${si < Math.round(t.rating) ? "fill-gold-500 text-gold-500" : "fill-none text-ink/20"}`}
                      />
                    ))}
                  </div>
                  <Quote className="h-7 w-7 text-gold-500/30" strokeWidth={1.5} />
                </div>

                <p className="mt-5 flex-1 text-base sm:text-lg leading-relaxed text-ink/70 font-semibold italic">
                  &ldquo;{t.review_text}&rdquo;
                </p>

                <div className="mt-6 flex items-center gap-3 border-t border-ink/10 pt-5">
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold-400/25 bg-gold-400/10 font-display text-base font-semibold text-gold-700">
                    {t.image_url ? (
                      <Image src={t.image_url} alt={t.customer_name} fill sizes="48px" className="object-cover" />
                    ) : (
                      t.customer_name.charAt(0)
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-base text-ink font-semibold truncate">{t.customer_name}</p>
                    {t.location && <p className="text-sm text-ink/45 font-semibold truncate">{t.location}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {testimonials.length > VISIBLE_COUNT && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={handlePrev}
                aria-label="Previous testimonials"
                className="w-11 h-11 rounded-full border border-gold-400/25 bg-white text-gold-600 hover:text-gold-700 hover:border-gold-400/50 flex items-center justify-center transition-all shadow-soft hover:-translate-x-1"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-1.5">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goTo(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${idx === startIndex ? "w-8 bg-gold-500" : "w-2.5 bg-ink/15 hover:bg-gold-400/40"
                      }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                aria-label="Next testimonials"
                className="w-11 h-11 rounded-full border border-gold-400/25 bg-white text-gold-600 hover:text-gold-700 hover:border-gold-400/50 flex items-center justify-center transition-all shadow-soft hover:translate-x-1"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
