"use client";

import { usePathname } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import { Phone } from "lucide-react";

export default function FloatingButtonsClient({ whatsappHref, callHref }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  // The garment-type picker has its own fixed bottom confirm bar — the call/
  // WhatsApp bubbles would sit on top of it, so skip them on this page.
  if (pathname?.includes("/choose/")) return null;

  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-50 flex flex-col items-center gap-3 select-none">
      <a
        href={callHref}
        aria-label="Call us"
        className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gold-gradient p-3 sm:p-3.5 shadow-gold transition-transform hover:scale-110"
      >
        <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-ink" />
      </a>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#25D366] p-3 sm:p-3.5 shadow-[0_10px_30px_-8px_rgba(37,211,102,0.6)] transition-transform hover:scale-110"
      >
        <FaWhatsapp className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
      </a>
    </div>
  );
}
