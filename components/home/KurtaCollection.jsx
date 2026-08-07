"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Eye } from "lucide-react";
import Reveal from "@/components/Reveal";
import SherwaniGlyph from "@/components/SherwaniGlyph";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";

const SIZES = ["S", "M", "L", "XL", "XXL"];

const FALLBACK_KURTAS = [
  { name: "Black Kurta", price: 1299, image: "/black-kurta.webp" },
  { name: "White Kurta", price: 1299, image: "/white-kurta.webp" },
  { name: "Navy Blue Kurta", price: 1499, image: "/blue-kurta.webp" },
  { name: "Beige Kurta", price: 1499, image: "/beige-kurta.webp" },
  { name: "Maroon Kurta", price: 1499, image: "/wine-kurta.webp" },
  { name: "Grey Kurta", price: 1299, image: "/grey-kurta.webp" },
];

function KurtaCard({ kurta, delay }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const isWishlisted = isInWishlist(kurta.id || kurta.name);
  const href = kurta.slug ? `/shop/${kurta.slug}` : "/shop?category=ecc54fc6-bd3a-4074-8a60-cb21d5d4e577";

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: kurta.id || kurta.name,
      name: kurta.name,
      price: kurta.price,
      image: kurta.image,
      slug: kurta.slug || "shop",
      productType: "kurta",
      inStock: kurta.inStock !== undefined ? kurta.inStock : true,
    });
    showToast(
      isWishlisted
        ? `${kurta.name} removed from wishlist.`
        : `${kurta.name} added to wishlist.`
    );
  };

  return (
    <Reveal delay={delay}>
      <Link
        href={href}
        className={`group flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-400/40 hover:shadow-gold ${kurta.isFeatured ? "border-gold-400/50 shadow-gold" : "border-ink/10"
          }`}
      >
        <div className="relative aspect-square w-full overflow-hidden">
          {kurta.image ? (
            <Image
              src={kurta.image}
              alt={kurta.name}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-contain bg-ivory-deep transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-b from-white to-ivory-deep">
              <SherwaniGlyph className="h-16 w-auto opacity-40 text-gold-500/60" />
            </div>
          )}
          {kurta.badge && (
            <span className="absolute left-3 top-3 z-20 rounded-full bg-gold-gradient px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-ink shadow-gold">
              {kurta.badge}
            </span>
          )}
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-ink/0 opacity-0 transition-all duration-300 group-hover:bg-ink/20 group-hover:opacity-100">
            <span className="flex translate-y-2 items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-ink opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <Eye className="h-3.5 w-3.5" /> Quick View
            </span>
          </div>
          <button
            type="button"
            onClick={handleWishlistToggle}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm transition-all hover:scale-110"
          >
            <Heart className={`h-4 w-4 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-white"}`} />
          </button>
        </div>
        <div className="flex flex-1 flex-col p-3.5 sm:p-4">
          <h3 className="font-display text-base font-medium text-ink sm:text-lg">{kurta.name}</h3>
          <p className="mt-1 text-base font-semibold text-gold-600 sm:text-lg">₹{kurta.price.toLocaleString("en-IN")}</p>
        </div>
      </Link>
    </Reveal>
  );
}

export default function KurtaCollection({ kurtas = [], eyebrow = "Ready When You Are", heading = "Ready-Made Kurta Collection" }) {
  const items = kurtas.length > 0 ? kurtas : FALLBACK_KURTAS;
  return (
    <section className="relative bg-white py-16 sm:py-24">
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
            href="/shop?category=ecc54fc6-bd3a-4074-8a60-cb21d5d4e577"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-gold-400/25 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-widest text-gold-600 backdrop-blur-sm transition-all duration-300 hover:border-gold-500/50 hover:bg-gold-400/10 hover:text-gold-700"
          >
            View All Kurtas
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-5">
          {items.map((kurta, i) => (
            <KurtaCard key={kurta.id || kurta.name} kurta={kurta} delay={i * 60} />
          ))}
        </div>
      </div>
    </section>
  );
}
