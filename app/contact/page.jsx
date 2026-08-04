import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ContactContent from "./_components/ContactContent";

export const metadata = {
  title: "Contact Us | Taj Tailor",
  description: "Get in touch with Taj Tailor for stitching queries, measurement help, and order support.",
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen overflow-hidden pb-24 pt-10 sm:pt-14 bg-white text-ink selection:bg-gold-400/30 selection:text-ink">
        <ContactContent />
      </main>
      <Footer />
    </>
  );
}
