import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function FeaturedSpotlight({ product, eyebrow = "Signature Piece" }) {
  if (!product) return null;

  const href = product.slug ? `/shop/${product.slug}` : "/shop";

  return (
    <section className="relative overflow-hidden bg-ivory-deep py-16 sm:py-24">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -left-24 top-0 h-[420px] w-[420px] rounded-full bg-gold-400/10 blur-[130px]" />
        <div className="absolute -right-24 bottom-0 h-[420px] w-[420px] rounded-full bg-gold-300/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-wrap px-4 sm:px-6 md:px-12">
        <Reveal className="grid grid-cols-1 items-center gap-10 rounded-[2.5rem] border border-gold-400/20 bg-white p-6 shadow-2xl sm:p-10 md:grid-cols-2 md:gap-16 md:p-14">
          {/* Image */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-gold-400/15 bg-ivory-deep shadow-soft">
            {product.image && (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 90vw, 40vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            )}
            {product.badge && (
              <span className="absolute left-4 top-4 rounded-full bg-gold-gradient px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-ink shadow-gold">
                {product.badge}
              </span>
            )}
          </div>

          {/* Details */}
          <div>
            <span className="eyebrow mb-4">
              <Sparkles className="h-3.5 w-3.5 text-gold-600" /> {eyebrow}
            </span>
            <h2 className="section-heading text-3xl sm:text-4xl md:text-5xl font-bold">
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
                <span className="text-sm font-semibold text-ink/60">
                  {product.rating.toFixed(1)} {product.reviewCount > 0 && `(${product.reviewCount} reviews)`}
                </span>
              </div>
            )}

            {product.shortDescription && (
              <p className="mt-5 text-base sm:text-lg leading-relaxed text-ink/65 font-semibold">
                {product.shortDescription}
              </p>
            )}

            {product.price != null && (
              <p className="mt-6 font-display text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">
                ₹{product.price.toLocaleString("en-IN")}
              </p>
            )}

            <Link
              href={href}
              className="btn-gold group mt-8 inline-flex w-fit items-center gap-2 px-8 py-4 text-sm font-semibold uppercase tracking-widest hover:scale-[1.02] transition-transform"
            >
              Shop This Piece
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
