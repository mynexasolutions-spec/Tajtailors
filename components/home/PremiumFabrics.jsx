import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import Reveal from "@/components/Reveal";

const FALLBACK_FABRICS = [
  { name: "Wash & Wear", price: 599, image: "/wash-wear.webp" },
  { name: "Egyptian Cotton", price: 699, image: "/egyptian-cotton.webp" },
  { name: "Linen", price: 649, image: "/linen.webp" },
  { name: "Boski", price: 599, image: "/boski.webp" },
  { name: "Cotton", price: 549, image: "/cotton.webp" },
  { name: "Khaadi", price: 699, image: "/khaadi.webp" },
];

function FabricSwatch({ fabric }) {
  const href = fabric.slug ? `/shop/${fabric.slug}` : "/shop?category=5decb952-79e2-4eb3-8176-040ab2c6f6ad";
  return (
    <Link href={href} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-400/40 hover:shadow-gold">
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={fabric.image}
          alt={fabric.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 backdrop-blur-0 transition-all duration-300 group-hover:bg-ink/25 group-hover:opacity-100 group-hover:backdrop-blur-[1px]">
          <span className="flex translate-y-2 items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-ink opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Eye className="h-3.5 w-3.5" /> Quick View
          </span>
        </div>
      </div>
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <p className="text-base font-medium text-ink sm:text-lg">{fabric.name}</p>
        <p className="mt-1 text-sm text-gold-600 sm:text-base">From ₹{fabric.price} / Meter</p>
      </div>
    </Link>
  );
}

export default function PremiumFabrics({ fabrics = [], eyebrow = "Handpicked Materials", heading = "Our Premium Fabrics" }) {
  const items = fabrics.length > 0 ? fabrics : FALLBACK_FABRICS;
  return (
    <section className="relative bg-ivory py-16 sm:py-24">
      <div className="mx-auto max-w-wrap px-4 sm:px-6 md:px-12">
        <Reveal className="mb-10 flex flex-col items-start justify-between gap-4 sm:mb-14 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow text-xs sm:text-sm">
              <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-400" />
              <span className="gold-line" /> {eyebrow}
            </p>
            <h2 className="section-heading mt-3 text-4xl sm:text-5xl md:text-6xl">{heading}</h2>
          </div>
          <Link
            href="/shop?category=5decb952-79e2-4eb3-8176-040ab2c6f6ad"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-gold-400/25 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-widest text-gold-600 backdrop-blur-sm transition-all duration-300 hover:border-gold-500/50 hover:bg-gold-400/10 hover:text-gold-700"
          >
            View All Fabrics
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-6 items-stretch">
          {items.map((fabric, i) => (
            <Reveal key={fabric.id || fabric.name} delay={i * 60} className="h-full">
              <FabricSwatch fabric={fabric} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
