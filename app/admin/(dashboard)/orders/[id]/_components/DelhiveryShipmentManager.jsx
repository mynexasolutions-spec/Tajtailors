"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Truck, RefreshCw, PackageCheck, ExternalLink, X } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-ink/10 bg-ivory-deep px-4 py-2.5 text-sm text-ink transition-colors duration-300 focus:border-gold-400/50 focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/30";
const labelClass = "mb-1.5 block text-sm font-semibold uppercase tracking-wide text-ink/45";

async function postJson(body) {
  const res = await fetch("/api/delhivery", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

function CreateShipmentModal({ order, onClose, onBooked }) {
  const [weightGrams, setWeightGrams] = useState(500);
  const [lengthCm, setLengthCm] = useState(30);
  const [widthCm, setWidthCm] = useState(22);
  const [heightCm, setHeightCm] = useState(5);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirm = async () => {
    setBusy(true);
    setError(null);
    const result = await postJson({
      action: "create_shipment",
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
            <Truck className="h-5 w-5 text-gold-600" />
            <h3 className="font-display text-lg font-bold text-ink">Ship via Delhivery</h3>
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
          Order <span className="text-ink font-bold">{order.order_number}</span> will be booked with Delhivery using these package details.
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
            {busy ? "Booking…" : "Confirm Shipment"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function DelhiveryShipmentManager({ order }) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);
  const [tracking, setTracking] = useState(null);

  const handleTrackNow = async () => {
    setBusy("track");
    setError(null);
    const result = await postJson({ action: "track_shipment", payload: { orderId: order.id } });
    setBusy(null);
    if (!result.success) return setError(result.error || "Tracking lookup failed.");
    setTracking(result.tracking);
    router.refresh();
  };

  const scans = tracking?.ShipmentData?.[0]?.Shipment?.Scans || [];
  const liveStatus = tracking?.ShipmentData?.[0]?.Shipment?.Status?.Status;

  if (order.tracking_number) {
    return (
      <div className="mt-5 border-t border-ink/10 pt-5 space-y-3">
        <div className="flex items-center gap-2">
          <PackageCheck className="h-4 w-4 text-gold-600" />
          <h3 className="text-sm font-bold uppercase tracking-wide text-ink/45">Shipment</h3>
        </div>
        <div className="text-sm text-ink/70 font-semibold">
          <span className="text-ink/45">Courier:</span> {order.courier_name || "Delhivery"}
        </div>
        <div className="text-sm font-semibold">
          <span className="text-ink/45">Waybill:</span>{" "}
          <span className="font-mono text-ink select-all">{order.tracking_number}</span>
        </div>
        {order.shipment_status && (
          <div className="text-sm text-ink/70 font-semibold">
            <span className="text-ink/45">Last Status:</span> {order.shipment_status}
          </div>
        )}

        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href={order.tracking_url || `https://www.delhivery.com/track/package/${order.tracking_number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gold-400/20 bg-gold-400/5 px-3 py-2 text-center text-xs font-bold text-gold-700 hover:border-gold-400/40 hover:bg-gold-400/10"
          >
            <ExternalLink className="h-3.5 w-3.5 shrink-0" /> Track
          </a>
          <button
            type="button"
            onClick={handleTrackNow}
            disabled={busy === "track"}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gold-400/20 bg-gold-400/5 px-3 py-2 text-center text-xs font-bold text-gold-700 hover:border-gold-400/40 hover:bg-gold-400/10 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 shrink-0 ${busy === "track" ? "animate-spin" : ""}`} /> {busy === "track" ? "Checking…" : "Refresh"}
          </button>
        </div>

        {scans.length > 0 && (
          <div className="mt-3 space-y-3 rounded-xl border border-ink/10 bg-ivory-deep p-3 text-xs">
            {liveStatus && (
              <p className="flex items-center justify-between border-b border-ink/10 pb-2 font-bold capitalize text-gold-700">
                <span>Current Status</span>
                <span>{liveStatus}</span>
              </p>
            )}
            <div className="space-y-2.5">
              {scans.map((scan, i) => {
                const sd = scan.ScanDetail || {};
                return (
                  <div key={i} className="text-ink/60 font-semibold">
                    <p className="text-ink/80">
                      {sd.Scan}
                      {sd.ScannedLocation && <span className="text-ink/50"> — {sd.ScannedLocation}</span>}
                    </p>
                    {sd.StatusDateTime && (
                      <p className="mt-0.5 text-[11px] text-ink/35">
                        {new Date(sd.StatusDateTime).toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-5 border-t border-ink/10 pt-5">
      <div className="mb-3 flex items-center gap-2">
        <Truck className="h-4 w-4 text-gold-600" />
        <h3 className="text-sm font-bold uppercase tracking-wide text-ink/45">Shipment</h3>
      </div>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="btn-gold w-full px-4 py-2.5 text-xs font-bold uppercase tracking-wide"
      >
        Ship via Delhivery
      </button>

      {modalOpen && (
        <CreateShipmentModal
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
