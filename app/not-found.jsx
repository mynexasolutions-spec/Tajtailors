import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-5 text-center bg-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_top,rgba(202,161,75,0.09),transparent_72%)]" />

        <p className="relative font-display text-[6rem] font-bold leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-400 to-gold-700 sm:text-[9rem] md:text-[11rem]">
          404
        </p>
        <p className="eyebrow relative justify-center -mt-2 sm:-mt-4">
          <span className="gold-line" /> Page Not Found
        </p>
        <h1 className="section-heading relative mt-4">This Page Got Unstitched</h1>
        <p className="relative mt-3 max-w-sm text-sm text-ink/55">
          Looks like this page missed its final fitting. It doesn't exist, or has been moved — let's get you back to the shop.
        </p>
        <Link href="/shop" className="btn-gold relative mt-8">
          Back to Shop
        </Link>
      </main>
      <Footer />
    </>
  );
}
