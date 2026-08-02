"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShoppingBag, Star } from "lucide-react";
import SherwaniGlyph from "./SherwaniGlyph";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!product.variantId) return;
    addToCart({
      variantId: product.variantId,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      variantName: product.variantName,
      price: product.price,
      image: product.image,
    });
    showToast(`${product.name} added to your bag.`);
  };

  const rating = product.rating || 0;
  const reviewCount = product.reviewCount || 0;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-ink/10 bg-white shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-gold-400/50 hover:shadow-gold"
    >
      <div className="relative aspect-[3/4] shrink-0 overflow-hidden bg-ivory-deep">

        {/* Soft background light behind product */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(202,161,75,0.05),transparent_70%)] pointer-events-none" />

        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-b from-white to-ivory-deep">
            <SherwaniGlyph className="h-16 w-auto opacity-40 text-gold-500/60" />
          </div>
        )}

        {/* Bottom scrim so the hover CTA + "View Details" always stay legible over any image */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {product.badge && (
          <span className="absolute left-3.5 top-3.5 rounded-full bg-gold-gradient px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-ink shadow-gold">
            {product.badge}
          </span>
        )}

        <span className="pointer-events-none absolute bottom-3.5 left-3.5 hidden items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white opacity-0 transition-all duration-500 group-hover:opacity-100 sm:flex">
          View Details
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>

        {product.variantId && product.productType !== "outfit" && (
          <button
            onClick={handleQuickAdd}
            aria-label={`Add ${product.name} to bag`}
            className="absolute bottom-3.5 right-3.5 flex h-10 w-10 items-center justify-center rounded-full bg-gold-gradient text-ink opacity-100 shadow-gold transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 hover:scale-110"
          >
            <ShoppingBag className="h-4.5 w-4.5 text-ink" />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-5">
        <p className="text-[9px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gold-500 font-semibold">
          {product.productType === "fabric" ? "Fabric" : product.productType === "outfit" ? "Outfit" : "Kurta"}
          {(product.fabricType || product.color) && (
            <span className="hidden sm:inline text-ink/35 font-medium normal-case tracking-normal"> · {product.fabricType || product.color}</span>
          )}
        </p>

        <h3 className="mt-1.5 sm:mt-2 font-display text-sm sm:text-lg text-ink font-semibold transition-colors group-hover:text-gold-700 line-clamp-2">
          {product.name}
        </h3>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-1 pt-2.5 sm:pt-3.5">
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className="font-bold text-ink text-sm sm:text-lg">
              {product.price != null ? `₹${product.price.toLocaleString("en-IN")}` : "—"}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-[10px] sm:text-sm text-ink/40 line-through">
                ₹{product.oldPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <span
            className={`flex shrink-0 items-center gap-1 text-[11px] sm:text-sm font-semibold ${rating > 0 ? "text-ink" : "text-ink/35"}`}
          >
            <Star className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${rating > 0 ? "fill-gold-500 text-gold-500" : "text-ink/25"}`} />
            {rating.toFixed(1)}
            {reviewCount > 0 && <span className="hidden font-normal text-ink/35 sm:inline">({reviewCount})</span>}
          </span>
        </div>

        {!product.inStock && (
          <p className="mt-2.5 text-[10px] uppercase tracking-wider text-red-400 font-semibold">Out of stock</p>
        )}
      </div>
    </Link>
  );
}
