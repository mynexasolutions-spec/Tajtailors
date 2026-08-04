"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderTree,
  Package,
  Shirt,
  Sparkles,
  ShoppingCart,
  Users,
  Star,
  MessageSquare,
  LayoutTemplate,
  Quote,
  Megaphone,
  Tag,
  Truck,
  Layers,
  UserCog,
  Settings,
  X,
  LogOut,
} from "lucide-react";
import { useAdminSidebar } from "@/context/AdminSidebarContext";
import { adminLogout } from "@/actions/auth";

const NAV_GROUPS = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Catalog",
    items: [
      { label: "Categories", href: "/admin/categories", icon: FolderTree },
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Garment Types", href: "/admin/garment-types", icon: Shirt },
      { label: "Extra Work", href: "/admin/extra-work", icon: Sparkles },
    ],
  },
  {
    title: "Sales",
    items: [
      { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Reviews", href: "/admin/reviews", icon: Star },
      { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Home Customization", href: "/admin/hero-slides", icon: LayoutTemplate },
      { label: "Testimonials", href: "/admin/testimonials", icon: Quote },
      { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Site Settings", href: "/admin/settings", icon: Settings },
      { label: "Coupons", href: "/admin/settings/coupons", icon: Tag },
      { label: "Shipping Settings", href: "/admin/settings/shipping", icon: Truck },
      { label: "Quantity Discount", href: "/admin/settings/quantity-discount", icon: Layers },
      { label: "My Profile", href: "/admin/settings/profile", icon: UserCog },
    ],
  },
];

export default function AdminSidebar({ adminName = "Admin", badges = {} }) {
  const pathname = usePathname();
  const { mobileOpen, setMobileOpen } = useAdminSidebar();
  const initial = adminName.trim().charAt(0).toUpperCase();

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-gold-400/15 bg-gradient-to-b from-white via-ivory to-ivory-deep shadow-2xl transition-transform duration-300 lg:static lg:h-screen lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top accent line */}
        <div className="h-px w-full shrink-0 bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />

        <div className="relative flex h-16 shrink-0 items-center gap-3 border-b border-gold-400/15 px-5">
          <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-gold-400/10 blur-3xl" />
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold-400/20 bg-gradient-to-tr from-gold-500/10 to-gold-400/20 p-1 shadow-[0_0_15px_rgba(212,163,89,0.15)]">
            <Image src="/logo.png" alt="Taj Tailor" width={80} height={40} className="h-full w-full object-contain" />
          </div>
          <div className="relative flex-1 overflow-hidden">
            <p className="truncate text-sm font-semibold tracking-wider text-ink">Taj Tailor</p>
            <p className="truncate text-[10px] uppercase tracking-[0.2em] text-gold-600/80 font-semibold">Admin Panel</p>
          </div>
          <button onClick={() => setMobileOpen(false)} className="relative p-1 text-ink/50 hover:text-ink lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-7 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-gold-400/5 scrollbar-track-transparent">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-2">
              <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-600/60">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active =
                    item.href === "/admin" || item.href === "/admin/settings"
                      ? pathname === item.href
                      : pathname.startsWith(item.href);
                  const badgeCount = badges[item.href];
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`group relative flex items-center gap-3 rounded-xl border-l-2 px-3 py-2.5 text-sm font-medium tracking-wide transition-all duration-300 ${
                        active
                          ? "border-gold-400 bg-gradient-to-r from-gold-400/15 to-transparent text-gold-700 shadow-[inset_1px_0_0_rgba(212,163,89,0.1)]"
                          : "border-transparent text-ink/55 hover:border-gold-400/30 hover:bg-white hover:text-ink hover:translate-x-0.5"
                      }`}
                    >
                      <item.icon
                        className={`h-4 w-4 shrink-0 transition-colors duration-300 ${
                          active ? "text-gold-600 filter drop-shadow-[0_0_5px_rgba(212,163,89,0.35)]" : "text-ink/40 group-hover:text-gold-600/80"
                        }`}
                      />
                      <span className="flex-1">{item.label}</span>
                      {!!badgeCount && (
                        <span
                          className={`flex h-4.5 min-w-[1.125rem] items-center justify-center rounded-full px-1 text-[9px] font-bold ${
                            active ? "bg-gold-400/25 text-gold-700" : "bg-red-500/15 text-red-600 group-hover:bg-red-500/20"
                          }`}
                        >
                          {badgeCount > 99 ? "99+" : badgeCount}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-gold-400/15 bg-ivory-deep p-3">
          <div className="flex items-center gap-3 rounded-2xl border border-gold-400/15 bg-white p-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-gradient text-xs font-bold text-ink shadow-gold">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-ink">{adminName}</p>
              <p className="truncate text-[10px] uppercase tracking-widest text-gold-600/60">Administrator</p>
            </div>
            <form action={adminLogout}>
              <button
                type="submit"
                title="Log out"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-ink/40 transition-colors hover:bg-red-500/10 hover:text-red-600"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
