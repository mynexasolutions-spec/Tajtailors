import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function FeaturedSpotlight({ product, eyebrow = "Signature Piece" }) {
  if (!product) return null;

  const href = product.slug ? `/shop/${product.slug}` : "/shop";
  const ctaLabel = product.productType === "outfit" ? "Get It Stitched" : "Shop This Piece";

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24">

      <div className="relative mx-auto max-w-wrap px-4 sm:px-6 md:px-12">
        <Reveal className="relative grid grid-cols-1 items-center gap-10 rounded-[3rem] border border-gold-400/25 bg-white p-8 shadow-xl hover:shadow-2xl hover:border-gold-500/40 transition-all duration-500 sm:p-12 md:grid-cols-2 md:gap-16 md:p-16 overflow-hidden">
          {/* Top accent ribbon and subtle inner light */}
          <div className="absolute inset-x-0 top-0 h-[4px] bg-gold-gradient" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(202,161,75,0.03),transparent_55%)] pointer-events-none" />

          {/* Image */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.2rem] border border-gold-400/15 bg-white shadow-soft group/img">
            {/* Double framing border inside image */}
            <div className="absolute inset-3 rounded-[1.8rem] border border-gold-400/10 pointer-events-none z-10" />

            {product.image && (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 90vw, 40vw"
                className="object-cover transition-transform duration-750 ease-out group-hover/img:scale-105"
              />
            )}
            {product.badge && (
              <span className="absolute left-6 top-6 z-20 rounded-full bg-gold-gradient px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-ink shadow-gold">
                {product.badge}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="relative z-10">
            <span className="eyebrow mb-4 text-xs font-bold tracking-[0.25em] text-gold-700 uppercase flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-gold-600 animate-pulse" /> {eyebrow}
            </span>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-ink tracking-tight leading-tight">
              {product.name}
            </h2>

            {product.rating > 0 && (
              <div className="mt-4 flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-gold-500 text-gold-500" : "fill-none text-ink/20"}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-ink/60">
                  {product.rating.toFixed(1)} {product.reviewCount > 0 && `(${product.reviewCount} reviews)`}
                </span>
              </div>
            )}

            {product.shortDescription && (
              <p className="mt-6 text-base sm:text-lg leading-relaxed text-ink/75 font-semibold">
                {product.shortDescription}
              </p>
            )}

            {product.price != null && (
              <p className="mt-6 font-display text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700 tracking-tight">
                ₹{product.price.toLocaleString("en-IN")}
              </p>
            )}

            <Link
              href={href}
              className="btn-gold group mt-8 inline-flex w-fit items-center gap-2.5 px-10 py-4.5 text-xs font-bold uppercase tracking-[0.2em] shadow-gold hover:scale-[1.02] transition-all duration-300"
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
