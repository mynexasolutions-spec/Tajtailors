"use client";

import { useState } from "react";
import StarRating from "@/components/StarRating";

// How many reviews to show up front, and how many more to reveal per click.
const INITIAL_COUNT = 5;
const BATCH_SIZE = 10;

export default function ReviewsList({ reviews, hasOwnReview = false }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  if (!reviews || reviews.length === 0) {
    return (
      <p className="text-sm sm:text-base text-ink/45 font-light">
        {hasOwnReview ? "No other reviews yet." : "No reviews yet — be the first to share yours."}
      </p>
    );
  }

  const visible = reviews.slice(0, visibleCount);
  const remaining = reviews.length - visibleCount;

  return (
    <div className="space-y-4">
      <ul className="space-y-4">
        {visible.map((r) => (
          <li
            key={r.id}
            className="rounded-2xl border border-ink/10 bg-white p-5 flex flex-col justify-between hover:border-gold-400/30 hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(212,163,89,0.08)] transition-all duration-300"
          >
            <div>
              <StarRating rating={r.rating} size={12} />
              {r.review_text && <p className="mt-3 text-sm sm:text-base text-ink/70 font-light leading-relaxed">&ldquo;{r.review_text}&rdquo;</p>}
            </div>
            <p className="mt-4 text-xs uppercase tracking-wider text-ink/45 font-semibold">{r.profiles?.full_name || "Taj Tailor Customer"}</p>
          </li>
        ))}
      </ul>

      {remaining > 0 && (
        <button
          type="button"
          onClick={() => setVisibleCount((c) => Math.min(c + BATCH_SIZE, reviews.length))}
          className="w-full rounded-full border border-gold-400/25 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-widest text-gold-600 transition-all duration-300 hover:border-gold-400/50 hover:bg-gold-400/5 hover:scale-[1.01]"
        >
          View All Reviews ({remaining} more)
        </button>
      )}
    </div>
  );
}
