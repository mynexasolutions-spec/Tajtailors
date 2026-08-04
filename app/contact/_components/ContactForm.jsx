"use client";

import { useActionState, useState } from "react";
import { submitInquiry } from "@/actions/contact";
import { Send, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";

const INQUIRY_TOPICS = [
  { id: "recommendation", label: "Fabric Advice" },
  { id: "bespoke", label: "Custom Stitching" },
  { id: "order", label: "Order Status" },
  { id: "general", label: "General Query" },
];

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitInquiry, {});
  const [selectedTopic, setSelectedTopic] = useState("recommendation");
  const [message, setMessage] = useState("");

  if (state.success) {
    return (
      <div className="relative overflow-hidden rounded-[2rem] border border-gold-400/25 bg-white p-8 text-center shadow-soft md:p-12 animate-fadeUp">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-400/10 text-gold-600 ring-8 ring-gold-400/5">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <span className="eyebrow mt-6 inline-flex">Message Received</span>
        <h3 className="font-display mt-3 text-2xl text-ink font-semibold">Thank You for Your Message</h3>
        <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-ink/75 font-semibold">
          We have received your message. Our team will review it and reply to you in a few hours.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="rounded-full border border-gold-400/30 bg-ivory-deep px-8 py-3 text-xs font-semibold uppercase tracking-wider text-ink hover:border-gold-400 hover:bg-gold-400/10 transition-all"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-[2rem] border border-gold-400/15 bg-white p-6 shadow-soft md:p-10 hover:border-gold-400/30 transition-all duration-500 hover:shadow-[0_0_50px_rgba(212,163,89,0.06)]">
      {/* Background soft ambient light */}
      <div className="pointer-events-none absolute -left-10 top-0 h-48 w-48 rounded-full bg-gold-400/5 blur-3xl" />

      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 mb-2">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-600">
            <Sparkles className="h-3.5 w-3.5" /> Send a Message
          </span>
          <span className="flex items-center gap-1.5 text-sm text-gold-600/70 font-semibold">
            <ShieldCheck className="h-4 w-4 text-gold-500" /> Support Team
          </span>
        </div>
        <h3 className="font-display text-2xl sm:text-3xl text-ink font-semibold">
          How can we help you?
        </h3>
      </div>

      <form action={formAction} className="space-y-6">
        {state.error && (
          <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-xs text-red-300 flex items-center gap-2 animate-fadeUp">
            <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
            {state.error}
          </div>
        )}

        {/* Topic Pills */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink/50 mb-3">
            Select Topic
          </label>
          <div className="flex flex-wrap gap-2">
            {INQUIRY_TOPICS.map((topic) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => setSelectedTopic(topic.id)}
                className={`rounded-full px-5 py-2.5 text-xs transition-all duration-300 ${selectedTopic === topic.id
                    ? "bg-gold-gradient text-ink font-semibold shadow-gold hover:scale-[1.02]"
                    : "border border-ink/10 bg-ivory-deep text-ink/65 font-semibold hover:border-gold-400/40 hover:text-ink"
                  }`}
              >
                {topic.label}
              </button>
            ))}
          </div>
          <input
            type="hidden"
            name="topic"
            value={INQUIRY_TOPICS.find((t) => t.id === selectedTopic)?.label || ""}
          />
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink/50 mb-2">
              Your Name <span className="text-gold-400">*</span>
            </label>
            <input
              required
              name="name"
              type="text"
              placeholder="e.g. Rohan Mehta"
              className="w-full rounded-2xl border border-ink/10 bg-ivory-deep px-4 py-4 text-base text-ink font-semibold placeholder:text-ink/35 transition-all duration-500 focus:border-gold-400/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/30"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/50 mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="yourname@gmail.com"
                className="w-full rounded-2xl border border-ink/10 bg-ivory-deep px-4 py-4 text-base text-ink font-semibold placeholder:text-ink/35 transition-all duration-500 focus:border-gold-400/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/50 mb-2">
                Phone / WhatsApp
              </label>
              <input
                name="phone"
                type="tel"
                placeholder="+91 90123 45678"
                className="w-full rounded-2xl border border-ink/10 bg-ivory-deep px-4 py-4 text-base text-ink font-semibold placeholder:text-ink/35 transition-all duration-500 focus:border-gold-400/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/30"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/50">
                Your Message <span className="text-gold-400">*</span>
              </label>
              <span className="text-[10px] text-ink/35">
                {message.length} / 500 chars
              </span>
            </div>
            <textarea
              required
              name="message"
              rows={4}
              maxLength={500}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your fabric, stitching, or measurement query..."
              className="w-full rounded-2xl border border-ink/10 bg-ivory-deep px-4 py-4 text-base text-ink font-semibold placeholder:text-ink/35 transition-all duration-500 focus:border-gold-400/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-400/20 resize-none hover:border-gold-400/30"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="btn-gold group w-full sm:w-fit px-8 py-4 text-sm font-semibold tracking-widest uppercase transition-all duration-500 disabled:opacity-60 shadow-[0_4px_20px_rgba(212,163,89,0.1)] hover:shadow-[0_4px_25px_rgba(212,163,89,0.25)] hover:-translate-y-0.5"
        >
          {pending ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
              Sending Message...
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <Send className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              Send Message
            </span>
          )}
        </button>
      </form>
    </div>
  );
}
