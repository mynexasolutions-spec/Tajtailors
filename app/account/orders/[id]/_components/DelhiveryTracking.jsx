"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, ExternalLink } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function DelhiveryTracking({ orderId, trackingNumber, trackingUrl, courierName, cachedStatus }) {
  const router = useRouter();
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/delhivery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "track_shipment", payload: { orderId } }),
        });
        const data = await res.json();
        if (!cancelled && data.success) {
          setTracking(data.tracking);
          // The lookup above can flip order_status to "cancelled" server-side
          // (e.g. Delhivery cancelled/RTO'd the shipment) — refresh so the
          // order status badge elsewhere on this page picks that up too.
          router.refresh();
        }
      } catch {
        // Best-effort — the cached status below still shows.
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const scans = tracking?.ShipmentData?.[0]?.Shipment?.Scans || [];
  const liveStatus = tracking?.ShipmentData?.[0]?.Shipment?.Status?.Status;

  return (
    <Reveal delay={40} className="relative rounded-[2rem] border border-gold-400/15 bg-white p-6 sm:p-8 hover:border-gold-400/25 hover:shadow-soft transition-all duration-300 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gold-gradient" />
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold-400/20 bg-gold-400/5 text-gold-600 shadow-[0_0_15px_rgba(212,163,89,0.05)]">
          <Truck className="h-5 w-5" />
        </div>
        <h2 className="font-display text-xl sm:text-2xl text-ink font-bold">Shipment Tracking</h2>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-base mb-4 relative z-10">
        <span className="text-ink/60 font-semibold">Courier:</span>
        <span className="text-ink font-bold">{courierName || "Delhivery"}</span>
        <span className="text-ink/20">|</span>
        <span className="text-ink/60 font-semibold">Tracking No:</span>
        <span className="text-ink font-mono select-all">{trackingNumber}</span>
      </div>

      <a
        href={trackingUrl || `https://www.delhivery.com/track/package/${trackingNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 mb-4 inline-flex items-center gap-1.5 rounded-full border border-gold-400/20 bg-gold-400/5 px-4 py-2 text-xs font-bold uppercase tracking-wide text-gold-700 transition-all duration-300 hover:border-gold-400/40 hover:bg-gold-400/10"
      >
        <ExternalLink className="h-3.5 w-3.5" /> Track on Delhivery
      </a>

      {loading ? (
        <p className="relative z-10 border-t border-ink/10 pt-4 text-sm text-ink/60 font-semibold">Fetching latest status…</p>
      ) : scans.length > 0 ? (
        <div className="relative z-10 space-y-2 border-t border-ink/10 pt-4">
          {scans.map((scan, i) => {
            const sd = scan.ScanDetail || {};
            return (
              <div key={i} className="flex flex-wrap justify-between gap-2 text-sm text-ink/65 font-semibold">
                <span>{sd.Scan} {sd.ScannedLocation ? `at ${sd.ScannedLocation}` : ""}</span>
                <span className="text-ink/45">{sd.StatusDateTime ? new Date(sd.StatusDateTime).toLocaleString("en-IN") : ""}</span>
              </div>
            );
          })}
          {liveStatus && (
            <p className="pt-2 font-display text-lg font-bold capitalize text-gold-700">{liveStatus}</p>
          )}
        </div>
      ) : (
        cachedStatus && (
          <p className="relative z-10 border-t border-ink/10 pt-4 text-base text-ink/65 font-semibold">
            Last known status: <span className="text-ink font-bold">{cachedStatus}</span>
          </p>
        )
      )}
    </Reveal>
  );
}
