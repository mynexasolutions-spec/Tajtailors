import { cache, Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ChevronDown, Sparkles, Layers, Palette, HelpCircle, MessageSquareHeart, Gift } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import StarRating from "@/components/StarRating";
import ProductGallery from "./_components/ProductGallery";
import ProductPurchasePanel from "./_components/ProductPurchasePanel";
import { ProductVariantProvider } from "./_components/ProductVariantContext";
import ReviewForm from "./_components/ReviewForm";
import ReviewsList from "./_components/ReviewsList";
import { getProductBySlug, getRelatedProducts, getCompatibleOutfits, getCompatibleFabrics, getGarmentTypes, getExtraWorkOptions } from "@/actions/products";
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
  const garmentTypes = product.product_type === "fabric" || product.product_type === "outfit" ? await getGarmentTypes() : [];
  const extraWorkOptions = product.product_type === "outfit" ? await getExtraWorkOptions(product.id) : [];

  // Fabric/kurta attributes shown as detail cards
  const notes = [
    { label: "Fabric Type", value: product.fabric_type, icon: Layers, desc: product.fabric_type_description },
    { label: "Color", value: product.color, icon: Palette, desc: product.color_description },
  ].filter((n) => n.value);

  // Serialize properties to strip non-serializable fields/prototypes for React 19 compatibility
  const safeProduct = JSON.parse(JSON.stringify(product));
  const safeRelatedProducts = JSON.parse(JSON.stringify(relatedProducts));
  const safeCompatibleOutfits = JSON.parse(JSON.stringify(compatibleOutfits));
  const safeCompatibleFabrics = JSON.parse(JSON.stringify(compatibleFabrics));
  const safeGarmentTypes = JSON.parse(JSON.stringify(garmentTypes));
  const safeExtraWorkOptions = JSON.parse(JSON.stringify(extraWorkOptions));

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-white text-ink overflow-hidden pb-16 sm:pb-24 pt-6 sm:pt-10">

        <div className="mx-auto max-w-wrap px-6 md:px-12 relative z-10">

          {/* Breadcrumbs */}
          <div className="mb-6 sm:mb-10 flex flex-wrap items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-ink/40 w-fit max-w-full">
            <Link href="/" className="transition-colors hover:text-gold-600">Home</Link>
            <ChevronRight className="h-3 w-3 shrink-0 text-ink/20" />
            <Link href="/shop" className="transition-colors hover:text-gold-600">Shop</Link>
            {product.categoryName && (
              <>
                <ChevronRight className="h-3 w-3 shrink-0 text-ink/20" />
                <Link
                  href={`/shop?category=${product.category_id}`}
                  className="transition-colors hover:text-gold-600"
                >
                  {product.categoryName}
                </Link>
              </>
            )}
            <ChevronRight className="h-3 w-3 shrink-0 text-ink/20" />
            <span className="truncate text-ink">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <ProductVariantProvider variants={safeProduct.variants}>

            {/* Gallery Panel — sticks in place while purchase details scroll on desktop */}
            <Reveal className="lg:sticky lg:top-[104px] lg:self-start">
              <ProductGallery images={safeProduct.images} name={safeProduct.name} />
              {product.short_description && (
                <p className="mt-5 text-base sm:text-lg leading-relaxed text-ink/70 font-semibold">{product.short_description}</p>
              )}

              {/* Product Details */}
              {notes.length > 0 && (
                <div className="mt-6">
                  <div className="relative flex flex-col divide-y divide-ink/10 overflow-hidden rounded-2xl border border-gold-400/15 bg-white shadow-soft sm:flex-row sm:divide-x sm:divide-y-0">
                    {notes.map((n) => {
                      const NoteIcon = n.icon;
                      return (
                        <div key={n.label} className="group relative flex flex-1 items-start gap-4 p-5 sm:p-6 transition-colors duration-300 hover:bg-gold-50/10">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-400/20 bg-white text-gold-600 shadow-[0_0_15px_rgba(212,163,89,0.05)] transition-all duration-300 group-hover:scale-110 group-hover:border-gold-400/50 group-hover:text-gold-700">
                            <NoteIcon className="w-5 h-5" strokeWidth={1.5} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gold-600">
                              {n.label}
                            </p>
                            <p className="mt-1 text-xl sm:text-2xl text-ink font-bold leading-snug">
                              {n.value}
                            </p>
                            {n.desc && (
                              <p className="text-sm sm:text-base text-ink/60 font-semibold mt-1.5 leading-relaxed">
                                {n.desc}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Reveal>

            {/* Purchase Options */}
            <Reveal delay={100} className="flex flex-col">
              <div className="space-y-5">
                {product.product_type && (
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-400/25 bg-white text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-700 shadow-soft w-fit">
                    <Sparkles className="w-3.5 h-3.5 text-gold-600 animate-pulse" />
                    {product.product_type === "fabric" ? "Fabric" : product.product_type === "outfit" ? "Outfit — Custom Stitching" : "Ready-Made Kurta"}
                  </span>
                )}

                <div>
                  <h1 className="font-display text-3xl sm:text-5xl lg:text-7xl font-extrabold text-ink leading-[1.1] sm:leading-[1.05] break-words">
                    {product.name}
                  </h1>
                  <div className="mt-5 h-px w-16 bg-gradient-to-r from-gold-400/60 to-transparent" />
                </div>

                <div className="inline-flex w-fit items-center gap-2.5 rounded-full border border-ink/10 bg-white px-4 py-2 shadow-soft">
                  <StarRating rating={product.review_count > 0 ? product.average_rating : 0} showValue />
                  <span className="h-3.5 w-px bg-ink/10" />
                  <span className="text-sm text-ink/60 font-bold">
                    {product.review_count > 0
                      ? `${product.review_count} Customer review${product.review_count === 1 ? "" : "s"}`
                      : "No reviews yet"}
                  </span>
                </div>

                {product.description && (
                  <p className="whitespace-pre-wrap text-lg sm:text-xl leading-relaxed text-ink/75 font-semibold">{product.description}</p>
                )}
              </div>

              <div className="mt-8 border-t border-ink/10 pt-8">
                <Suspense fallback={null}>
                  <ProductPurchasePanel
                    product={safeProduct}
                    variants={safeProduct.variants}
                    compatibleOutfits={safeCompatibleOutfits}
                    compatibleFabrics={safeCompatibleFabrics}
                    garmentTypes={safeGarmentTypes}
                    extraWorkOptions={safeExtraWorkOptions}
                  />
                </Suspense>
              </div>
            </Reveal>
          </ProductVariantProvider>
          </div>

          {/* Symmetrical Grid: FAQs on left, Reviews on right */}
          <div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 border-t border-ink/10 pt-10 sm:pt-16">

            {/* Left Column: FAQs */}
            <Reveal>
              {product.faqs && product.faqs.length > 0 ? (
                <div>
                  <p className="eyebrow">
                    <span className="gold-line" /> Need to Know
                  </p>
                  <div className="flex items-center gap-3.5 mt-4 mb-6">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/5 text-gold-600 shadow-[0_0_15px_rgba(212,163,89,0.08)]">
                      <HelpCircle className="w-5 h-5" strokeWidth={1.75} />
                    </span>
                    <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink">Common Questions</h2>
                  </div>
                  <div className="space-y-4">
                    {product.faqs.map((faq) => (
                      <details key={faq.id} className="group overflow-hidden rounded-2xl border border-ink/10 bg-white hover:border-gold-400/30 hover:shadow-[0_0_25px_rgba(212,163,89,0.08)] transition-all duration-300">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-lg sm:text-xl font-bold text-ink hover:bg-gold-50/10">
                          {faq.question}
                          <ChevronDown className="h-4.5 w-4.5 shrink-0 text-gold-600 transition-transform group-open:rotate-180" />
                        </summary>
                        <p className="px-5 pb-5 text-base sm:text-lg leading-relaxed text-ink/70 font-semibold border-t border-ink/10 pt-4 animate-fadeUp">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full rounded-[2rem] border border-dashed border-ink/15 p-8 text-center text-ink/45 py-16 bg-white shadow-soft">
                  <p className="text-base font-semibold">No FAQs available for this item.</p>
                </div>
              )}
            </Reveal>

            {/* Right Column: Reviews */}
            <Reveal delay={100} className="space-y-6">
              <p className="eyebrow">
                <span className="gold-line" /> Customer Love
              </p>
              <div className="flex items-center gap-3.5 mt-4 mb-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/5 text-gold-600 shadow-[0_0_15px_rgba(212,163,89,0.08)]">
                  <MessageSquareHeart className="w-5 h-5" strokeWidth={1.75} />
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink">Ratings &amp; Reviews</h2>
              </div>
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
              <div className="flex items-center gap-4 mt-4 mb-10">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/5 text-gold-600 shadow-[0_0_15px_rgba(212,163,89,0.08)]">
                  <Gift className="w-5 h-5" strokeWidth={1.75} />
                </span>
                <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-ink">You Might Also Like</h2>
              </div>
              <ProductGrid products={safeRelatedProducts} />
            </Reveal>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
