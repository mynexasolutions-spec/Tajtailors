import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import Hero from "@/components/home/Hero";
import ThreeWays from "@/components/home/ThreeWays";
import HowItWorks from "@/components/home/HowItWorks";
import PremiumFabrics from "@/components/home/PremiumFabrics";
import KurtaCollection from "@/components/home/KurtaCollection";
import OutfitCollection from "@/components/home/OutfitCollection";
import FeaturedSpotlight from "@/components/home/FeaturedSpotlight";
import GarmentTypesSection from "@/components/home/GarmentTypesSection";
import TrustBar from "@/components/home/TrustBar";
import MarqueeStrip from "@/components/home/MarqueeStrip";
import TestimonialSection from "@/components/about/TestimonialSection";
import MenTailoringBanner from "@/components/home/MenTailoringBanner";
import { getActiveHeroSlides, getActiveTestimonials, getFeaturedGarmentTypes } from "@/actions/site";
import { getProducts, getFeaturedProducts } from "@/actions/products";
import { getSiteSettings } from "@/actions/settings";

export default async function HomePage() {
  const [heroSlides, fabrics, kurtas, outfits, featuredProducts, testimonials, featuredGarmentTypes, settings] = await Promise.all([
    getActiveHeroSlides(),
    getProducts({ productType: "fabric", limit: 6 }),
    getProducts({ productType: "kurta", isFeatured: true, limit: 6 }),
    getProducts({ productType: "outfit" }),
    getFeaturedProducts(1),
    getActiveTestimonials(),
    getFeaturedGarmentTypes(),
    getSiteSettings(),
  ]);
  const spotlightProduct = featuredProducts[0] || null;
  const featuredOutfits = outfits.filter((o) => o.isFeatured);

  const val = (key) => settings[key]?.value || "";
  const isOn = (key) => val(key) !== "false";
  const pair = (prefix, i, fields) =>
    Object.fromEntries(fields.map((f) => [f, val(`${prefix}_${i}_${f}`)]));

  return (
    <>
      <SiteHeader />
      <main>
        {isOn("home_hero_enabled") && (
          <Hero
            slides={heroSlides}
            badgeText={val("home_hero_badge_text")}
            ratingValue={val("home_hero_rating_value")}
            reviewsText={val("home_hero_reviews_text")}
            shippedText={val("home_hero_shipped_text")}
          />
        )}

        {isOn("home_threeways_enabled") && (
          <ThreeWays
            heading={val("home_threeways_heading")}
            cards={[1, 2, 3].map((i) => pair("home_threeways", i, ["title", "desc", "button"]))}
          />
        )}

        {isOn("home_marquee_enabled") && <MarqueeStrip items={val("home_marquee_items")} />}

        {/* Dual Promotional Sections (Men Tailoring & Spotlight Piece) */}
        <section className="relative overflow-hidden bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-wrap px-4 sm:px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {isOn("home_mentailoring_enabled") && (
                <MenTailoringBanner
                  imageUrl={val("home_mentailoring_image") || undefined}
                  title={val("home_mentailoring_title") || undefined}
                  itemsText={val("home_mentailoring_items") || undefined}
                  priceText={val("home_mentailoring_price") || undefined}
                  ctaLink={val("home_mentailoring_link") || undefined}
                  className="h-full"
                />
              )}
              {isOn("home_spotlight_enabled") && (
                <FeaturedSpotlight
                  product={spotlightProduct}
                  eyebrow={val("home_spotlight_eyebrow") || "Signature Piece"}
                  customTitle={val("home_spotlight_title")}
                  customDesc={val("home_spotlight_desc")}
                  customPrice={val("home_spotlight_price")}
                  customImage={val("home_spotlight_image")}
                  customLink={val("home_spotlight_link")}
                  className="h-full"
                />
              )}
            </div>
          </div>
        </section>

        {isOn("home_howitworks_enabled") && (
          <HowItWorks
            heading={val("home_howitworks_heading")}
            steps={[1, 2, 3, 4, 5].map((i) => pair("home_howitworks", i, ["title", "desc"]))}
          />
        )}

        {isOn("home_fabrics_enabled") && (
          <PremiumFabrics fabrics={fabrics} eyebrow={val("home_fabrics_eyebrow")} heading={val("home_fabrics_heading")} />
        )}

        <GarmentTypesSection garmentTypes={featuredGarmentTypes} />

        {isOn("home_kurtas_enabled") && (
          <KurtaCollection kurtas={kurtas} eyebrow={val("home_kurtas_eyebrow")} heading={val("home_kurtas_heading")} />
        )}

        {isOn("home_outfits_enabled") && (
          <OutfitCollection outfits={featuredOutfits} eyebrow={val("home_outfits_eyebrow") || "Bespoke Stitching"} heading={val("home_outfits_heading") || "Featured Custom Outfits"} />
        )}



        {isOn("home_testimonials_enabled") && (
          <TestimonialSection
            testimonials={testimonials}
            eyebrow={val("home_testimonials_eyebrow") || undefined}
            heading={val("home_testimonials_heading") || undefined}
          />
        )}

        {isOn("home_trustbar_enabled") && (
          <TrustBar points={[1, 2, 3, 4, 5].map((i) => pair("home_trustbar", i, ["title", "desc"]))} />
        )}
      </main>
      <Footer />
    </>
  );
}
