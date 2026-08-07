import Image from "next/image";
import Link from "next/link";
import { Scissors } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function MenTailoringBanner({
  imageUrl = "/herobanner.png",
  ctaLink = "/contact",
  className = "",
  title = "",
  itemsText = "",
  priceText = "",
}) {
  const items = itemsText
    ? itemsText.split("\n").map((i) => i.trim()).filter(Boolean)
    : ["Sherwani", "Blazer", "Jacket", "Shirt"];

  const titleLines = title
    ? title.split("\n").map((t) => t.trim())
    : ["Men", "Tailoring"];

  const displayPrice = priceText || "₹ 999/- Onwards";

  return (
    <Reveal className={`relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#A72B45] via-[#C83B55] to-[#7F1E31] p-6 sm:p-8 shadow-[0_20px_50px_rgba(167,43,69,0.18)] border border-rose-800/25 ${className}`}>
      {/* Subtle Accent Lights */}
      <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col gap-5 h-full justify-between">
        
        {/* Main content grid - details 6 columns, image 6 columns to match FeaturedSpotlight exactly */}
        <div className="grid grid-cols-12 items-center gap-4 md:gap-8">
          
          {/* Left Column (Text Details) */}
          <div className="col-span-6 text-white flex flex-col justify-center">
            <span className="mb-2.5 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[8px] sm:text-[9px] font-bold tracking-[0.15em] text-white/90 uppercase">
              <Scissors className="h-2.5 w-2.5" /> Tailoring
            </span>
            
            {titleLines[0] && (
              <h3 className="font-display text-3xl sm:text-5xl md:text-5xl font-extrabold tracking-tight leading-none text-white">
                {titleLines[0]}
              </h3>
            )}
            {titleLines[1] && (
              <h4 className="font-display text-2xl sm:text-4xl md:text-4xl font-light tracking-wide leading-none text-white/80">
                {titleLines[1]}
              </h4>
            )}

            {/* Bullets */}
            <ul className="mt-3.5 space-y-1.5 sm:space-y-2 text-sm sm:text-base md:text-lg font-bold">
              {items.map((item) => (
                <li key={item} className="flex items-center gap-2 text-white/90">
                  <span className="text-white/60 font-bold">-</span>
                  {item}
                </li>
              ))}
            </ul>

            {/* Price Box */}
            <div className="mt-4 w-fit rounded-lg bg-[#FFF2F2] px-4 py-2 shadow-sm border border-red-100">
              <p className="text-xs sm:text-sm md:text-base font-black text-[#A72B45] uppercase tracking-wider">
                {displayPrice}
              </p>
            </div>
          </div>

          {/* Right Column (Model Image - Exact matching aspect ratio and 6-column span) */}
          <div className="col-span-6 relative aspect-[3/4] md:aspect-[4/5] w-full overflow-hidden rounded-2xl shrink-0">
            <Image
              src={imageUrl}
              alt="Men Tailoring"
              fill
              sizes="(max-width: 640px) 180px, 450px"
              className="object-cover"
              priority
            />
          </div>

        </div>

        {/* Bottom Button Row */}
        <div className="mt-2">
          <Link
            href={ctaLink || "/contact"}
            className="inline-flex w-fit items-center justify-center rounded-xl bg-[#121212] px-8 py-3.5 text-center text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white shadow-xl hover:bg-white hover:text-[#121212] active:scale-[0.99] transition-all duration-300"
          >
            Book Consultation
          </Link>
        </div>

      </div>
    </Reveal>
  );
}
