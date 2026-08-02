import { MessageSquare, Clock, CheckCircle2, Star } from "lucide-react";
import { getAllReviewsAdmin } from "@/actions/admin/reviews";
import ReviewList from "./_components/ReviewList";

export const metadata = { title: "Reviews" };

export default async function AdminReviewsPage() {
  const reviews = await getAllReviewsAdmin();

  const pendingCount = reviews.filter((r) => !r.is_approved).length;
  const approvedCount = reviews.length - pendingCount;
  const avgRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  const stats = [
    { label: "Total Reviews", value: reviews.length, icon: MessageSquare },
    { label: "Pending", value: pendingCount, icon: Clock },
    { label: "Approved", value: approvedCount, icon: CheckCircle2 },
    { label: "Avg Rating", value: avgRating ? avgRating.toFixed(1) : "—", icon: Star },
  ];

  return (
    <div>
      {/* Header Panel */}
      <div className="mb-8 border-b border-gold-400/10 pb-6">
        <h1 className="font-display text-3xl font-light text-ink">
          Customer <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">Reviews</span>
        </h1>
        <p className="text-sm text-ink/50 font-light mt-1">Approve reviews before they appear on product pages.</p>
      </div>

      {/* Stat Strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 rounded-2xl border border-gold-400/15 bg-white px-4 py-3.5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600">
              <s.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-xl leading-none text-ink">{s.value}</p>
              <p className="truncate text-xs uppercase tracking-wide text-ink/45">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <ReviewList reviews={reviews} />
    </div>
  );
}
