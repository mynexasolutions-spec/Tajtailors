"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Trash2 } from "lucide-react";
import StarRating from "@/components/StarRating";
import { approveReview, deleteReview } from "@/actions/admin/reviews";

const TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
];

export default function ReviewList({ reviews }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState("all");

  const handleApprove = (id) => {
    startTransition(async () => {
      await approveReview(id);
      router.refresh();
    });
  };

  const handleDelete = (id) => {
    startTransition(async () => {
      await deleteReview(id);
      router.refresh();
    });
  };

  const filtered = reviews.filter((r) => {
    if (tab === "pending") return !r.is_approved;
    if (tab === "approved") return r.is_approved;
    return true;
  });

  return (
    <div>
      <div className="mb-5 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors duration-300 ${
              tab === t.key
                ? "border-gold-400/40 bg-gold-400/10 text-gold-700"
                : "border-ink/10 text-ink/45 hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-[2rem] border border-gold-400/15 bg-white py-12 text-center text-sm text-ink/45">
          No reviews here.
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((r) => (
            <li
              key={r.id}
              className="rounded-2xl border border-gold-400/15 bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StarRating rating={r.rating} size={13} />
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                        r.is_approved
                          ? "bg-green-500/10 text-green-700 border-green-500/20"
                          : "bg-gold-400/10 text-gold-700 border-gold-400/25"
                      }`}
                    >
                      {r.is_approved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-ink/70">{r.review_text || <em className="text-ink/35">No comment</em>}</p>
                  <p className="mt-2 text-sm text-ink/45">
                    {r.profiles?.full_name || r.profiles?.email} on <span className="text-ink/60">{r.products?.name}</span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {!r.is_approved && (
                    <button
                      onClick={() => handleApprove(r.id)}
                      disabled={pending}
                      className="flex items-center gap-1 rounded-xl bg-green-500/15 px-3 py-1.5 text-xs font-medium text-green-700 transition-colors hover:bg-green-500/25"
                    >
                      <Check className="h-3.5 w-3.5" /> Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(r.id)}
                    disabled={pending}
                    className="rounded-xl p-2 text-ink/45 transition-colors hover:bg-red-500/10 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
