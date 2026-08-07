"use client";

import { useEffect, useState } from "react";
import { PackageSearch, ExternalLink } from "lucide-react";
import Reveal from "@/components/Reveal";

const STATUS_LABELS = {
  pending: "We'll book a pickup for your reference garment soon.",
  requested: "Pickup has been booked — a Delhivery agent will collect it.",
  picked_up: "Your reference garment is on its way to our store.",
  received: "Your reference garment has reached our store.",
  failed: "Pickup could not be booked — our team will reach out.",
};
const STATUS_STYLES = {
  pending: "text-ink/70 bg-ink/5 border-ink/10",
  requested: "text-gold-700 bg-gold-400/10 border-gold-400/25",
  picked_up: "text-blue-700 bg-blue-500/10 border-blue-500/20",
  received: "text-green-700 bg-green-500/10 border-green-500/20",
  failed: "text-red-600 bg-red-500/10 border-red-500/20",
};

export default function ReferenceGarmentPickupStatus({ orderId, pickupWaybill, pickupTrackingUrl, pickupStatus }) {
  const [tracking, setTracking] = useState(null);

  useEffect(() => {
    if (!pickupWaybill) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/delhivery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "track_reverse_pickup", payload: { orderId } }),
        });
        const data = await res.json();
        if (!cancelled && data.success) setTracking(data.tracking);
      } catch {
        // Best-effort — the cached status below still shows.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId, pickupWaybill]);

  const liveStatus = tracking?.ShipmentData?.[0]?.Shipment?.Status?.Status;
  const status = pickupStatus || "pending";

  return (
    <Reveal delay={60} className="relative rounded-[2rem] border border-gold-400/15 bg-white p-6 sm:p-8 hover:border-gold-400/25 hover:shadow-soft transition-all duration-300 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gold-gradient" />
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold-400/20 bg-gold-400/5 text-gold-600 shadow-[0_0_15px_rgba(212,163,89,0.05)]">
          <PackageSearch className="h-5 w-5" />
        </div>
        <h2 className="font-display text-xl sm:text-2xl text-ink font-bold">Reference Garment Pickup</h2>
      </div>

      <span className={`relative z-10 inline-flex items-center rounded-full border px-3 py-1 text-sm font-bold ${STATUS_STYLES[status]}`}>
        {liveStatus || STATUS_LABELS[status]}
      </span>

      {pickupWaybill && (
        <div className="relative z-10 mt-4 flex flex-wrap items-center gap-3 text-base">
          <span className="text-ink/60 font-semibold">Tracking No:</span>
          <span className="text-ink font-mono select-all">{pickupWaybill}</span>
          <a
            href={pickupTrackingUrl || `https://www.delhivery.com/track/package/${pickupWaybill}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/20 bg-gold-400/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-gold-700 transition-all duration-300 hover:border-gold-400/40 hover:bg-gold-400/10"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Track
          </a>
        </div>
      )}
    </Reveal>
  );
}
