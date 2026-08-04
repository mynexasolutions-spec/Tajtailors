"use client";

import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import { useWishlist } from "@/context/WishlistContext";
import Reveal from "@/components/Reveal";

export default function WishlistContent() {
  const { wishlist, wishlistCount } = useWishlist();

  return (
    <div className="mx-auto max-w-wrap px-6 md:px-12 relative z-10">
      
      {/* Header */}
      <div className="relative mx-auto max-w-3xl text-center mb-12 sm:mb-16">
        <Reveal>
          <nav className="mb-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-ink/40">
            <Link href="/" className="transition-colors hover:text-gold-600">Home</Link>
            <span>/</span>
            <span className="text-ink">Wishlist</span>
          </nav>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-ink leading-tight">
            My <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">Wishlist</span>
          </h1>
          
          <p className="mt-4 text-base text-ink/60 font-medium">
            {wishlistCount > 0 
              ? `You have saved ${wishlistCount} item${wishlistCount === 1 ? "" : "s"} to your wishlist.`
              : "Keep track of items you love. They'll show up here."
            }
          </p>
        </Reveal>
      </div>

      {/* Grid or Empty State */}
      <div className="mt-8">
        {wishlistCount > 0 ? (
          <Reveal delay={100}>
            <ProductGrid products={wishlist} />
          </Reveal>
        ) : (
          <Reveal delay={100}>
            <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-gold-400/20 bg-white px-6 py-20 text-center shadow-soft max-w-xl mx-auto">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gold-400/10 text-gold-600 ring-8 ring-gold-400/5 mb-6">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="font-display text-2xl text-ink font-semibold">Your wishlist is empty</h3>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-ink/50 font-medium">
                Explore our premium collections of custom outfits, fabric selections, and ready-made kurtas to add them here.
              </p>
              <div className="mt-8">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_4px_20px_rgba(212,163,89,0.15)] hover:shadow-[0_4px_25px_rgba(212,163,89,0.3)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  Explore Collection <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        )}
      </div>

    </div>
  );
}
