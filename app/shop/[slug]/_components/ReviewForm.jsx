"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { submitReview } from "@/actions/reviews";
import { useToast } from "@/context/ToastContext";
import StarRating from "@/components/StarRating";

export default function ReviewForm({ productId, existingReview }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      showToast("Please choose a star rating.", "error");
      return;
    }
    startTransition(async () => {
      const result = await submitReview(productId, rating, text);
      if (!result.success) {
        if (result.requiresLogin) {
          showToast("Please log in to leave a review.", "error");
        } else {
          showToast(result.error || "Something went wrong.", "error");
        }
        return;
      }
      setDone(true);
      showToast("Thanks — your review is pending approval.");
    });
  };

  if (done) {
    return (
      <div className="card-panel p-6 text-base text-ink/60">
        Thank you for your review — it will appear here once approved by our team.
      </div>
    );
  }

  // Already reviewed this product — show their review back instead of a
  // blank form, since only one review per product is allowed per user.
  if (existingReview) {
    return (
      <div className="card-panel space-y-3 p-6">
        <p className="font-display text-lg text-ink">Your Review</p>
        <StarRating rating={existingReview.rating} size={16} />
        {existingReview.review_text && (
          <p className="text-lg text-ink/80 font-semibold leading-relaxed">&ldquo;{existingReview.review_text}&rdquo;</p>
        )}
        {!existingReview.is_approved && (
          <p className="text-sm text-ink/45">Pending approval — it will appear publicly once our team reviews it.</p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card-panel space-y-4 p-6">
      <p className="font-display text-lg text-ink">Write a Review</p>
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            type="button"
            key={n}
            onMouseEnter={() => setHoverRating(n)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(n)}
            aria-label={`Rate ${n} stars`}
          >
            <Star
              className={`h-6 w-6 ${
                n <= (hoverRating || rating) ? "fill-gold-500 text-gold-500" : "fill-none text-ink/25"
              }`}
            />
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        maxLength={800}
        placeholder="How was your experience with this product?"
        className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-base text-ink placeholder:text-ink/35 focus:border-gold-400/50 focus:outline-none"
      />
      <button type="submit" disabled={pending} className="btn-gold disabled:opacity-60">
        {pending ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
