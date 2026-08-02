import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, Youtube, Mail, Phone } from "lucide-react";
import { whatsappLink, settingsToBrand } from "@/lib/constants";
import { getSiteSettings } from "@/actions/settings";

export default async function Footer() {
  const dbSettings = await getSiteSettings() || {};
  const brandInfo = settingsToBrand(dbSettings);

  return (
    <footer className="relative overflow-hidden border-t border-ink/10 bg-ivory-deep">
      {/* Shimmering top hairline */}
      <div className="absolute inset-x-0 top-0 h-px bg-gold-gradient bg-[length:200%_200%] animate-shimmer" />

      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-50">
        <div className="absolute left-[10%] top-0 h-[350px] w-[400px] rounded-full bg-gold-500/10 blur-[130px]" />
        <div className="absolute right-[10%] bottom-0 h-[350px] w-[400px] rounded-full bg-gold-300/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-wrap px-4 py-16 sm:px-6 sm:py-20 md:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-10">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center">
              <Image src="/logo.png" alt="Taj Tailor" width={1672} height={941} className="h-14 w-auto object-contain" />
            </Link>
            <p className="mt-5 max-w-sm text-base font-semibold leading-relaxed text-ink/60">
              Doorstep tailoring, done right. Send your own fabric or choose from our premium
              collection, share your measurements, and we'll stitch and deliver it to your home.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={brandInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/20 bg-white text-ink/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400/50 hover:text-gold-700 hover:shadow-[0_10px_25px_-12px_rgba(202,161,75,0.4)]"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={brandInfo.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/20 bg-white text-ink/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400/50 hover:text-gold-700 hover:shadow-[0_10px_25px_-12px_rgba(202,161,75,0.4)]"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={brandInfo.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/20 bg-white text-ink/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400/50 hover:text-gold-700 hover:shadow-[0_10px_25px_-12px_rgba(202,161,75,0.4)]"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-700/90">Explore</p>
            <div className="mt-3 h-px w-8 bg-gold-400/40" />
            <ul className="mt-4 space-y-2.5 text-base font-semibold text-ink/60">
              <li><Link href="/shop" className="inline-block transition-all hover:translate-x-1 hover:text-gold-700">Shop All</Link></li>
              <li><Link href="/about" className="inline-block transition-all hover:translate-x-1 hover:text-gold-700">Our Story</Link></li>
              <li><Link href="/contact" className="inline-block transition-all hover:translate-x-1 hover:text-gold-700">Contact</Link></li>
              <li><Link href="/account" className="inline-block transition-all hover:translate-x-1 hover:text-gold-700">My Account</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-700/90">Policies</p>
            <div className="mt-3 h-px w-8 bg-gold-400/40" />
            <ul className="mt-4 space-y-2.5 text-base font-semibold text-ink/60">
              <li><Link href="/policies/shipping" className="inline-block transition-all hover:translate-x-1 hover:text-gold-700">Shipping Policy</Link></li>
              <li><Link href="/policies/refund" className="inline-block transition-all hover:translate-x-1 hover:text-gold-700">Refund Policy</Link></li>
              <li><Link href="/policies/privacy" className="inline-block transition-all hover:translate-x-1 hover:text-gold-700">Privacy Policy</Link></li>
              <li><Link href="/policies/terms" className="inline-block transition-all hover:translate-x-1 hover:text-gold-700">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="relative mt-12 flex flex-col gap-4 border-t border-gold-400/15 pt-6 text-base font-semibold text-ink/45 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Taj Tailor. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href={`mailto:${brandInfo.email}`} className="flex items-center gap-1.5 transition-colors hover:text-gold-700">
              <Mail className="h-3.5 w-3.5" /> {brandInfo.email}
            </a>
            <a href={whatsappLink("", brandInfo)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 transition-colors hover:text-gold-700">
              <Phone className="h-3.5 w-3.5" /> {brandInfo.whatsappDisplay}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
