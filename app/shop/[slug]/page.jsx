import { cache, Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ChevronDown, Sparkles, Layers, Palette } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import StarRating from "@/components/StarRating";
import ProductGallery from "./_components/ProductGallery";
import ProductPurchasePanel from "./_components/ProductPurchasePanel";
import { ProductVariantProvider } from "./_components/ProductVariantContext";
import ReviewForm from "./_components/ReviewForm";
import ReviewsList from "./_components/ReviewsList";
import { getProductBySlug, getRelatedProducts, getCompatibleOutfits, getCompatibleFabrics } from "@/actions/products";
import Reveal from "@/components/Reveal";

// Dedupes the fetch: generateMetadata and the page component both need this
// product, and without caching each would trigger its own DB round trip.
const getCachedProduct = cache(getProductBySlug);

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getCachedProduct(slug);
  if (!product) return {};
  return {
    title: `${product.seo_title || product.name} - Taj Tailor`,
    description: product.seo_description || product.short_description || undefined,
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getCachedProduct(slug);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product.category_id, product.id);
  const compatibleOutfits = product.product_type === "fabric" ? await getCompatibleOutfits(product.id) : [];
  const compatibleFabrics = product.product_type === "outfit" ? await getCompatibleFabrics(product.id) : [];

  // Fabric/kurta attributes shown as detail cards
  const notes = [
    { label: "Fabric Type", value: product.fabric_type, icon: Layers, desc: "The material this product is made from" },
    { label: "Color", value: product.color, icon: Palette, desc: "The color of this item" },
  ].filter((n) => n.value);

  // Serialize properties to strip non-serializable fields/prototypes for React 19 compatibility
  const safeProduct = JSON.parse(JSON.stringify(product));
  const safeRelatedProducts = JSON.parse(JSON.stringify(relatedProducts));
  const safeCompatibleOutfits = JSON.parse(JSON.stringify(compatibleOutfits));
  const safeCompatibleFabrics = JSON.parse(JSON.stringify(compatibleFabrics));

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-ivory text-ink overflow-hidden pb-16 sm:pb-24 pt-6 sm:pt-10">

        {/* Ambient background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gold-500/10 blur-[120px] animate-pulse" />
          <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gold-400/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[5%] left-[25%] w-[500px] h-[500px] rounded-full bg-gold-600/10 blur-[130px]" />
        </div>

        <div className="mx-auto max-w-wrap px-6 md:px-12 relative z-10">

          {/* Breadcrumbs */}
          <div className="mb-6 sm:mb-10 flex flex-wrap items-center gap-2 text-sm text-ink/45">
            <Link href="/" className="hover:text-gold-600 transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/shop" className="hover:text-gold-600 transition-colors">Shop</Link>
            {product.categoryName && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <Link href={`/shop?category=${product.category_id}`} className="hover:text-gold-600 transition-colors">
                  {product.categoryName}
                </Link>
              </>
            )}
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-ink/60 font-medium">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <ProductVariantProvider variants={safeProduct.variants}>

            {/* Gallery Panel — sticks in place while purchase details scroll on desktop */}
            <Reveal className="lg:sticky lg:top-[104px] lg:self-start">
              <ProductGallery images={safeProduct.images} name={safeProduct.name} />
            </Reveal>

            {/* Purchase Options */}
            <Reveal delay={100} className="flex flex-col">
              {product.product_type && (
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-400/25 bg-white text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-700 shadow-soft mb-4 w-fit">
                  <Sparkles className="w-3.5 h-3.5 text-gold-600 animate-pulse" />
                  {product.product_type === "fabric" ? "Fabric" : product.product_type === "outfit" ? "Outfit — Custom Stitching" : "Ready-Made Kurta"}
                </span>
              )}

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-ink leading-[1.08]">
                {product.name}
              </h1>
              <div className="mt-5 h-px w-16 bg-gradient-to-r from-gold-400/60 to-transparent" />

              <div className="mt-4 flex items-center gap-2.5">
                <StarRating rating={product.review_count > 0 ? product.average_rating : 0} showValue />
                <span className="text-sm text-ink/45 font-medium">
                  {product.review_count > 0
                    ? `(${product.review_count} Customer review${product.review_count === 1 ? "" : "s"})`
                    : "No reviews yet"}
                </span>
              </div>

              {product.short_description && (
                <p className="mt-6 text-base sm:text-lg leading-relaxed text-ink/65 font-light">{product.short_description}</p>
              )}

              <div className="mt-8 border-t border-ink/10 pt-8">
                <Suspense fallback={null}>
                  <ProductPurchasePanel
                    product={safeProduct}
                    variants={safeProduct.variants}
                    compatibleOutfits={safeCompatibleOutfits}
                    compatibleFabrics={safeCompatibleFabrics}
                  />
                </Suspense>
              </div>

              {/* Product Details Cards (fabric type, color, etc.) */}
              {notes.length > 0 && (
                <div className="mt-10 sm:mt-12 border-t border-ink/10 pt-6 sm:pt-8">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600 block mb-5">
                    Product Details
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {notes.map((n, i) => {
                      const NoteIcon = n.icon;
                      return (
                        <div
                          key={n.label}
                          className="group relative rounded-2xl border border-ink/10 bg-white p-5 sm:p-6 hover:border-gold-400/40 hover:bg-ivory-deep transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(212,163,89,0.1)] overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gold-gradient opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none" />
                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/5 text-gold-600 shadow-[0_0_15px_rgba(212,163,89,0.08)] transition-all duration-300 group-hover:scale-110 group-hover:border-gold-400/50 group-hover:text-gold-700 group-hover:shadow-[0_0_20px_rgba(212,163,89,0.15)]">
                              <NoteIcon className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <p className="text-sm font-semibold uppercase tracking-widest text-gold-700">
                              {n.label}
                            </p>
                          </div>
                          <p className="text-lg sm:text-xl text-ink font-medium leading-snug">
                            {n.value}
                          </p>
                          <p className="text-sm text-ink/50 font-light mt-2 leading-relaxed">
                            {n.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Reveal>
          </ProductVariantProvider>
          </div>

          {/* Product Description Section (Full Width) */}
          {product.description && (
            <Reveal className="mt-14 sm:mt-24 border-t border-ink/10 pt-10 sm:pt-16 max-w-4xl">
              <p className="eyebrow">
                <span className="gold-line" /> The Story
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-light text-ink mt-4 mb-6">Product Details</h2>
              <p className="whitespace-pre-wrap text-base sm:text-lg leading-relaxed text-ink/65 font-light">
                {product.description}
              </p>
            </Reveal>
          )}

          {/* Symmetrical Grid: FAQs on left, Reviews on right */}
          <div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 border-t border-ink/10 pt-10 sm:pt-16">

            {/* Left Column: FAQs */}
            <Reveal>
              {product.faqs && product.faqs.length > 0 ? (
                <div>
                  <p className="eyebrow">
                    <span className="gold-line" /> Need to Know
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl font-light text-ink mt-4 mb-6">Common Questions</h2>
                  <div className="space-y-4">
                    {product.faqs.map((faq) => (
                      <details key={faq.id} className="group overflow-hidden rounded-2xl border border-ink/10 bg-white hover:border-gold-400/30 hover:shadow-[0_0_25px_rgba(212,163,89,0.08)] transition-all duration-300">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-base sm:text-lg font-medium text-ink hover:bg-ivory-deep">
                          {faq.question}
                          <ChevronDown className="h-4.5 w-4.5 shrink-0 text-gold-600 transition-transform group-open:rotate-180" />
                        </summary>
                        <p className="px-5 pb-5 text-sm sm:text-base leading-relaxed text-ink/60 font-light border-t border-ink/10 pt-4 animate-fadeUp">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full rounded-[2rem] border border-dashed border-ink/15 p-8 text-center text-ink/45 py-16 bg-ivory-deep">
                  <p className="text-base">No FAQs available for this item.</p>
                </div>
              )}
            </Reveal>

            {/* Right Column: Reviews */}
            <Reveal delay={100} className="space-y-6">
              <p className="eyebrow">
                <span className="gold-line" /> Customer Love
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-light text-ink mt-4 mb-6">Ratings &amp; Reviews</h2>
              <ReviewForm productId={product.id} existingReview={safeProduct.myReview} />

              <ReviewsList reviews={safeProduct.reviews} hasOwnReview={!!safeProduct.myReview} />
            </Reveal>

          </div>

          {/* Related Products */}
          {safeRelatedProducts.length > 0 && (
            <Reveal className="mt-14 sm:mt-24 border-t border-ink/10 pt-10 sm:pt-16">
              <p className="eyebrow">
                <span className="gold-line" /> Complementary Selections
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-light text-ink mt-4 mb-10">You Might Also Like</h2>
              <ProductGrid products={safeRelatedProducts} />
            </Reveal>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
