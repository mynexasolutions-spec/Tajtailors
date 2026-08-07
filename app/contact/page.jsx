import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ContactContent from "./_components/ContactContent";
import { getSiteSettings } from "@/actions/settings";
import { settingsToBrand } from "@/lib/constants";
import { buildMapsEmbedSrc } from "@/lib/googleMaps";

export const metadata = {
  title: "Contact Us | Taj Tailor",
  description: "Get in touch with Taj Tailor for stitching queries, measurement help, and order support.",
};

export default async function ContactPage() {
  const settings = (await getSiteSettings()) || {};
  const brandInfo = settingsToBrand(settings);
  const mapEmbedSrc = buildMapsEmbedSrc(settings.google_maps_url?.value);

  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen overflow-hidden pb-24 pt-10 sm:pt-14 bg-white text-ink selection:bg-gold-400/30 selection:text-ink">
        <ContactContent mapEmbedSrc={mapEmbedSrc} mapLinkHref={settings.google_maps_url?.value} brandInfo={brandInfo} />
      </main>
      <Footer />
    </>
  );
}
