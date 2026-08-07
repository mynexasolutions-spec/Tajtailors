"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Home, Package, Phone, User } from "lucide-react";

export default function BottomNavClient({ callHref }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (pathname?.startsWith("/admin")) return null;
  // The garment-type picker has its own fixed bottom confirm bar.
  if (pathname?.includes("/choose/")) return null;

  const isAccountPath = pathname === "/account";
  const isProfileTab = isAccountPath && searchParams.get("tab") === "profile";
  const isOrdersTab = isAccountPath && !isProfileTab;

  const linkClass = (active) =>
    `flex flex-1 flex-col items-center justify-center gap-1.5 py-3 text-[12px] font-bold transition-colors ${
      active ? "text-gold-600" : "text-ink/55 hover:text-gold-600"
    }`;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-gold-400/15 bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.06)] sm:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <Link href="/" className={linkClass(pathname === "/")}>
        <Home className="h-6 w-6" strokeWidth={pathname === "/" ? 2.25 : 2} />
        Home
      </Link>
      <Link href="/account" className={linkClass(isOrdersTab)}>
        <Package className="h-6 w-6" strokeWidth={isOrdersTab ? 2.25 : 2} />
        Orders
      </Link>
      <a href={callHref} className={linkClass(false)}>
        <Phone className="h-6 w-6" />
        Call Us
      </a>
      <Link href="/account?tab=profile" className={linkClass(isProfileTab)}>
        <User className="h-6 w-6" strokeWidth={isProfileTab ? 2.25 : 2} />
        Account
      </Link>
    </nav>
  );
}
