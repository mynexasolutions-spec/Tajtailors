"use client";

import { useState } from "react";
import { Mail, Phone, Copy, Check, ChevronDown, Clock, ArrowUpRight, Instagram, Facebook, Youtube, MapPin, Navigation } from "lucide-react";
import { whatsappLink } from "@/lib/constants";
import ContactForm from "./ContactForm";
import Reveal from "@/components/Reveal";

const FAQS = [
  {
    q: "How do I get stitched without visiting a shop?",
    a: "Just share your measurements using our simple guide, or send us an old, well-fitting garment as a reference — our tailors will match the sizing exactly. No shop visit needed.",
  },
  {
    q: "How fast do you ship orders across India?",
    a: "We ship all orders within 24 hours of stitching completion. Delivery usually takes 2 to 5 business days depending on your city.",
  },
  {
    q: "Do you offer bulk or corporate orders?",
    a: "Yes, we do. We take bulk stitching orders for weddings, corporate uniforms, and events. Contact us via the form or WhatsApp for bulk pricing.",
  },
  {
    q: "Can I send my own fabric to be stitched?",
    a: "Absolutely. Choose \"Stitch My Fabric\" at checkout, and our courier will pick up your fabric from your doorstep for stitching.",
  },
];

export default function ContactContent({ mapEmbedSrc, mapLinkHref, brandInfo }) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleCopyEmail = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(brandInfo.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="mx-auto max-w-wrap px-6 md:px-12 relative">

      {/* Hero Header */}
      <div className="relative mx-auto max-w-3xl text-center mb-10 sm:mb-16">
        <Reveal>
          {/* Status Pill */}
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-gold-400/25 bg-white px-3 sm:px-4 py-1.5 shadow-soft mb-6">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[9px] sm:text-[11px] font-semibold uppercase tracking-wide sm:tracking-wider text-ink/75">
              Support Desk Active <span className="mx-1 text-gold-500/50">•</span> Usually replies in &lt; 2 hrs
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-ink leading-none">
            Contact <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">Us</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-ink/60 max-w-xl mx-auto font-semibold leading-relaxed">
            Have questions about fabrics, stitching, or measurements? We are here to help you.
          </p>
        </Reveal>
      </div>

      {/* Main Grid Section */}
      <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 items-start">

        {/* Left Column: Direct Channels & Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 lg:col-span-5">

          {/* Email Card */}
          <Reveal delay={80} className="h-full">
            <div className="group relative overflow-hidden rounded-[2rem] border border-gold-400/10 bg-white p-6 shadow-soft transition-all duration-500 hover:border-gold-400/35 hover:shadow-[0_0_30px_rgba(212,163,89,0.06)] hover:-translate-y-1 h-full flex flex-col justify-between">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold-400/10 text-gold-600 ring-1 ring-gold-400/20 group-hover:scale-105 transition-transform duration-500">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gold-600">
                      Email Us
                    </span>
                    <p className="font-display mt-0.5 text-base sm:text-lg text-ink group-hover:text-gold-700 transition-colors break-all">
                      {brandInfo.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCopyEmail}
                  title="Copy Email"
                  className="rounded-xl border border-ink/10 bg-white p-2.5 text-ink/60 hover:border-gold-400/40 hover:text-gold-700 transition-all shrink-0"
                >
                  {copiedEmail ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-4 text-sm text-ink/50">
                <span className="font-semibold">For questions & support</span>
                <a
                  href={`mailto:${brandInfo.email}`}
                  className="inline-flex items-center gap-1 text-gold-600 hover:text-gold-700 font-semibold"
                >
                  Send email <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          </Reveal>

          {/* WhatsApp Card */}
          <Reveal delay={120} className="h-full">
            <a
              href={whatsappLink("Hi Taj Tailor, I would like to inquire about your tailoring services.", brandInfo)}
              target="_blank"
              rel="noopener noreferrer"
              className="group block relative overflow-hidden rounded-[2rem] border border-gold-400/10 bg-white p-6 shadow-soft transition-all duration-500 hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.06)] hover:-translate-y-1 h-full flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20 group-hover:scale-105 transition-transform duration-500">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                      WhatsApp Support
                    </span>
                    <p className="font-display mt-0.5 text-base sm:text-lg text-ink group-hover:text-emerald-700 transition-colors break-all">
                      {brandInfo.whatsappDisplay}
                    </p>
                  </div>
                </div>
                <span className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5 text-emerald-600 group-hover:scale-105 transition-transform shrink-0">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-4 text-sm text-ink/50">
                <span className="font-semibold">Quick help & chat</span>
                <span className="text-emerald-600 font-semibold group-hover:underline">Chat now &rarr;</span>
              </div>
            </a>
          </Reveal>

          {/* Business Hours */}
          <Reveal delay={200} className="h-full">
            <div className="rounded-[2rem] border border-gold-400/10 bg-white p-6 shadow-soft hover:-translate-y-1 transition-all duration-500 hover:border-gold-400/20 hover:shadow-[0_0_30px_rgba(212,163,89,0.04)] h-full flex flex-col justify-between">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold-400/10 text-gold-600 ring-1 ring-gold-400/20">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-ink/45">
                    Support Hours
                  </span>
                  <p className="font-display mt-0.5 text-base text-ink font-semibold">Mon – Sat, 10 AM – 7 PM IST</p>
                </div>
              </div>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-ink/60 font-semibold">
                If you message us outside these hours, we will get back to you the next morning.
              </p>
            </div>
          </Reveal>

          {/* Follow Us */}
          <Reveal delay={280} className="h-full">
            <div className="rounded-[2rem] border border-gold-400/10 bg-white p-6 shadow-soft hover:-translate-y-1 transition-all duration-500 hover:border-gold-400/20">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-ink/50 block mb-4">Follow Us</span>
              <div className="flex items-center gap-3">
                <a
                  href={brandInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-ink/10 text-ink/60 transition-all hover:-translate-y-0.5 hover:border-gold-400 hover:text-gold-600 bg-white"
                >
                  <Instagram className="h-4.5 w-4.5" />
                </a>
                <a
                  href={brandInfo.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-ink/10 text-ink/60 transition-all hover:-translate-y-0.5 hover:border-gold-400 hover:text-gold-600 bg-white"
                >
                  <Facebook className="h-4.5 w-4.5" />
                </a>
                <a
                  href={brandInfo.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-ink/10 text-ink/60 transition-all hover:-translate-y-0.5 hover:border-gold-400 hover:text-gold-600 bg-white"
                >
                  <Youtube className="h-4.5 w-4.5" />
                </a>
              </div>
            </div>
          </Reveal>

        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <Reveal delay={120}>
            <ContactForm />
          </Reveal>
        </div>

      </div>

      {/* Store Location */}
      {mapEmbedSrc && (
        <Reveal delay={160} className="relative mt-16 sm:mt-24">
          {/* Ambient glow */}
          <div className="pointer-events-none absolute -left-10 top-1/2 h-[380px] w-[420px] -translate-y-1/2 rounded-full bg-gold-400/10 blur-[130px]" />
          <div className="pointer-events-none absolute -right-10 top-1/4 h-[300px] w-[340px] rounded-full bg-gold-600/5 blur-[120px]" />

          <div className="group relative overflow-hidden rounded-[2.5rem] border border-gold-400/20 bg-white p-3 shadow-xl transition-all duration-500 hover:border-gold-500/40 hover:shadow-2xl sm:p-4">
            {/* Top accent ribbon */}
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gold-gradient z-10" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(202,161,75,0.05),transparent_55%)]" />

            {/* Header */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 px-2.5 pb-5 pt-3 sm:px-3">
              <div className="flex items-center gap-3.5">
                <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold-gradient text-ink shadow-gold">
                  <MapPin className="h-5.5 w-5.5" />
                  <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                  </span>
                </span>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-600">Visit Our Store</span>
                  <p className="font-display mt-0.5 text-xl sm:text-2xl text-ink font-semibold">Find Us on the Map</p>
                </div>
              </div>

              {mapLinkHref && (
                <a
                  href={mapLinkHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold group/btn inline-flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider shadow-gold hover:scale-[1.03] transition-all duration-300"
                >
                  <Navigation className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                  Get Directions
                </a>
              )}
            </div>

            {/* Map frame */}
            <div className="relative overflow-hidden rounded-[1.75rem] border border-gold-400/15 shadow-inner">
              <div className="pointer-events-none absolute inset-2 z-10 rounded-[1.4rem] border border-white/40 sm:inset-3" />
              <iframe
                src={mapEmbedSrc}
                title="Taj Tailor store location"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[340px] w-full grayscale-[15%] contrast-[1.05] transition-all duration-500 group-hover:grayscale-0 sm:h-[460px]"
              />
              <span className="pointer-events-none absolute bottom-4 left-4 z-20 inline-flex items-center gap-1.5 rounded-full bg-gold-gradient px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-ink shadow-gold">
                <MapPin className="h-3 w-3" /> Taj Tailor
              </span>
            </div>
          </div>
        </Reveal>
      )}

      {/* FAQ Section */}
      <div className="mt-16 sm:mt-28 border-t border-ink/10 pt-14 sm:pt-20">
        <Reveal className="text-center max-w-xl mx-auto mb-10 sm:mb-16">
          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-600 mb-3 block">
            FAQs
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-ink">
            Frequently Asked Questions
          </h2>
          <div className="w-16 h-[1px] bg-gold-400/40 mx-auto mt-4" />
        </Reveal>

        <div className="mx-auto max-w-3xl space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <Reveal key={idx} delay={idx * 80}>
                <div
                  className="overflow-hidden rounded-[1.5rem] border border-ink/10 bg-white transition-all duration-300 hover:border-gold-400/30"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-gold-50/10"
                  >
                    <span className="font-display text-base sm:text-lg text-ink font-semibold pr-4">{faq.q}</span>
                    <ChevronDown
                      className={`h-4.5 w-4.5 shrink-0 text-gold-600 transition-transform duration-300 ${isOpen ? "rotate-180 text-gold-700" : ""
                        }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-0 text-base sm:text-lg leading-relaxed text-ink/60 font-semibold border-t border-ink/10 pt-4 animate-fadeUp">
                      {faq.a}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

    </div>
  );
}
