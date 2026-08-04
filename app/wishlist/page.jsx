import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import WishlistContent from "./_components/WishlistContent";

export const metadata = {
  title: "My Wishlist | Taj Tailor",
  description: "View your saved items at Taj Tailor.",
};

export default function WishlistPage() {
  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen overflow-hidden pb-24 pt-10 sm:pt-14 bg-ivory text-ink selection:bg-gold-400/30 selection:text-ink">
        {/* Decorative background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gold-500/5 blur-[120px]" />
          <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gold-400/5 blur-[150px]" />
        </div>

        <WishlistContent />
      </main>
      <Footer />
    </>
  );
}
