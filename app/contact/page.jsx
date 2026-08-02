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
      <main className="relative min-h-screen overflow-hidden pb-24 pt-10 sm:pt-14 bg-ivory text-ink selection:bg-gold-400/30 selection:text-ink">
        {/* Decorative background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gold-500/10 blur-[120px]" />
          <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gold-400/10 blur-[150px]" />
          <div className="absolute bottom-[15%] left-[20%] w-[500px] h-[500px] rounded-full bg-gold-600/10 blur-[130px]" />
        </div>

        <ContactContent />
      </main>
      <Footer />
    </>
  );
}
