import { MousePointerClick, Ruler, Truck, Scissors, Home as HomeIcon, ChevronRight } from "lucide-react";
import Reveal from "@/components/Reveal";

const STEPS_BASE = [
  { number: "01", icon: MousePointerClick, title: "Place Your Order", desc: "Choose your preferred option and place your order." },
  { number: "02", icon: Ruler, title: "Share Measurements", desc: "Share your measurements using our guide, or send them to us." },
  { number: "03", icon: Truck, title: "Courier Pickup", desc: "Our courier picks up your fabric right from your home." },
  { number: "04", icon: Scissors, title: "Stitching & Quality Check", desc: "We stitch it to perfection and run a full quality check." },
  { number: "05", icon: HomeIcon, title: "Delivery at Your Doorstep", desc: "It's delivered straight to your doorstep by courier." },
];

export default function HowItWorks({ heading = "How It Works", steps }) {
  const STEPS = STEPS_BASE.map((base, i) => ({
    ...base,
    title: steps?.[i]?.title || base.title,
    desc: steps?.[i]?.desc || base.desc,
  }));

  const headingWords = heading.trim().split(/\s+/);
  const headingLast = headingWords.pop();
  const headingLead = headingWords.join(" ");

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60">
        <div className="absolute left-1/4 top-0 h-[400px] w-[450px] rounded-full bg-gold-500/10 blur-[130px]" />
        <div className="absolute right-1/4 bottom-0 h-[400px] w-[450px] rounded-full bg-gold-300/10 blur-[130px]" />
        <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/5 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-wrap px-4 sm:px-6 md:px-12">
        <Reveal className="mx-auto mb-14 flex flex-col items-center text-center sm:mb-20">
          <span className="eyebrow mb-3 text-xs sm:mb-4 sm:text-sm">Simple Process</span>
          <div className="flex items-center justify-center gap-2.5">
            <span className="h-px w-6 bg-gradient-to-r from-transparent to-gold-400/70 sm:w-10" />
            <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-400" />
            <h2 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl md:text-6xl">
              {headingLead ? `${headingLead} ` : ""}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-gold-600 to-gold-700">
                {headingLast}
              </span>
            </h2>
            <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-400" />
            <span className="h-px w-6 bg-gradient-to-l from-transparent to-gold-400/70 sm:w-10" />
          </div>
        </Reveal>

        <div className="relative">
          <div className="grid grid-cols-1 gap-y-14 sm:grid-cols-2 lg:grid-cols-5 lg:gap-x-4">
            {STEPS.map((step, i) => (
              <Reveal key={step.number} delay={i * 100} className="group relative flex flex-col items-center rounded-3xl px-4 py-6 text-center transition-all duration-500 hover:-translate-y-2 hover:bg-white/60 hover:shadow-[0_25px_60px_-30px_rgba(202,161,75,0.4)]">
                <div className="relative flex h-28 w-28 items-center justify-center">
                  {/* Soft pulse behind the icon */}
                  <div className="absolute inset-0 rounded-full bg-gold-400/15 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100 animate-pulse" />
                  {/* Rotating gold ring on hover */}
                  <div
                    className="absolute -inset-2 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 animate-spin"
                    style={{
                      animationDuration: "5s",
                      background: "conic-gradient(from 0deg, transparent 0%, rgba(212,163,89,0.7) 20%, transparent 40%)",
                    }}
                  />
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-gold-400/25 bg-white text-gold-600 shadow-[0_10px_30px_-15px_rgba(202,161,75,0.4)] backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:border-gold-400/50 group-hover:text-gold-700 group-hover:shadow-gold">
                    <step.icon className="h-10 w-10" strokeWidth={1.5} />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-gold-gradient text-xs font-bold text-ink shadow-gold ring-4 ring-ivory-deep transition-transform duration-300 group-hover:scale-110">
                    {step.number}
                  </span>
                </div>

                <h3 className="relative mt-6 font-display text-xl font-medium text-ink transition-colors duration-300 group-hover:text-gold-700 sm:text-2xl">{step.title}</h3>
                <p className="relative mt-2.5 max-w-[16rem] text-base leading-relaxed text-ink/55">{step.desc}</p>

                {i < STEPS.length - 1 && (
                  <div className="pointer-events-none absolute left-full top-20 hidden w-8 -translate-x-3 -translate-y-1/2 items-center lg:flex">
                    <span className="h-0 flex-1 border-t border-dashed border-gold-400/40" />
                    <ChevronRight className="-ml-1 h-4 w-4 shrink-0 text-gold-400/50" />
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
