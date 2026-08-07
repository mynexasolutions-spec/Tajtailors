import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import SherwaniGlyph from "@/components/SherwaniGlyph";
import TestimonialSection from "@/components/about/TestimonialSection";
import StatCounter from "@/components/about/StatCounter";
import { getFeaturedProducts } from "@/actions/products";
import { getActiveTestimonials } from "@/actions/site";
import { getSiteSettings } from "@/actions/settings";
import { whatsappLink, settingsToBrand } from "@/lib/constants";
import {
  Ruler,
  Clock,
  Scissors,
  Sparkles,
  Quote,
  Compass,
  Award,
  ShieldCheck,
  Truck,
  ChevronDown,
} from "lucide-react";

export const metadata = { title: "Our Story - Taj Tailor" };

const VALUES = [
  {
    icon: Ruler,
    title: "Precise Measurements",
    text: "We take exact measurements — at your doorstep or through our simple guide — so every stitch fits exactly right."
  },
  {
    icon: Scissors,
    title: "Premium Fabrics",
    text: "We only work with fabrics we'd wear ourselves — soft, durable, and built to hold their shape wear after wear."
  },
  {
    icon: Clock,
    title: "Handled With Care",
    text: "Every order is cut, stitched, and finished by hand, never rushed, so the fit is right the first time."
  },
  {
    icon: ShieldCheck,
    title: "Quality Guaranteed",
    text: "Every piece is checked for stitching and fit before it leaves our workshop and heads to your door."
  },
];

const PROCESS = [
  {
    icon: Compass,
    title: "Choosing Your Fabric",
    text: "Send us your own fabric or choose from our premium collection of cottons, linens, and more."
  },
  {
    icon: Ruler,
    title: "Taking Measurements",
    text: "Share your measurements using our simple guide, or let our team help you get it exactly right."
  },
  {
    icon: Scissors,
    title: "Cutting & Stitching",
    text: "Our tailors cut and stitch each piece by hand, checking fit and finish at every step."
  },
  {
    icon: Award,
    title: "Quality Check & Delivery",
    text: "We inspect every stitch before it's packed and delivered straight to your doorstep."
  },
];

const STATS = [
  { icon: Ruler, value: "35+", label: "Years of Craft" },
  { icon: ShieldCheck, value: "100%", label: "Perfect Fitting" },
  { icon: Truck, value: "Free", label: "Doorstep Delivery" },
  { icon: Award, value: "1000+", label: "Happy Customers" },
];

export default async function AboutPage() {
  const [featuredProducts, testimonials, settings] = await Promise.all([
    getFeaturedProducts(4),
    getActiveTestimonials(),
    getSiteSettings(),
  ]);
  const storyImage = featuredProducts.find((p) => p.image)?.image || null;
  const brandInfo = settingsToBrand(settings);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-white text-ink overflow-hidden pb-28 pt-20 relative">

        {/* Hero Section */}
        <section className="relative pt-16 pb-12 sm:pb-24 md:py-36">
          <div className="relative mx-auto max-w-wrap px-6 md:px-12">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <Reveal>
                <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-gold-400/35 bg-white/80 backdrop-blur-sm text-[10px] font-bold uppercase tracking-[0.3em] text-gold-700 mb-8 shadow-soft">
                  <Sparkles className="w-3.5 h-3.5 text-gold-500 animate-pulse" />
                  Custom Tailoring
                </span>
                <h1 className="font-display text-4xl sm:text-5xl md:text-7xl tracking-tight leading-[1.05] text-ink font-bold">
                  Fits That Feel <br />
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-400 to-gold-700 relative animate-pulse">
                    Like They're Yours
                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
                  </span>
                </h1>
                <div className="mx-auto mt-8 h-1 w-20 rounded bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
                <p className="mt-8 text-base sm:text-lg md:text-xl text-ink/70 leading-relaxed font-semibold">
                  Taj Tailor was started to bring proper, made-to-measure tailoring to your doorstep. We were tired of ill-fitting off-the-rack clothes. So we went back to traditional, careful stitching. We make garments that fit right and last long.
                </p>
                <div className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                  <Link
                    href="/shop"
                    className="btn-gold whitespace-nowrap px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider hover:scale-[1.03] transition-all duration-300 bg-[length:200%_200%] shadow-gold hover:shadow-lg"
                  >
                    Shop Now
                  </Link>
                  <a
                    href={whatsappLink("Hi Taj Tailor, I would love to know more about your tailoring services.", brandInfo)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full border border-emerald-500 bg-emerald-500 px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-emerald-600 hover:scale-[1.03] shadow-md hover:shadow-lg"
                  >
                    <FaWhatsapp className="h-4.5 w-4.5" /> Chat on WhatsApp
                  </a>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Scroll Cue */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block">
            <button aria-label="Scroll to explore" className="animate-bounce text-ink/30 hover:text-gold-600 transition-colors">
              <ChevronDown className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
        </section>

        {/* Story Section with Overlapping Image Canvas */}
        <section className="relative py-20 sm:py-28 border-y border-gold-400/15 bg-white">
          <div className="mx-auto max-w-wrap px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">

              {/* Overlapping Image Canvas side */}
              <div className="order-1 lg:order-2 lg:col-span-5 flex justify-center">
                <Reveal className="relative group">
                  {/* Outer offset gold border frame */}
                  <div className="absolute -inset-4 rounded-[160px] border border-gold-400/20 -rotate-3 scale-95 pointer-events-none transition-transform duration-500 group-hover:rotate-0 group-hover:scale-100 z-0" />
                  
                  {/* Main Image container */}
                  <div className="relative z-10 w-[300px] sm:w-[325px] aspect-[4/5] rounded-[160px] overflow-hidden border border-gold-400/20 bg-white shadow-2xl transition-all duration-500 group-hover:border-gold-400/40">
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent z-10" />
                    
                    {storyImage ? (
                      <Image
                        src={storyImage}
                        alt="Taj Tailor Craftsmanship"
                        fill
                        sizes="(max-width: 1024px) 80vw, 30vw"
                        className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <SherwaniGlyph className="h-1/2 w-auto text-gold-500/45 animate-floatSlow" />
                      </div>
                    )}

                    {/* Decorative Inner Oval Frame */}
                    <div className="absolute inset-3.5 rounded-[150px] border border-gold-400/15 pointer-events-none z-20" />
                  </div>

                  {/* Floating Heritage Badge */}
                  <div className="absolute -bottom-4 -right-4 z-30 flex h-20 w-20 items-center justify-center rounded-full bg-ink border border-gold-400/35 text-white shadow-2xl transition-transform duration-500 group-hover:scale-110">
                    <div className="text-center">
                      <span className="block text-[8px] uppercase tracking-[0.2em] text-gold-400/80 font-bold">Since</span>
                      <span className="block text-sm font-display font-bold text-gold-300">1990</span>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* Text side */}
              <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col justify-center">
                <Reveal delay={100}>
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-gold-600 mb-3 block">
                    Our Promise
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-tight text-ink font-bold">
                    Stitched Slowly. <br />
                    <span className="font-semibold text-gold-700">Checked By Us First.</span>
                  </h2>
                  <div className="h-0.5 w-16 bg-gold-400/40 my-6" />
                  <p className="text-base sm:text-lg text-ink/75 leading-relaxed font-semibold">
                    Every garment we make goes through a strict quality check. We work with experienced master tailors across India who bring decades of hand-stitching craft to every seam.
                  </p>
                  <p className="mt-4 text-base sm:text-lg text-ink/75 leading-relaxed font-semibold">
                    Before an order leaves our workshop, our team checks the stitching, seams, and finish against your exact measurements. We only send out what we'd be happy to wear ourselves.
                  </p>

                  {/* Upgraded Quote Component */}
                  <div className="group mt-10 p-8 sm:p-10 rounded-[2rem] bg-white border border-gold-400/20 relative overflow-hidden shadow-soft transition-all duration-500 hover:border-gold-400/40 hover:shadow-gold">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-500">
                      <Quote className="w-20 h-20 text-gold-500" strokeWidth={1} />
                    </div>
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-gold-500 to-gold-700" />
                    <p className="font-display text-xl sm:text-2xl italic text-gold-800 leading-relaxed relative z-10">
                      &ldquo;A well-fitted garment is not just fabric and thread. It is a piece of craft that sits right on you and holds its shape wear after wear.&rdquo;
                    </p>
                    <div className="mt-6 flex items-center gap-3 relative z-10">
                      <div className="h-[1px] w-8 bg-gold-400/50" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gold-600">Founder, Taj Tailor</span>
                    </div>
                  </div>
                </Reveal>
              </div>

            </div>
          </div>
        </section>

        {/* Process Timeline Section with Connections */}
        <section className="py-24 sm:py-32 relative">
          <div className="mx-auto max-w-wrap px-6 md:px-12">
            <Reveal className="text-center max-w-2xl mx-auto mb-20">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-gold-600 mb-3 block">
                Traditional Process
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-ink">
                How We Make It
              </h2>
              <div className="w-16 h-[2px] bg-gold-500 mx-auto mt-4" />
            </Reveal>

            {/* Horizontal Timeline Connecting Line */}
            <div className="hidden lg:block absolute top-[280px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-gold-300/35 to-transparent" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {PROCESS.map((step, i) => (
                <Reveal key={step.title} delay={i * 100}>
                  <div className="relative group h-full overflow-hidden rounded-3xl border border-gold-400/15 bg-white p-8 transition-all duration-500 hover:border-gold-400/35 hover:-translate-y-2 flex flex-col justify-between shadow-soft hover:shadow-gold">
                    {/* Watermark Numeral */}
                    <span className="pointer-events-none absolute right-4 top-2 font-display text-6xl font-bold leading-none text-transparent bg-clip-text bg-gradient-to-b from-gold-500/10 to-gold-500/0 transition-transform duration-500 group-hover:scale-110 group-hover:from-gold-500/20">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="relative">
                      {/* Icon Box with Ring Glow */}
                      <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-gold-400/20 bg-white text-gold-600 shadow-[0_0_20px_rgba(212,163,89,0.03)] transition-all duration-500 group-hover:scale-110 group-hover:border-gold-400/50 group-hover:text-gold-700 group-hover:shadow-gold z-10 relative">
                        <step.icon className="w-6 h-6" strokeWidth={1.5} />
                      </div>
                      <h3 className="font-display text-xl text-ink font-bold mb-3.5 group-hover:text-gold-700 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-base sm:text-lg leading-relaxed text-ink/70 font-semibold">
                        {step.text}
                      </p>
                    </div>

                    {/* Bottom Border Accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-400/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Showcase */}
        <section className="py-16 sm:py-20 relative">
          <div className="mx-auto max-w-wrap px-6 md:px-12">
            <Reveal>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 sm:gap-10 md:gap-4 rounded-[2.5rem] border border-gold-400/20 bg-white shadow-soft px-4 sm:px-8 py-12 sm:py-16 text-center relative overflow-hidden">

                {/* Subtle radial light backdrop */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(202,161,75,0.04),transparent_70%)] pointer-events-none" />

                {STATS.map((stat, idx) => (
                  <div key={stat.label} className="relative group">
                    {idx > 0 && (
                      <div className="hidden md:block absolute left-0 top-1/4 bottom-1/4 w-[1px] bg-gold-400/25" />
                    )}
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/20 bg-white text-gold-600 shadow-[0_0_20px_rgba(212,163,89,0.03)] transition-all duration-300 group-hover:scale-110 group-hover:border-gold-400/40 group-hover:text-gold-700">
                      <stat.icon className="h-5.5 w-5.5" strokeWidth={1.5} />
                    </div>
                    <p className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-gold-600 via-gold-400 to-gold-700 group-hover:scale-105 transition-transform duration-300">
                      <StatCounter value={stat.value} />
                    </p>
                    <p className="mt-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-ink/50">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Testimonial Section */}
        <TestimonialSection testimonials={testimonials} />

        {/* Values Grid Section */}
        <section className="py-24 sm:py-32 relative">
          <div className="mx-auto max-w-wrap px-6 md:px-12">
            <Reveal className="text-center max-w-2xl mx-auto mb-20">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-gold-600 mb-3 block">
                Our Promise
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-ink">
                What We Stand For
              </h2>
              <div className="w-16 h-[2px] bg-gold-500 mx-auto mt-4" />
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
              {VALUES.map((v, i) => (
                <Reveal key={v.title} delay={i * 100}>
                  <div className="group relative overflow-hidden rounded-[2.5rem] border border-gold-400/15 bg-white p-8 sm:p-12 transition-all duration-500 hover:border-gold-400/35 hover:-translate-y-1.5 hover:shadow-gold flex flex-col sm:flex-row gap-8 items-start shadow-soft">
                    {/* Watermark Icon */}
                    <v.icon className="pointer-events-none absolute bottom-4 right-4 h-28 w-28 text-gold-500/[0.03] transition-transform duration-700 group-hover:scale-110 group-hover:text-gold-500/[0.06]" strokeWidth={1} />

                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-gold-400/20 bg-white text-gold-600 shadow-[0_0_20px_rgba(212,163,89,0.03)] transition-all duration-500 group-hover:scale-110 group-hover:border-gold-400/40 group-hover:text-gold-700">
                      <v.icon className="w-7 h-7" strokeWidth={1.5} />
                    </div>
                    <div className="relative">
                      <span className="mb-2 block font-display text-xs text-gold-500/70 tracking-[0.25em] font-bold">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl text-ink font-bold mb-3.5 group-hover:text-gold-700 transition-colors">
                        {v.title}
                      </h3>
                      <p className="text-base sm:text-lg leading-relaxed text-ink/70 font-semibold">
                        {v.text}
                      </p>
                    </div>

                    {/* Bottom Border Accent */}
                    <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-gold-400/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner Section */}
        <section className="relative py-8">
          <div className="mx-auto max-w-wrap px-6 md:px-12">
            <Reveal className="relative flex flex-col items-center justify-center overflow-hidden rounded-[2.5rem] bg-white border border-gold-400/25 px-6 sm:px-8 py-16 sm:py-24 text-center shadow-soft">

              {/* Shimmering top sheen */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gold-gradient bg-[length:200%_200%] animate-shimmer" />

              <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-gold-600 mb-4 block">
                  Get Started
                </span>
                <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold text-ink mb-6 leading-tight">
                  Ready for Your <br />
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 to-gold-700">
                    Perfect Fitting?
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-ink/70 mb-10 max-w-lg leading-relaxed font-semibold">
                  Explore our range of premium fabrics and ready-made kurtas, or talk to us on WhatsApp to place a custom stitching order.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link href="/shop" className="btn-gold px-10 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider hover:scale-[1.03] transition-all duration-300 shadow-gold hover:shadow-lg">
                    Shop Now
                  </Link>
                  <a
                    href={whatsappLink("Hi Taj Tailor, I would love to place an order.", brandInfo)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline flex items-center justify-center gap-2 px-10 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-gold-400/10 hover:border-gold-300 transition-all duration-300"
                  >
                    <FaWhatsapp className="h-5 w-5 text-[#25D366]" /> Message on WhatsApp
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
