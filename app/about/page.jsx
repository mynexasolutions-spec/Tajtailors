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
import { whatsappLink } from "@/lib/constants";
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
  const featuredProducts = await getFeaturedProducts(4);
  const storyImage = featuredProducts.find((p) => p.image)?.image || null;

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-ivory text-ink overflow-hidden pb-28 pt-20">

        {/* Decorative background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gold-500/10 blur-[120px]" />
          <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gold-400/10 blur-[150px]" />
          <div className="absolute bottom-[15%] left-[20%] w-[500px] h-[500px] rounded-full bg-gold-600/10 blur-[130px]" />
        </div>

        {/* Hero Section */}
        <section className="relative pt-12 pb-8 sm:pb-20 md:py-28">
          <div className="relative mx-auto max-w-wrap px-6 md:px-12 text-center">
            <Reveal>
              <span className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-gold-400/25 bg-white text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-700 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-gold-600 animate-pulse" />
                Custom Tailoring
              </span>
              <h1 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] text-ink font-semibold">
                Fits That Feel <br />
                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">
                  Like They're Yours
                </span>
              </h1>
              <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
              <p className="mt-8 text-base sm:text-lg md:text-xl text-ink/60 max-w-3xl mx-auto leading-relaxed font-semibold">
                Taj Tailor was started to bring proper, made-to-measure tailoring to your doorstep. We were tired of ill-fitting off-the-rack clothes. So we went back to traditional, careful stitching. We make garments that fit right and last long.
              </p>
              <div className="mt-10 flex flex-nowrap items-center justify-center gap-2.5 sm:gap-5">
                <Link href="/shop" className="btn-gold whitespace-nowrap px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-medium hover:scale-[1.02] transition-transform">
                  Shop Now
                </Link>
                <a
                  href={whatsappLink("Hi Taj Tailor, I would love to know more about your tailoring services.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-full border border-emerald-500/30 bg-emerald-500 px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-medium text-white transition-all hover:bg-emerald-600 hover:scale-[1.02]"
                >
                  <FaWhatsapp className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Chat on WhatsApp
                </a>
              </div>
            </Reveal>
          </div>

          {/* Scroll Cue */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block">
            <button aria-label="Scroll to explore" className="animate-bounce text-ink/30 hover:text-gold-600 transition-colors">
              <ChevronDown className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        </section>

        {/* Story Section */}
        <section className="relative py-8 sm:py-20 border-y border-ink/10 bg-ivory-deep">
          <div className="mx-auto max-w-wrap px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

              {/* Image side */}
              <div className="order-1 lg:order-2 lg:col-span-5 flex justify-center lg:justify-end">
                <Reveal className="relative group w-full max-w-[320px] aspect-[4/5] rounded-[160px] overflow-hidden border border-gold-400/20 bg-gradient-to-b from-ivory to-ivory-deep shadow-2xl transition-all duration-500 hover:border-gold-400/40">
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent z-10" />
                  <div className="absolute inset-0 bg-gold-gradient opacity-[0.03] mix-blend-overlay group-hover:opacity-10 transition-opacity duration-500" />

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
                      <SherwaniGlyph className="h-1/2 w-auto text-gold-500/50 animate-floatSlow" />
                    </div>
                  )}

                  {/* Decorative Frame */}
                  <div className="absolute inset-3 rounded-[150px] border border-gold-400/10 pointer-events-none z-20" />
                </Reveal>
              </div>

              {/* Text side */}
              <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col justify-center">
                <Reveal delay={100}>
                  <span className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-600 mb-4 block">
                    Our Promise
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-tight text-ink font-semibold">
                    Stitched Slowly. <br />
                    <span className="font-medium text-gold-700">Checked By Us First.</span>
                  </h2>
                  <p className="mt-6 text-base sm:text-lg text-ink/65 leading-relaxed font-semibold">
                    Every garment we make goes through a strict quality check. We work with experienced master tailors across India who bring decades of hand-stitching craft to every seam.
                  </p>
                  <p className="mt-4 text-base sm:text-lg text-ink/65 leading-relaxed font-semibold">
                    Before an order leaves our workshop, our team checks the stitching, seams, and finish against your exact measurements. We only send out what we'd be happy to wear ourselves.
                  </p>

                  <div className="group mt-8 p-6 sm:p-8 rounded-2xl bg-white border-l-4 border-l-gold-400 border-y border-r border-ink/10 relative overflow-hidden shadow-soft transition-all duration-500 hover:border-gold-400/30 hover:shadow-[0_0_40px_rgba(212,163,89,0.1)]">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-500">
                      <Quote className="w-16 h-16 sm:w-24 sm:h-24 text-gold-500" />
                    </div>
                    <p className="font-display text-xl sm:text-2xl italic text-gold-700 leading-relaxed relative z-10">
                      &ldquo;A well-fitted garment is not just fabric and thread. It is a piece of craft that sits right on you and holds its shape wear after wear.&rdquo;
                    </p>
                    <div className="mt-5 flex items-center gap-3 relative z-10">
                      <div className="h-[1px] w-8 bg-gold-400/50" />
                      <span className="text-[11px] uppercase tracking-widest text-gold-600 font-semibold">Founder, Taj Tailor</span>
                    </div>
                  </div>
                </Reveal>
              </div>

            </div>
          </div>
        </section>

        {/* Process Timeline Section */}
        <section className="py-16 sm:py-24 relative">
          <div className="mx-auto max-w-wrap px-6 md:px-12">
            <Reveal className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-600 mb-3 block">
                Traditional Process
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-ink">
                How We Make It
              </h2>
              <div className="w-16 h-[1px] bg-gold-400/40 mx-auto mt-4" />
            </Reveal>

            {/* Horizontal timeline connector (desktop only) */}
            <div className="hidden lg:block absolute top-1/3 left-[5%] right-[5%] h-[1px] bg-gradient-to-r from-transparent via-gold-400/20 to-transparent" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {PROCESS.map((step, i) => (
                <Reveal key={step.title} delay={i * 100}>
                  <div className="relative group h-full overflow-hidden rounded-3xl border border-ink/10 bg-white p-8 transition-all duration-500 hover:border-gold-400/30 hover:bg-ivory-deep hover:-translate-y-2 flex flex-col justify-between shadow-soft">
                    {/* Large watermark numeral */}
                    <span className="pointer-events-none absolute right-4 top-2 font-display text-5xl sm:text-6xl font-semibold leading-none text-transparent bg-clip-text bg-gradient-to-b from-gold-400/20 to-gold-400/0 transition-transform duration-500 group-hover:scale-110 group-hover:from-gold-400/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="relative">
                      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/5 text-gold-600 shadow-[0_0_20px_rgba(212,163,89,0.08)] transition-all duration-500 group-hover:scale-110 group-hover:border-gold-400/50 group-hover:text-gold-700 group-hover:shadow-[0_0_25px_rgba(212,163,89,0.15)]">
                        <step.icon className="w-6 h-6" strokeWidth={1.5} />
                      </div>
                      <h3 className="font-display text-xl text-ink font-medium mb-3 group-hover:text-gold-700 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-base sm:text-lg leading-relaxed text-ink/60 font-semibold">
                        {step.text}
                      </p>
                    </div>

                    {/* Hover glow line */}
                    <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-gold-400/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Showcase */}
        <section className="py-12 sm:py-16 relative">
          <div className="mx-auto max-w-wrap px-6 md:px-12">
            <Reveal>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 sm:gap-10 md:gap-4 rounded-[2rem] sm:rounded-[2.5rem] border border-gold-400/20 bg-gradient-to-b from-white to-ivory-deep shadow-soft px-4 sm:px-8 py-10 sm:py-14 md:py-16 text-center relative overflow-hidden">

                {/* Subtle radial backdrop for the stats container */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(202,161,75,0.08),transparent_70%)] pointer-events-none" />

                {STATS.map((stat, idx) => (
                  <div key={stat.label} className="relative group">
                    {idx > 0 && (
                      <div className="hidden md:block absolute left-0 top-1/4 bottom-1/4 w-[1px] bg-ink/10" />
                    )}
                    <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/5 text-gold-600 shadow-[0_0_20px_rgba(212,163,89,0.08)] transition-all duration-300 group-hover:scale-110 group-hover:border-gold-400/50 group-hover:text-gold-700 group-hover:shadow-[0_0_25px_rgba(212,163,89,0.15)]">
                      <stat.icon className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <p className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-gold-600 via-gold-500 to-gold-700 group-hover:scale-105 transition-transform duration-300">
                      <StatCounter value={stat.value} />
                    </p>
                    <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-ink/45">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Testimonial Carousel Section */}
        <TestimonialSection />

        {/* Values Grid Section */}
        <section className="py-16 sm:py-24 relative">
          <div className="mx-auto max-w-wrap px-6 md:px-12">
            <Reveal className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-600 mb-3 block">
                Our Promise
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-ink">
                What We Stand For
              </h2>
              <div className="w-16 h-[1px] bg-gold-400/40 mx-auto mt-4" />
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {VALUES.map((v, i) => (
                <Reveal key={v.title} delay={i * 100}>
                  <div className="group relative overflow-hidden rounded-[2rem] border border-ink/10 bg-white p-8 sm:p-12 transition-all duration-500 hover:border-gold-400/30 hover:bg-ivory-deep hover:-translate-y-1.5 hover:shadow-[0_0_40px_rgba(212,163,89,0.1)] flex flex-col sm:flex-row gap-7 items-start shadow-soft">
                    {/* Giant watermark icon */}
                    <v.icon className="pointer-events-none absolute bottom-4 right-4 h-24 w-24 text-gold-500/[0.06] transition-transform duration-700 group-hover:scale-110 group-hover:text-gold-500/[0.1]" strokeWidth={1} />

                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/5 text-gold-600 shadow-[0_0_20px_rgba(212,163,89,0.08)] transition-all duration-500 group-hover:scale-110 group-hover:border-gold-400/50 group-hover:text-gold-700 group-hover:shadow-[0_0_25px_rgba(212,163,89,0.15)]">
                      <v.icon className="w-7 h-7" strokeWidth={1.5} />
                    </div>
                    <div className="relative">
                      <span className="mb-2 block font-display text-sm text-gold-500/70 tracking-widest">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl text-ink font-semibold mb-3 group-hover:text-gold-700 transition-colors">
                        {v.title}
                      </h3>
                      <p className="text-base sm:text-lg leading-relaxed text-ink/65 font-semibold">
                        {v.text}
                      </p>
                    </div>

                    {/* Hover glow line */}
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
            <Reveal className="relative flex flex-col items-center justify-center overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-b from-white to-ivory-deep border border-gold-400/25 px-6 sm:px-8 py-14 sm:py-20 md:py-24 text-center shadow-soft">

              {/* Shimmering top sheen */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gold-gradient bg-[length:200%_200%] animate-shimmer" />

              {/* Background Graphics */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(202,161,75,0.08),transparent_60%)] pointer-events-none" />
              <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-gold-400/10 blur-[100px] pointer-events-none" />
              <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-gold-300/10 blur-[100px] pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                <span className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-600 mb-3 block">
                  Get Started
                </span>
                <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-semibold text-ink mb-6 leading-tight">
                  Ready for Your <br />
                  <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 to-gold-700">
                    Perfect Fitting?
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-ink/60 mb-10 max-w-lg leading-relaxed font-semibold">
                  Explore our range of premium fabrics and ready-made kurtas, or talk to us on WhatsApp to place a custom stitching order.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link href="/shop" className="btn-gold px-9 py-4 text-sm font-semibold hover:scale-[1.03] transition-transform shadow-[0_4px_20px_rgba(212,163,89,0.15)] hover:shadow-[0_4px_25px_rgba(212,163,89,0.3)]">
                    Shop Now
                  </Link>
                  <a
                    href={whatsappLink("Hi Taj Tailor, I would love to place an order.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline px-9 py-4 text-sm font-semibold hover:bg-gold-400/10 hover:border-gold-300 transition-all"
                  >
                    Message on WhatsApp
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
