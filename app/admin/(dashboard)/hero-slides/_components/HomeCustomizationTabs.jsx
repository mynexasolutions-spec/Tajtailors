"use client";

import { useState } from "react";
import { GalleryHorizontal, Sparkles, Layers, Route, Shirt, ShoppingBag, ShieldCheck, Star, MessageSquareHeart } from "lucide-react";
import HeroSlideManager from "./HeroSlideManager";
import HomeSectionsManager from "./HomeSectionsManager";

const TABS = [
  { id: "hero", label: "Hero", icon: GalleryHorizontal },
  { id: "marquee", label: "Marquee Strip", icon: Sparkles, sections: ["marquee"] },
  { id: "threeways", label: "3 Easy Ways", icon: Layers, sections: ["threeways"] },
  { id: "howitworks", label: "How It Works", icon: Route, sections: ["howitworks"] },
  { id: "mentailoring", label: "Men Tailoring", icon: Shirt, sections: ["mentailoring"] },
  { id: "fabrics", label: "Premium Fabrics", icon: Shirt, sections: ["fabrics"] },
  { id: "kurtas", label: "Kurta Collection", icon: ShoppingBag, sections: ["kurtas"] },
  { id: "spotlight", label: "Featured Spotlight", icon: Star, sections: ["spotlight"] },
  { id: "testimonials", label: "Testimonials", icon: MessageSquareHeart, sections: ["testimonials"] },
  { id: "trustbar", label: "Trust Bar", icon: ShieldCheck, sections: ["trustbar"] },
];

export default function HomeCustomizationTabs({ slides, settings }) {
  const [activeId, setActiveId] = useState(TABS[0].id);
  const activeTab = TABS.find((t) => t.id === activeId);

  return (
    <div>
      <div className="mb-6 -mx-4 flex gap-2 overflow-x-auto border-b border-gold-400/15 px-4 pb-4 scrollbar-thin scrollbar-thumb-gold-400/10 scrollbar-track-transparent sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {TABS.map((tab) => {
          const active = tab.id === activeId;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveId(tab.id)}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border px-4 py-2 text-xs font-semibold transition-colors duration-300 ${active
                  ? "border-gold-400/40 bg-gold-400/10 text-gold-700"
                  : "border-ink/10 bg-white text-ink/50 hover:border-gold-400/30 hover:text-ink"
                }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab.id === "hero" ? (
        <HeroSlideManager slides={slides} settings={settings} />
      ) : (
        <HomeSectionsManager key={activeTab.id} settings={settings} only={activeTab.sections} />
      )}
    </div>
  );
}
