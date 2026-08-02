import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";

export default function PolicyLayout({ title, updated, icon: Icon = FileText, children }) {
  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen overflow-hidden bg-ivory pb-24 pt-14 sm:pt-20">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-50">
          <div className="absolute left-[10%] top-0 h-[350px] w-[400px] rounded-full bg-gold-500/10 blur-[130px]" />
          <div className="absolute right-[8%] bottom-0 h-[350px] w-[400px] rounded-full bg-gold-300/10 blur-[130px]" />
          <div className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-gold-400/5 blur-[140px]" />
        </div>

        <div className="relative mx-auto max-w-2xl px-5 md:px-8">
          <div className="text-center">
            <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-700 shadow-[0_15px_40px_-24px_rgba(202,161,75,0.3)]">
              <Icon className="h-6 w-6" strokeWidth={1.5} />
            </span>
            <p className="eyebrow justify-center">
              <span className="gold-line" /> Legal <span className="gold-line" />
            </p>
            <h1 className="section-heading mt-4">{title}</h1>
            <span className="mt-4 inline-flex items-center rounded-full border border-gold-400/25 bg-white px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-ink/50">
              Last updated {updated}
            </span>
          </div>

          <div className="group relative mt-12 overflow-hidden rounded-[2rem] border border-ink/10 bg-white p-8 shadow-soft transition-colors duration-500 hover:border-gold-400/30 sm:p-10">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent"
            />
            <div className="space-y-5 text-base leading-relaxed text-ink/70 [&_h2]:mt-9 [&_h2:first-child]:mt-0">
              {children}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
