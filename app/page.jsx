import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import Hero from "@/components/home/Hero";
import ThreeWays from "@/components/home/ThreeWays";
import HowItWorks from "@/components/home/HowItWorks";
import PremiumFabrics from "@/components/home/PremiumFabrics";
import KurtaCollection from "@/components/home/KurtaCollection";
import FeaturedSpotlight from "@/components/home/FeaturedSpotlight";
import TrustBar from "@/components/home/TrustBar";
import MarqueeStrip from "@/components/home/MarqueeStrip";
import TestimonialSection from "@/components/about/TestimonialSection";
import { getActiveHeroSlides, getActiveTestimonials } from "@/actions/site";
import { getProducts, getFeaturedProducts } from "@/actions/products";
import { getSiteSettings } from "@/actions/settings";

export default async function HomePage() {
  const [heroSlides, fabrics, kurtas, featuredProducts, testimonials, settings] = await Promise.all([
    getActiveHeroSlides(),
    getProducts({ productType: "fabric", limit: 6 }),
    getProducts({ productType: "kurta", limit: 6 }),
    getFeaturedProducts(1),
    getActiveTestimonials(),
    getSiteSettings(),
  ]);
  const spotlightProduct = featuredProducts[0] || null;

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

        {isOn("home_howitworks_enabled") && (
          <HowItWorks
            heading={val("home_howitworks_heading")}
            steps={[1, 2, 3, 4, 5].map((i) => pair("home_howitworks", i, ["title", "desc"]))}
          />
        )}

        {isOn("home_fabrics_enabled") && (
          <PremiumFabrics fabrics={fabrics} eyebrow={val("home_fabrics_eyebrow")} heading={val("home_fabrics_heading")} />
        )}

        {isOn("home_kurtas_enabled") && (
          <KurtaCollection kurtas={kurtas} eyebrow={val("home_kurtas_eyebrow")} heading={val("home_kurtas_heading")} />
        )}

        {isOn("home_spotlight_enabled") && (
          <FeaturedSpotlight product={spotlightProduct} eyebrow={val("home_spotlight_eyebrow") || "Signature Piece"} />
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
