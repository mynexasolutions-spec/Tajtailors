"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  ChevronRight,
  LogOut,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { logout } from "@/actions/auth";
import { BRAND } from "@/lib/constants";


function UtilityBar({ brandInfo, announcement }) {
  if (!announcement) return null;

  return (
    <div className="relative overflow-hidden border-b border-gold-400/15 bg-ink text-white/95">
      <div className="relative mx-auto flex max-w-wrap items-center justify-center px-4 py-2 sm:px-6 md:px-12">
        <p className="flex items-center text-xs font-semibold tracking-wider text-gold-200 uppercase sm:text-xs text-center">
          {announcement}
        </p>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gold-gradient bg-[length:200%_200%] animate-shimmer" />
    </div>
  );
}

function Logo({ scrolled }) {
  return (
    <Link href="/" className="group flex shrink-0 items-center">
      <Image
        src="/logo.png"
        alt="Taj Tailor"
        width={1672}
        height={941}
        priority
        className={`w-auto object-contain transition-all duration-500 group-hover:scale-105 ${scrolled ? "h-11 sm:h-12" : "h-14 sm:h-16"
          }`}
      />
    </Link>
  );
}

// Header links to /shop carry their own ?type= (e.g. "Buy Fabric & Stitch" ->
// /shop?type=fabric), which pathname alone can't distinguish — plain "Shop"
// and the two ?type= links would otherwise all read as active together since
// they share the same pathname. Compare the query too, and require an exact
// match (no stray params) so a link is only "active" when the current URL is
// really that link, not a superset of it.
function computeIsActive(href, pathname, searchParams) {
  const [linkPath, linkQuery = ""] = href.split("?");
  if (pathname !== linkPath) return false;
  const linkParams = new URLSearchParams(linkQuery);
  const currentParams = new URLSearchParams(searchParams.toString());
  linkParams.delete("page");
  currentParams.delete("page");
  return linkParams.toString() === currentParams.toString();
}

function DesktopNavLink({ link, isActive }) {
  return (
    <Link
      href={link.href}
      className={`group/link relative rounded-full px-4 py-2 text-[13px] font-medium uppercase tracking-wide transition-all duration-300 ${isActive ? "text-gold-700 bg-gold-400/10" : "text-ink/70 hover:text-gold-700 hover:bg-gold-400/5"
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
}

// useSearchParams needs its own Suspense boundary (Next.js app router
// requirement), so the active-state lookup lives in this small wrapper
// instead of the main Header body — the fallback below renders the same
// link, just without the active state, so there's nothing to flash.
function DesktopNavLinkActive({ link }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return <DesktopNavLink link={link} isActive={computeIsActive(link.href, pathname, searchParams)} />;
}

function MobileNavLink({ link, isActive, onClick }) {
  return (
    <Link
      href={link.href}
      onClick={onClick}
      className={`rounded-xl px-4 py-3 font-display text-lg tracking-wide transition-all ${isActive
        ? "bg-gold-400/10 text-gold-700 font-medium"
        : "text-ink hover:bg-ivory-deep hover:text-gold-700"
        }`}
    >
      {link.label}
    </Link>
  );
}

function MobileNavLinkActive({ link, onClick }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return <MobileNavLink link={link} isActive={computeIsActive(link.href, pathname, searchParams)} onClick={onClick} />;
}

export default function Header({ announcement, isLoggedIn = false, brandInfo = BRAND }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const { cartCount, setDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/shop?search=${encodeURIComponent(q)}`);
      setSearchOpen(false);
    }
  };

  const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    {
      label: "Buy Fabric & Stitch",
      href: "/shop?type=fabric",
      megaMenu: (
        <div className="grid grid-cols-3 gap-8 p-8 text-left">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold-700">Premium Fabrics</h4>
            <ul className="space-y-2.5">
              {[
                "Pure Giza Cotton",
                "Premium Irish Linen",
                "Luxury Merino Wool",
                "Banarasi Silk & Brocade",
                "Royal Velvet Collection"
              ].map((f) => (
                <li key={f}>
                  <Link href="/shop?type=fabric" className="text-sm text-ink/75 hover:text-gold-600 transition-colors flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-gold-400" /> {f}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold-700">Bespoke Outfits</h4>
            <ul className="space-y-2.5">
              {[
                "Royal Sherwani",
                "Jodhpuri & Bandhgala",
                "Modern Indowestern",
                "Classic Suit & Blazer",
                "Designer Kurta Pajama"
              ].map((s) => (
                <li key={s}>
                  <Link href="/shop?type=outfit" className="text-sm text-ink/75 hover:text-gold-600 transition-colors flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-gold-400" /> {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-gold-50/50 border border-gold-200/50 p-5 flex flex-col justify-between">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-gold-500 text-[10px] font-bold text-white uppercase tracking-wider mb-3">
                Craftsmanship
              </span>
              <h5 className="font-display text-base font-bold text-ink mb-1.5">
                The Royal Tailoring Experience
              </h5>
              <p className="text-xs leading-relaxed text-ink/65">
                Every detail custom-curated, from custom buttons to premium lining. Tailored to your exact posture by master artisans.
              </p>
            </div>
            <Link href="/shop?type=fabric" className="mt-4 inline-flex items-center justify-center rounded-full bg-ink px-4 py-2 text-xs font-bold text-white hover:bg-gold-600 hover:text-ink transition-all">
              Start Designing &rarr;
            </Link>
          </div>
        </div>
      )
    },
    {
      label: "Stitch My Fabric",
      href: "/shop?type=outfit",
      megaMenu: (
        <div className="grid grid-cols-3 gap-8 p-8 text-left">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold-700">How It Works</h4>
            <ul className="space-y-3">
              {[
                { step: "1. Book Service", desc: "Select outfit type and secure your slot" },
                { step: "2. Doorstep Pickup", desc: "We collect your fabric from your home" },
                { step: "3. Master Stitching", desc: "Crafted according to your exact fit" },
                { step: "4. Trial & Delivery", desc: "Free alterations at your convenience" }
              ].map((item, idx) => (
                <li key={idx} className="space-y-0.5">
                  <span className="block text-xs font-bold text-ink">{item.step}</span>
                  <span className="block text-[11px] text-ink/60 leading-normal">{item.desc}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold-700">Stitching Rates</h4>
            <ul className="space-y-2.5">
              {[
                { outfit: "Custom Sherwani", price: "₹4,999" },
                { outfit: "Designer Blazer / Suit", price: "₹3,499" },
                { outfit: "Waistcoat / Nehru Jacket", price: "₹1,499" },
                { outfit: "Premium Kurta Pajama", price: "₹1,199" },
                { outfit: "Bespoke Trousers", price: "₹699" }
              ].map((r, idx) => (
                <li key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-ink/75 hover:text-gold-600 transition-colors">{r.outfit}</span>
                  <span className="font-bold text-gold-700 text-xs">{r.price}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-ink text-white p-5 flex flex-col justify-between shadow-lg">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-gold-gradient text-[10px] font-bold text-ink uppercase tracking-wider mb-3">
                Fit Guarantee
              </span>
              <h5 className="font-display text-base font-bold text-gold-100 mb-1.5">
                100% Custom Fit Promise
              </h5>
              <p className="text-xs leading-relaxed text-white/70">
                Not a perfect fit? No worries! We provide complimentary pickup and adjustments until you are completely satisfied.
              </p>
            </div>
            <Link href="/contact" className="mt-4 inline-flex items-center justify-center rounded-full bg-gold-gradient px-4 py-2 text-xs font-bold text-ink hover:opacity-90 transition-all">
              Contact Designer &rarr;
            </Link>
          </div>
        </div>
      )
    },
    { label: "About", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${mobileOpen
      ? "bg-white"
      : scrolled
        ? "bg-white/80 backdrop-blur-xl border-b border-gold-500/10 shadow-soft"
        : "bg-white/95 backdrop-blur-lg border-b border-ink/5"
      }`}>
      <UtilityBar brandInfo={brandInfo} announcement={announcement} />

      {/* Shimmering bottom hairline */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gold-gradient bg-[length:200%_200%] animate-shimmer" />

      {/* Main Navbar Row */}
      <div className="mx-auto flex max-w-wrap items-center justify-between gap-4 px-4 py-1 sm:px-6 sm:py-2 md:px-12">

        <Logo />

        {/* Center Links (Desktop) */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Suspense key={link.label} fallback={<DesktopNavLink link={link} isActive={false} />}>
              <DesktopNavLinkActive link={link} />
            </Suspense>
          ))}
        </nav>

        {/* Right Side Icons */}
        <div className="flex items-center gap-3">
          <span className="hidden h-6 w-px bg-gradient-to-b from-transparent via-gold-400/25 to-transparent lg:block" />

          {/* Search Toggle */}
          <button
            onClick={() => setSearchOpen((o) => !o)}
            aria-label="Search"
            className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border transition-all duration-300 hover:scale-105 hover:shadow-gold ${searchOpen
              ? "border-gold-400/40 bg-gold-400/10 text-gold-700"
              : "border-ink/10 bg-white text-ink/70 hover:border-gold-400/30 hover:bg-ivory-deep hover:text-gold-700"
              }`}
          >
            <Search className="h-5 w-5" />
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
            href="/wishlist"
            aria-label="Wishlist"
            className="relative hidden h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-ink/10 bg-white text-ink/70 transition-all duration-300 hover:border-gold-400/30 hover:bg-ivory-deep hover:text-gold-700 hover:scale-105 hover:shadow-gold sm:flex"
          >
            <Heart className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-gold-gradient text-[8px] sm:text-[9px] font-bold text-ink shadow-gold">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open cart"
            className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-ink/10 bg-white text-ink/70 transition-all duration-300 hover:border-gold-400/30 hover:bg-ivory-deep hover:text-gold-700 hover:scale-105 hover:shadow-gold"
          >
            <ShoppingBag className="h-5 w-5" />
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
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-ink/10 bg-white text-ink/70 hover:border-gold-400/30 hover:text-gold-700 lg:hidden transition-all"
          >
            <Menu className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* Search Panel */}
      {searchOpen && (
        <div className="absolute inset-x-0 top-full z-30 border-b border-gold-400/15 bg-white/95 backdrop-blur-lg animate-fadeUp">
          <form onSubmit={handleSearch} className="mx-auto flex max-w-wrap items-center gap-2 px-3 py-3 sm:gap-3 sm:px-6 md:px-12">
            <Search className="h-4 w-4 shrink-0 text-gold-600/70" />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fabrics, kurtas..."
              className="flex-1 bg-transparent text-sm sm:text-base text-ink placeholder:text-ink/30 focus:outline-none"
            />
            <button type="submit" className="btn-gold px-3.5 py-1.5 text-[11px] sm:px-5 sm:py-2 sm:text-xs font-semibold uppercase tracking-wide shrink-0">
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border border-ink/10 text-ink/60 transition-all hover:border-gold-500/30 hover:text-gold-700"
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
              <Suspense
                key={link.label}
                fallback={<MobileNavLink link={link} isActive={false} onClick={() => setMobileOpen(false)} />}
              >
                <MobileNavLinkActive link={link} onClick={() => setMobileOpen(false)} />
              </Suspense>
            ))}

            <Link
              href="/wishlist"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between rounded-xl px-4 py-3 font-display text-lg tracking-wide text-ink hover:bg-ivory-deep hover:text-gold-700 transition-all"
            >
              <span className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-gold-500" />
                Wishlist
              </span>
              {wishlistCount > 0 && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-gradient text-[10px] font-bold text-ink shadow-gold">
                  {wishlistCount}
                </span>
              )}
            </Link>

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
                    <LogOut className="h-5 w-5" />
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

