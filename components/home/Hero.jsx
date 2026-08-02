"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Scissors, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import SherwaniGlyph from "@/components/SherwaniGlyph";
import StarRating from "@/components/StarRating";

const DEFAULT_SLIDES = [
  {
    title: "Doorstep Tailoring,\nPerfect Fitting",
    subtitle: "Send your fabric, share your measurements, and we'll stitch and deliver it right to your door.",
    button_text: "Book Your Order Now",
    button_link: "/shop",
    image_url: "/herobanner.png",
  },
];

export default function Hero({
  slides = [],
  badgeText = "",
  ratingValue = "",
  reviewsText = "",
  shippedText = "",
}) {
  const activeSlides = slides.length > 0 ? slides : DEFAULT_SLIDES;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000); // 6 seconds slide interval
    return () => clearInterval(timer);
  }, [currentIndex, activeSlides.length]);

  const handleNext = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
      setAnimating(false);
    }, 500); // Match CSS transition duration
  };

  const handlePrev = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
      setAnimating(false);
    }, 500);
  };

  const currentSlide = activeSlides[currentIndex];
  const image = currentSlide?.image_url || null;
  const title = currentSlide?.title || "";
  const subtitle = currentSlide?.subtitle || "";
  const buttonText = currentSlide?.button_text || "";
  const buttonLink = currentSlide?.button_link || "";
  const titleLines = title ? title.split("\n") : [];
  const hasRating = ratingValue !== "" && ratingValue !== null && ratingValue !== undefined;
  const parsedRating = hasRating ? Number.parseFloat(ratingValue) || 0 : 0;
  const hasReviews = Boolean(reviewsText);
  const hasShipped = Boolean(shippedText);
  const showRatingRow = hasRating || hasReviews;
  const showSocialProof = showRatingRow || hasShipped;

  const goToSlide = (idx) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex(idx);
      setAnimating(false);
    }, 500);
  };

  // Text overlaid on the background image — sized down aggressively on mobile so it fits over a 16:9 crop
  // Every piece here is optional: fields left empty in the DB simply don't render, no placeholder fallback text.
  const heroText = (
    <>
      {badgeText && (
        <span className="inline-flex items-center gap-1.5 sm:gap-3 px-2.5 sm:px-5 py-1 sm:py-2 rounded-full border border-gold-300/30 bg-black/40 text-[9px] sm:text-sm font-semibold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gold-300 backdrop-blur-md mb-2 sm:mb-6 w-fit shadow-[0_0_30px_rgba(212,163,89,0.15)] ring-1 ring-gold-300/10">
          <Scissors className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-gold-600" />
          {badgeText}
        </span>
      )}

      {titleLines.length > 0 && (
        <h1 className="whitespace-pre-line font-display text-2xl sm:text-6xl lg:text-[4.5rem] leading-[1.15] sm:leading-[1.08] text-white font-medium">
          {titleLines.map((line, idx) => (
            <span key={idx} className="block">
              {idx === titleLines.length - 1 ? (
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700 drop-shadow-[0_2px_15px_rgba(212,175,55,0.15)]">
                  {line}
                </span>
              ) : (
                line
              )}
            </span>
          ))}
        </h1>
      )}

      {subtitle && (
        <p className="hidden sm:block sm:mt-8 max-w-xl text-2xl leading-relaxed text-white/80 font-light">
          {subtitle}
        </p>
      )}

      {buttonText && buttonLink && (
        <div className="mt-3 sm:mt-10 flex flex-wrap items-center gap-2 sm:gap-5">
          <Link
            href={buttonLink}
            className="group btn-gold !rounded-lg px-4 sm:px-10 py-2 sm:py-4 text-[11px] sm:text-base font-semibold uppercase tracking-wider hover:scale-[1.03] transition-all shadow-[0_4px_20px_rgba(212,175,55,0.15)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.3)] animate-shimmer bg-[length:200%_200%]"
          >
            {buttonText}
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      )}

      {/* Social Proof — hidden entirely if none of rating/reviews/shipped are set */}
      {showSocialProof && (
        <div className="mt-3 sm:mt-12 pt-2 sm:pt-8 border-t border-gold-400/15 flex flex-wrap items-center gap-x-4 sm:gap-x-8 gap-y-1 sm:gap-y-4">
          {showRatingRow && (
            <div className="flex items-center gap-1.5 sm:gap-3">
              {hasRating && <StarRating rating={parsedRating} size={12} />}
              <span className="text-[11px] sm:text-sm font-semibold uppercase tracking-widest text-gold-300">
                {hasRating && parsedRating.toFixed(1)}
                {hasRating && hasReviews && " · "}
                {hasReviews && reviewsText}
              </span>
            </div>
          )}
          {showRatingRow && hasShipped && <div className="hidden sm:block h-5 w-px bg-white/20" />}
          {hasShipped && (
            <span className="hidden sm:inline text-[9px] sm:text-sm font-semibold uppercase tracking-widest text-white/70">{shippedText}</span>
          )}
        </div>
      )}
    </>
  );

  // Shared slide navigation controls (prev/next + dots)
  const navControls = (
    <>
      <button
        onClick={handlePrev}
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gold-400/25 bg-black/40 text-gold-300 hover:text-gold-100 hover:border-gold-400/50 hover:scale-110 hover:shadow-[0_0_20px_rgba(212,163,89,0.15)] flex items-center justify-center backdrop-blur-sm transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <div className="flex gap-1.5">
        {activeSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === idx ? "w-6 bg-gold-500 shadow-[0_0_10px_rgba(202,161,75,0.5)]" : "w-1.5 bg-gold-400/30 hover:bg-gold-400/60"
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      <button
        onClick={handleNext}
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gold-400/25 bg-black/40 text-gold-300 hover:text-gold-100 hover:border-gold-400/50 hover:scale-110 hover:shadow-[0_0_20px_rgba(212,163,89,0.15)] flex items-center justify-center backdrop-blur-sm transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </>
  );

  return (
    <section className="relative overflow-hidden bg-ink aspect-[4/3] sm:aspect-auto sm:min-h-[90vh] flex items-center pt-6 sm:pt-20 pb-6 sm:pb-20 select-none">

      {/* Background Image/Fallback with Light Overlays for Readability */}
      <div className="absolute inset-0 z-0">
        {image ? (
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={image}
              alt="Taj Tailor background"
              fill
              priority
              className={`object-cover animate-kenBurns transition-opacity duration-700 ease-in-out ${
                animating ? "opacity-0" : "opacity-100"
              }`}
            />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-ivory to-ivory-deep">
            <SherwaniGlyph className="h-2/3 w-auto text-gold-400/25 animate-floatSlow" />
          </div>
        )}
        {/* Dark gradients to lighten... darken background for light-text readability */}
        <div className="absolute inset-0 bg-ink/60 sm:bg-ink/50 md:hidden" />
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/35 to-transparent" />
        {/* Subtle top/bottom shadow overlay to blend with header/footer */}
        <div className="absolute inset-x-0 top-0 h-16 sm:h-32 bg-gradient-to-b from-ink/40 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-16 sm:h-32 bg-gradient-to-t from-ink/40 to-transparent pointer-events-none" />
      </div>

      {/* Immersive background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 opacity-40">
        <div className="absolute -left-32 top-1/4 h-[500px] w-[500px] rounded-full bg-gold-500/5 blur-[120px]" />
        <div className="absolute -right-20 top-10 h-[600px] w-[600px] rounded-full bg-gold-300/5 blur-[150px]" />
        <div className="absolute left-1/3 bottom-0 h-[400px] w-[400px] rounded-full bg-gold-600/5 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-wrap px-4 sm:px-6 md:px-12 w-full z-10">
        {/* Content Container (Left-aligned overlay) */}
        <div className={`max-w-2xl flex flex-col justify-center animate-fadeUp transition-all duration-500 ease-in-out ${
          animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}>
          {heroText}
        </div>
      </div>

      {/* Manual Slide Navigation Controls */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-2 right-3 sm:bottom-8 sm:right-6 md:right-12 flex items-center gap-1.5 sm:gap-3 z-30">
          {navControls}
        </div>
      )}

      {/* Scroll cue */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 hidden sm:flex justify-center z-20">
        <div className="flex flex-col items-center gap-1 animate-bounce opacity-60">
          <ChevronDown className="h-4 w-4 text-gold-600" />
        </div>
      </div>

    </section>
  );
}
