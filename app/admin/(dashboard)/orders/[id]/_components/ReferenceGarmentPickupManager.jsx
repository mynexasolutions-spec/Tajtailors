"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { PackageSearch, RefreshCw, CheckCircle2, ExternalLink, X } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-ink/10 bg-ivory-deep px-4 py-2.5 text-sm text-ink transition-colors duration-300 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/30";
const labelClass = "mb-1.5 block text-sm font-semibold uppercase tracking-wide text-ink/45";

const STATUS_LABELS = {
  pending: "Not booked yet",
  requested: "Pickup requested",
  picked_up: "Picked up — in transit",
  received: "Received at store",
  failed: "Pickup failed",
};
const STATUS_STYLES = {
  pending: "text-ink/60 bg-ink/5 border-ink/10",
  requested: "text-gold-700 bg-gold-400/10 border-gold-400/25",
  picked_up: "text-blue-700 bg-blue-500/10 border-blue-500/20 shadow-[0_0_12px_rgba(59,130,246,0.08)]",
  received: "text-green-700 bg-green-500/10 border-green-500/20",
  failed: "text-red-600 bg-red-500/10 border-red-500/20",
};

async function postJson(body) {
  const res = await fetch("/api/delhivery", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

function BookPickupModal({ order, onClose, onBooked }) {
  const [weightGrams, setWeightGrams] = useState(400);
  const [lengthCm, setLengthCm] = useState(30);
  const [widthCm, setWidthCm] = useState(22);
  const [heightCm, setHeightCm] = useState(5);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirm = async () => {
    setBusy(true);
    setError(null);
    const result = await postJson({
      action: "create_reverse_pickup",
      payload: {
        orderId: order.id,
        weightGrams: Number(weightGrams),
        lengthCm: Number(lengthCm),
        widthCm: Number(widthCm),
        heightCm: Number(heightCm),
      },
    });
    setBusy(false);
    if (!result.success) return setError(result.error || "Booking failed.");
    onBooked();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-[2rem] border border-gold-400/15 bg-white p-6 shadow-soft sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageSearch className="h-5 w-5 text-gold-600" />
            <h3 className="font-display text-lg font-bold text-ink">Book Reverse Pickup</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-ink/40 hover:bg-ivory-deep hover:text-ink"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-5 text-sm text-ink/60 font-semibold">
          Delhivery will collect the reference garment / fabric for order{" "}
          <span className="text-ink font-bold">{order.order_number}</span> from the customer's pickup address and
          courier it back to the store.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Weight (g)</label>
            <input type="number" value={weightGrams} onChange={(e) => setWeightGrams(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Length (cm)</label>
            <input type="number" value={lengthCm} onChange={(e) => setLengthCm(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Width (cm)</label>
            <input type="number" value={widthCm} onChange={(e) => setWidthCm(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Height (cm)</label>
            <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className={inputClass} />
          </div>
        </div>

        {error && <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="flex-1 rounded-xl border border-ink/10 bg-ivory-deep px-4 py-3 text-xs font-bold uppercase tracking-wide text-ink/60 hover:text-ink disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={busy}
            className="btn-gold flex-1 px-4 py-3 text-xs font-bold uppercase tracking-wide disabled:opacity-60"
          >
            {busy ? "Booking…" : "Confirm Pickup"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function ReferenceGarmentPickupManager({ order }) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);

  if (!order.pickup_required) return null;

  const hasOwnFabric = order.order_items.some((i) => i.measurement_type && !i.fabric?.name);
  const hasReferenceGarment = order.order_items.some((i) => i.measurement_type === "reference_garment");
  const pickupTitle =
    hasOwnFabric && hasReferenceGarment
      ? "Fabric & Reference Garment Pickup"
      : hasOwnFabric
        ? "Fabric Pickup"
        : "Reference Garment Pickup";

  const handleTrackNow = async () => {
    setBusy("track");
    setError(null);
    const result = await postJson({ action: "track_reverse_pickup", payload: { orderId: order.id } });
    setBusy(null);
    if (!result.success) return setError(result.error || "Tracking lookup failed.");
    router.refresh();
  };

  const handleMarkReceived = async () => {
    setBusy("receive");
    setError(null);
    const result = await postJson({ action: "mark_pickup_received", payload: { orderId: order.id } });
    setBusy(null);
    if (!result.success) return setError(result.error || "Could not update status.");
    router.refresh();
  };

  const status = order.pickup_status || "pending";

  return (
    <div className="mt-5 border-t border-ink/10 pt-5 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <PackageSearch className="h-4 w-4 text-gold-600" />
          <h3 className="text-sm font-bold uppercase tracking-wide text-ink/45">{pickupTitle}</h3>
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-bold transition-all duration-300 ${STATUS_STYLES[status]}`}>
          {STATUS_LABELS[status]}
        </span>
      </div>

      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

      {!order.pickup_waybill ? (
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="btn-gold w-fit px-4 py-2.5 text-xs font-bold uppercase tracking-wide"
        >
          Book Reverse Pickup
        </button>
      ) : (
        <>
          <div className="text-sm font-semibold flex items-center gap-1.5">
            <span className="text-ink/45">Waybill:</span>{" "}
            <span className="font-mono text-ink font-bold select-all bg-ivory-deep border border-ink/10 px-2 py-0.5 rounded-lg">{order.pickup_waybill}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={order.pickup_tracking_url || `https://www.delhivery.com/track/package/${order.pickup_waybill}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-ink/10 bg-white px-3 py-3 text-center text-xs font-bold text-ink hover:border-gold-400/40 hover:bg-gold-50/20 active:scale-[0.99] transition-all duration-300 shadow-sm"
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-ink/40" /> Track
            </a>
            <button
              type="button"
              onClick={handleTrackNow}
              disabled={busy === "track" || status === "received"}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-ink/10 bg-white px-3 py-3 text-center text-xs font-bold text-ink hover:border-gold-400/40 hover:bg-gold-50/20 active:scale-[0.99] transition-all duration-300 disabled:opacity-50 shadow-sm"
            >
              <RefreshCw className={`h-3.5 w-3.5 shrink-0 text-ink/40 ${busy === "track" ? "animate-spin" : ""}`} /> {busy === "track" ? "Checking…" : "Refresh"}
            </button>
          </div>

          {status !== "received" && (
            <button
              type="button"
              onClick={handleMarkReceived}
              disabled={busy === "receive"}
              className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-emerald-700 hover:shadow-lg active:scale-[0.98] transition-all duration-300 disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" /> {busy === "receive" ? "Updating…" : "Mark as Received at Store"}
            </button>
          )}
        </>
      )}

      {modalOpen && (
        <BookPickupModal
          order={order}
          onClose={() => setModalOpen(false)}
          onBooked={() => {
            setModalOpen(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
