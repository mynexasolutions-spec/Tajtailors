import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Reveal from "@/components/Reveal";

const WAYS_BASE = [
  {
    number: 1,
    image: "/stitchmyfabric.png",
    ratio: 1024 / 1536,
    title: "Stitch My Fabric",
    desc: "Send us your fabric, share your measurements, and we'll stitch it to perfection and deliver it home.",
    button: "Order Now",
    href: "/shop?type=outfit",
  },
  {
    number: 2,
    image: "/buyfabric.png",
    ratio: 1024 / 1536,
    title: "Buy Fabric & Stitch",
    desc: "Choose from our premium fabrics, share your measurements, and we'll stitch and deliver it to you.",
    button: "Choose Fabric",
    href: "/shop?type=fabric",
  },
  {
    number: 3,
    image: "/black-kurta.png",
    ratio: 1024 / 1536,
    width: "w-[40%] sm:w-[38%]",
    title: "Ready-Made Kurtas",
    desc: "Order ready-made kurtas in your size and get them delivered right to your doorstep.",
    button: "Shop Now",
    href: "/shop?type=kurta",
  },
];

export default function ThreeWays({ heading, cards }) {
  const WAYS = WAYS_BASE.map((base, i) => ({
    ...base,
    title: cards?.[i]?.title || base.title,
    desc: cards?.[i]?.desc || base.desc,
    button: cards?.[i]?.button || base.button,
  }));

  return (
    <section className="relative z-10 overflow-hidden bg-white pt-[7vh]">

      <Reveal className="relative mx-auto max-w-wrap px-4 pb-16 pt-6 sm:px-6 sm:pb-24 sm:pt-10 md:px-12">
        <div className="mb-10 flex flex-col items-center text-center sm:mb-16">
          <span className="eyebrow mb-3 text-xs sm:mb-4 sm:text-sm">How It Works</span>
          <div className="flex items-center justify-center gap-2.5">
            <span className="h-px w-6 bg-gradient-to-r from-transparent to-gold-500/70 sm:w-10" />
            <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-500" />
            <h2 className="section-heading !text-4xl font-bold sm:!text-5xl md:!text-6xl">
              {heading || "3 Easy Ways, Just For You"}
            </h2>
            <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-500" />
            <span className="h-px w-6 bg-gradient-to-l from-transparent to-gold-500/70 sm:w-10" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-14 sm:grid-cols-3 sm:gap-6">
          {WAYS.map((way, i) => (
            <Reveal key={way.title} delay={i * 130} className="relative">
              <div className="group relative flex h-full items-center overflow-hidden rounded-2xl border border-gold-400/15 bg-white shadow-soft transition-all duration-500 hover:-translate-y-2.5 hover:scale-[1.015] hover:border-gold-500/50 hover:shadow-lg">
                {/* Top accent line, always visible, glows on hover */}
                <span className="absolute inset-x-0 top-0 z-10 h-[3px] bg-gold-gradient opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative min-w-0 flex-1 p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-gradient text-sm font-bold text-ink shadow-gold ring-4 ring-gold-100/60 transition-transform duration-300 group-hover:scale-110">
                      {way.number}
                    </span>
                    <h3 className="font-display text-base font-bold uppercase tracking-wide text-ink sm:text-lg">{way.title}</h3>
                  </div>
                  <p className="mt-3 text-base font-semibold leading-relaxed text-ink/75">{way.desc}</p>
                  <Link
                    href={way.href}
                    className="group/btn mt-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-ink px-5 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-gold-600 hover:shadow-gold hover:-translate-y-0.5"
                  >
                    {way.button}
                    <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                  </Link>
                </div>

                <div
                  className={`relative overflow-hidden ${way.width || "w-[36%] sm:w-[34%]"} shrink-0 transition-transform duration-500 group-hover:-translate-y-1`}
                  style={{ aspectRatio: way.ratio }}
                >
                  <Image
                    src={way.image}
                    alt={way.title}
                    fill
                    sizes="(max-width: 640px) 40vw, 16vw"
                    className="object-contain grayscale-[30%] transition-all duration-700 ease-out group-hover:scale-110 group-hover:grayscale-0"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent" />
                </div>
              </div>

              {/* Step connector, desktop only */}
              {i < WAYS.length - 1 && (
                <span className="pointer-events-none absolute right-0 top-1/2 z-20 hidden h-8 w-8 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-gold-400/20 bg-white text-gold-500 shadow-soft sm:flex">
                  <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </Reveal>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
