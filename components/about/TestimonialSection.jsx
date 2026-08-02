"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import Reveal from "@/components/Reveal";

const TESTIMONIALS = [
  {
    name: "Ayesha Kapoor",
    location: "Mumbai",
    rating: 5,
    text: "I sent my own fabric and shared measurements through the guide — the kurta came back fitting better than anything I've bought off the rack. Stitching is neat and clean.",
    title: "Architecture & Design",
  },
  {
    name: "Rohit Malhotra",
    location: "Delhi",
    rating: 5,
    text: "Doorstep pickup made this so easy. No trips to the tailor, no back-and-forth for fittings — just shared my measurements and it arrived perfect within a week.",
    title: "Marketing Executive",
  },
  {
    name: "Sana Sheikh",
    location: "Hyderabad",
    rating: 5,
    text: "Ordered the Egyptian Cotton fabric and had it stitched into a kurta. The fabric quality is excellent and the fit is exactly what I asked for. Already recommended to friends.",
    title: "Freelance Writer",
  },
  {
    name: "Vikram Patel",
    location: "Bangalore",
    rating: 5,
    text: "As someone who travels constantly, finding a tailor I can trust without a fitting is impossible. Taj Tailor is my go-to now. Pan-India shipping is quick, packaging is pristine.",
    title: "Corporate Consultant",
  },
];

const VISIBLE_COUNT = 3;

function getVisible(startIndex) {
  return Array.from(
    { length: Math.min(VISIBLE_COUNT, TESTIMONIALS.length) },
    (_, i) => TESTIMONIALS[(startIndex + i) % TESTIMONIALS.length]
  );
}

export default function TestimonialSection() {
  const [startIndex, setStartIndex] = useState(0);

  const goTo = (target) => setStartIndex(target);
  const handleNext = () => goTo((startIndex + 1) % TESTIMONIALS.length);
  const handlePrev = () => goTo((startIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  useEffect(() => {
    if (TESTIMONIALS.length <= VISIBLE_COUNT) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [startIndex]);

  const visible = getVisible(startIndex);

  return (
    <section className="py-24 relative">
      <div className="mx-auto max-w-wrap px-6 md:px-12 relative">
        <div className="pointer-events-none absolute -left-24 top-10 h-96 w-96 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-20 h-80 w-80 rounded-full bg-gold-300/10 blur-3xl" />

        <Reveal className="text-center max-w-2xl mx-auto mb-16 relative z-10">
          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-600 mb-3 block">
            Loved by Customers Across India
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-ink">
            Stories From Our Community
          </h2>
          <div className="w-16 h-[1px] bg-gold-400/40 mx-auto mt-4" />
        </Reveal>

        <Reveal delay={100} className="relative z-10">
          <div key={startIndex} className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideInRight">
            {visible.map((t, i) => (
              <div
                key={`${t.name}-${i}`}
                className={`group flex h-full flex-col rounded-3xl border border-gold-400/20 bg-gradient-to-br from-white via-ivory to-ivory-deep p-8 shadow-soft transition-all duration-500 hover:border-gold-400/40 hover:-translate-y-1 ${
                  i === 0 ? "" : "hidden md:flex"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star
                        key={si}
                        className={`w-4 h-4 ${si < t.rating ? "fill-gold-500 text-gold-500" : "fill-none text-ink/20"}`}
                      />
                    ))}
                  </div>
                  <Quote className="h-7 w-7 text-gold-500/30" strokeWidth={1.5} />
                </div>

                <p className="mt-5 flex-1 text-base sm:text-lg leading-relaxed text-ink/70 font-semibold italic">
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="mt-6 flex items-center gap-3 border-t border-ink/10 pt-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold-400/25 bg-gold-400/10 font-display text-base font-semibold text-gold-700">
                    {t.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-base text-ink font-semibold truncate">{t.name}</p>
                    <p className="text-sm text-ink/45 font-semibold truncate">
                      {t.title} &middot; {t.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {TESTIMONIALS.length > VISIBLE_COUNT && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={handlePrev}
                aria-label="Previous testimonials"
                className="w-11 h-11 rounded-full border border-gold-400/25 bg-white text-gold-600 hover:text-gold-700 hover:border-gold-400/50 flex items-center justify-center transition-all shadow-soft hover:-translate-x-1"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-1.5">
                {TESTIMONIALS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goTo(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === startIndex ? "w-8 bg-gold-500" : "w-2.5 bg-ink/15 hover:bg-gold-400/40"
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
