import Image from "next/image";
import Link from "next/link";
import { Sparkles, Star } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function FeaturedSpotlight({
  product,
  eyebrow = "Signature Piece",
  customTitle,
  customDesc,
  customPrice,
  customImage,
  customLink,
  className = "",
}) {
  const title = customTitle || product?.name;
  const description = customDesc || product?.shortDescription;
  const price = customPrice ? Number(customPrice) : product?.price;
  const image = customImage || product?.image;
  const href = customLink || (product?.slug ? `/shop/${product.slug}` : "/shop");
  const ctaLabel = product?.productType === "outfit" ? "Get It Stitched" : "See Details";

  if (!title) return null;

  return (
    <Reveal className={`relative overflow-hidden rounded-[2.5rem] border border-gold-400/20 bg-gradient-to-br from-white via-gold-50/5 to-white p-6 sm:p-8 shadow-soft hover:shadow-gold/10 hover:border-gold-400/35 transition-all duration-500 group ${className}`}>
      {/* Subtle gold gradient line at the top */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gold-gradient" />
      <div className="absolute right-0 top-0 h-64 w-64 -mr-16 -mt-16 bg-gold-400/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6 h-full justify-between">
        
        {/* Grid content - balanced 6/6 columns for larger image */}
        <div className="grid grid-cols-12 items-center gap-4 md:gap-6">
          
          {/* Left: Details Column */}
          <div className="col-span-6 flex flex-col justify-center">
            {/* Badge */}
            <span className="mb-2.5 inline-flex w-fit items-center gap-1.5 rounded-full border border-gold-400/20 bg-gold-50 px-2.5 py-1 text-[8px] sm:text-[9px] font-bold tracking-[0.15em] text-gold-700 uppercase">
              <Sparkles className="h-3 w-3 text-gold-600 animate-pulse" /> {eyebrow}
            </span>
            
            <h2 className="font-display text-2xl sm:text-4xl md:text-4xl font-extrabold tracking-tight leading-snug text-ink">
              {title}
            </h2>

            {product?.rating > 0 && !customTitle && (
              <div className="mt-2 flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < Math.round(product.rating) ? "fill-gold-500 text-gold-500" : "fill-none text-ink/20"}`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-ink/50">
                  ({product.rating.toFixed(1)})
                </span>
              </div>
            )}

            {description && (
              <p className="mt-3.5 text-sm sm:text-base md:text-lg leading-relaxed text-ink/65 font-medium pr-1 line-clamp-3">
                {description}
              </p>
            )}

            {price != null && (
              <div className="mt-3.5 flex items-baseline gap-1.5">
                <span className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-gold-700 tracking-tight">
                  ₹{price.toLocaleString("en-IN")}
                </span>
                {product?.oldPrice && product.oldPrice > price && (
                  <span className="text-sm font-semibold text-ink/40 line-through">
                    ₹{product.oldPrice.toLocaleString("en-IN")}
                  </span>
                )}
                {product?.productType === "fabric" && (
                  <span className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">/ m</span>
                )}
              </div>
            )}
          </div>

          {/* Right: Image Column (Larger 6-column Sizing) */}
          <div className="col-span-6 relative aspect-[3/4] md:aspect-[4/5] w-full overflow-hidden rounded-2xl shrink-0">
            {image && (
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 640px) 180px, 450px"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                priority
              />
            )}
            
            {product?.badge && (
              <span className="absolute left-4 top-4 z-20 rounded-full bg-gold-gradient px-3 py-1 text-[8px] font-bold uppercase tracking-widest text-ink shadow-gold">
                {product.badge}
              </span>
            )}
          </div>

        </div>

        {/* Bottom Button Row */}
        <div className="mt-2">
          <Link
            href={href}
            className="inline-flex w-fit items-center justify-center rounded-xl bg-gold-gradient px-8 py-3.5 text-center text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-ink shadow-xl hover:bg-ink hover:text-white active:scale-[0.99] transition-all duration-300"
          >
            {ctaLabel}
          </Link>
        </div>

      </div>
    </Reveal>
  );
}
