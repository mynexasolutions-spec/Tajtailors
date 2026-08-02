import { Truck, Award, ShieldCheck, CreditCard, Headphones } from "lucide-react";
import Reveal from "@/components/Reveal";

const POINTS_BASE = [
  { icon: Truck, title: "Free Pickup & Delivery", desc: "All Over India" },
  { icon: Award, title: "Premium Quality", desc: "Fabric & Stitching" },
  { icon: ShieldCheck, title: "Perfect Fitting", desc: "Guaranteed" },
  { icon: CreditCard, title: "Secure Payment", desc: "100% Safe" },
  { icon: Headphones, title: "Customer Support", desc: "24/7 Available" },
];

export default function TrustBar({ points }) {
  const POINTS = POINTS_BASE.map((base, i) => ({
    ...base,
    title: points?.[i]?.title || base.title,
    desc: points?.[i]?.desc || base.desc,
  }));

  return (
    <section
      className="relative overflow-hidden animate-shimmer bg-gold-gradient bg-[length:200%_200%] py-8 shadow-[0_20px_50px_-20px_rgba(18,16,14,0.35)] sm:py-10"
      style={{ animationDuration: "9s" }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-white/40" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-ink/10" />

      <div className="relative mx-auto grid max-w-wrap grid-cols-2 gap-y-7 px-4 sm:grid-cols-3 sm:px-6 md:px-12 lg:grid-cols-5 lg:gap-x-4">
        {POINTS.map((point, i) => (
          <Reveal key={point.title} delay={i * 90}>
            <div
              className={`group flex items-center gap-3 transition-transform duration-300 hover:-translate-y-0.5 sm:gap-3.5 ${
                i > 0 ? "lg:border-l lg:border-ink/15 lg:pl-4" : ""
              }`}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] ring-1 ring-white/30 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30 group-hover:shadow-[0_8px_20px_-8px_rgba(18,16,14,0.35),inset_0_1px_0_rgba(255,255,255,0.6)] sm:h-14 sm:w-14">
                <point.icon
                  className="h-6 w-6 shrink-0 text-ink drop-shadow-[0_1px_2px_rgba(255,255,255,0.4)] sm:h-7 sm:w-7"
                  strokeWidth={1.5}
                />
              </span>
              <div>
                <p className="text-sm font-bold leading-tight text-ink sm:text-base">{point.title}</p>
                <p className="text-xs font-medium leading-tight text-ink/70 sm:text-sm">{point.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
