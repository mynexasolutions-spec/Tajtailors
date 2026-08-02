import { Star } from "lucide-react";

export default function StarRating({ rating = 0, size = 14, showValue = false }) {
  const rounded = Math.round(rating * 2) / 2;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            width={size}
            height={size}
            className={n <= rounded ? "fill-gold-500 text-gold-500" : "fill-none text-ink/25"}
          />
        ))}
      </div>
      {showValue && rating > 0 && (
        <span className="text-xs text-ink/50">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
