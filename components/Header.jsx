"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  ShoppingBag,
  User,
  Heart,
  Search,
  Truck,
  Ruler,
  LifeBuoy,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import { logout } from "@/actions/auth";
import { BRAND } from "@/lib/constants";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Buy Fabric & Stitch", href: "/shop?type=fabric" },
  { label: "Stitch My Fabric", href: "/shop?type=outfit" },
  { label: "About", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

function UtilityBar({ message, brandInfo }) {
  return (
    <div className="relative overflow-hidden border-b border-gold-400/15 bg-ivory-deep">
      <div className="relative mx-auto flex max-w-wrap items-center justify-center gap-2.5 px-4 py-2 sm:justify-between sm:px-6 md:px-12">
        <p className="truncate text-xs font-medium tracking-wide text-gold-700 sm:text-sm">
          {message}
        </p>
        <div className="hidden shrink-0 items-center gap-5 text-sm font-medium text-ink/60 sm:flex">
          <Link href="/account/orders" className="flex items-center gap-1.5 transition-colors hover:text-gold-700">
            <Truck className="h-3.5 w-3.5 text-gold-600" /> Track Order
          </Link>
          <Link href="/about" className="flex items-center gap-1.5 transition-colors hover:text-gold-700">
            <Ruler className="h-3.5 w-3.5 text-gold-600" /> Measurement Guide
          </Link>
          <Link href="/contact" className="flex items-center gap-1.5 transition-colors hover:text-gold-700">
            <LifeBuoy className="h-3.5 w-3.5 text-gold-600" /> Help & Support
          </Link>
          <a href={`tel:${brandInfo.whatsappDisplay.replace(/\s/g, "")}`} className="flex items-center gap-1.5 transition-colors hover:text-gold-700">
            <FaWhatsapp className="h-3.5 w-3.5 text-[#25D366]" /> {brandInfo.whatsappDisplay}
          </a>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gold-gradient bg-[length:200%_200%] animate-shimmer" />
    </div>
  );
}

function Logo() {
  return (
    <Link href="/" className="group flex shrink-0 items-center">
      <Image
        src="/logo.png"
        alt="Taj Tailor"
        width={1672}
        height={941}
        priority
        className="h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105 sm:h-16"
      />
    </Link>
  );
}

export default function Header({ announcement, isLoggedIn = false, brandInfo = BRAND }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartCount, setDrawerOpen } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/shop?search=${encodeURIComponent(q)}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className={`sticky top-0 z-40 border-b border-ink/5 transition-colors duration-300 ${mobileOpen ? "bg-white" : "bg-white/90 backdrop-blur-lg"
      }`}>
      <UtilityBar message={announcement || "Welcome to Taj Tailor – Premium Tailoring at Your Doorstep"} brandInfo={brandInfo} />

      {/* Shimmering bottom hairline */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gold-gradient bg-[length:200%_200%] animate-shimmer" />

      {/* Main Navbar Row */}
      <div className="mx-auto flex max-w-wrap items-center justify-between gap-4 px-4 py-1 sm:px-6 sm:py-2 md:px-12">

        <Logo />

        {/* Center Links (Desktop) */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`group/link relative rounded-full px-4 py-2 text-[13px] font-medium uppercase tracking-wide transition-all duration-300 ${
                  isActive ? "text-gold-700 bg-gold-400/10" : "text-ink/70 hover:text-gold-700 hover:bg-gold-400/5"
                }`}
              >
                {link.label}
                {isActive ? (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gold-500 shadow-gold animate-pulse" />
                ) : (
                  <span className="absolute bottom-0.5 left-1/2 h-px w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold-300 to-transparent transition-all duration-300 group-hover/link:w-2/3" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Icons */}
        <div className="flex items-center gap-3">
          <span className="hidden h-6 w-px bg-gradient-to-b from-transparent via-gold-400/25 to-transparent lg:block" />

          {/* Search Toggle */}
          <button
            onClick={() => setSearchOpen((o) => !o)}
            aria-label="Search"
            className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border transition-all duration-300 hover:scale-105 hover:shadow-gold ${
              searchOpen
                ? "border-gold-400/40 bg-gold-400/10 text-gold-700"
                : "border-ink/10 bg-white text-ink/70 hover:border-gold-400/30 hover:bg-ivory-deep hover:text-gold-700"
            }`}
          >
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Account (Desktop) */}
          {isLoggedIn ? (
            <form action={logout} className="hidden sm:block">
              <Link
                href="/account"
                aria-label="Account"
                className="mr-2 hidden h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white text-ink/70 transition-all duration-300 hover:border-gold-400/30 hover:bg-ivory-deep hover:text-gold-700 hover:scale-105 sm:inline-flex"
              >
                <User className="h-4.5 w-4.5" />
              </Link>
            </form>
          ) : (
            <Link
              href="/account"
              aria-label="Account"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white text-ink/70 transition-all duration-300 hover:border-gold-400/30 hover:bg-ivory-deep hover:text-gold-700 hover:scale-105 hover:shadow-gold sm:flex"
            >
              <User className="h-4.5 w-4.5" />
            </Link>
          )}

          {/* Wishlist */}
          <Link
            href="/account"
            aria-label="Wishlist"
            className="hidden h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-ink/10 bg-white text-ink/70 transition-all duration-300 hover:border-gold-400/30 hover:bg-ivory-deep hover:text-gold-700 hover:scale-105 hover:shadow-gold sm:flex"
          >
            <Heart className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          </Link>

          {/* Cart Icon */}
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open cart"
            className="relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-ink/10 bg-white text-ink/70 transition-all duration-300 hover:border-gold-400/30 hover:bg-ivory-deep hover:text-gold-700 hover:scale-105 hover:shadow-gold"
          >
            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-gold-gradient text-[8px] sm:text-[9px] font-bold text-ink shadow-gold animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-ink/10 bg-white text-ink/70 hover:border-gold-400/30 hover:text-gold-700 lg:hidden transition-all"
          >
            <Menu className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />
          </button>
        </div>
      </div>

      {/* Search Panel */}
      {searchOpen && (
        <div className="absolute inset-x-0 top-full z-30 border-b border-gold-400/15 bg-white/95 backdrop-blur-lg animate-fadeUp">
          <form onSubmit={handleSearch} className="mx-auto flex max-w-wrap items-center gap-3 px-4 py-4 sm:px-6 md:px-12">
            <Search className="h-4.5 w-4.5 shrink-0 text-gold-600/70" />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fabrics, kurtas..."
              className="flex-1 bg-transparent text-base text-ink placeholder:text-ink/30 focus:outline-none"
            />
            <button type="submit" className="btn-gold px-5 py-2 text-xs font-semibold uppercase tracking-wide shrink-0">
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/10 text-ink/60 transition-all hover:border-gold-500/30 hover:text-gold-700"
            >
              <X className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-white lg:hidden animate-fadeUp">
          <div className="absolute inset-x-0 top-0 h-px bg-gold-gradient bg-[length:200%_200%] animate-shimmer" />
          <div className="flex items-center justify-between px-6 py-4 border-b border-gold-400/15">
            <Logo />

            {/* Close Toggle */}
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="group/close p-2 rounded-full border border-ink/10 text-ink/70 hover:text-gold-700 hover:border-gold-500/30 transition-all"
            >
              <X className="h-5 w-5 transition-transform duration-300 group-hover/close:rotate-90" />
            </button>
          </div>

          <nav className="flex flex-col gap-2 px-6 py-6 overflow-y-auto max-h-[80vh]">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-xl px-4 py-3 font-display text-lg tracking-wide transition-all ${pathname === link.href
                    ? "bg-gold-400/10 text-gold-700 font-medium"
                    : "text-ink hover:bg-ivory-deep hover:text-gold-700"
                  }`}
              >
                {link.label}
              </Link>
            ))}

            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="flex flex-1 items-center gap-2 rounded-xl px-4 py-3 font-display text-lg tracking-wide text-gold-700 bg-gold-400/5 border border-gold-400/20 hover:bg-gold-400/10 transition-all"
                >
                  <User className="h-5 w-5" />
                  My Account
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    aria-label="Log out"
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-ink/10 text-ink/70 hover:border-red-400/30 hover:bg-red-500/5 hover:text-red-500 transition-all"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 font-display text-lg tracking-wide text-ink hover:bg-ivory-deep hover:text-gold-700 transition-all"
              >
                Account Portal
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
