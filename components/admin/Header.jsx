"use client";

import Link from "next/link";
import { Menu, ExternalLink } from "lucide-react";
import { useAdminSidebar } from "@/context/AdminSidebarContext";
import { adminLogout } from "@/actions/auth";

export default function AdminHeader({ adminName }) {
  const { setMobileOpen } = useAdminSidebar();
  const initial = (adminName || "A").trim().charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-gold-400/15 bg-white/90 px-4 backdrop-blur-md md:px-6">
      <button onClick={() => setMobileOpen(true)} className="p-1.5 text-ink/60 hover:text-ink lg:hidden">
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:block">
        <p className="text-lg text-ink font-bold">
          Welcome back, <span className="font-bold text-gold-700">{adminName || "Admin"}</span>
        </p>
        <p className="text-sm text-ink/40 font-semibold tracking-wide mt-0.5">Here&apos;s what&apos;s happening with your store today.</p>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <Link
          href="/"
          target="_blank"
          className="hidden items-center gap-1.5 rounded-full border border-gold-400/20 bg-gold-400/5 px-4 py-1.5 text-sm text-ink/60 transition-all duration-300 hover:border-gold-400/40 hover:text-gold-700 hover:shadow-[0_0_15px_rgba(212,163,89,0.08)] sm:flex"
        >
          View Store <ExternalLink className="h-3.5 w-3.5" />
        </Link>

        <div className="h-8 w-px bg-ink/10 hidden sm:block" />

        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-gradient text-sm font-semibold text-ink shadow-[0_2px_10px_rgba(202,161,75,0.25)]">
            {initial}
          </div>
          <form action={adminLogout}>
            <button
              type="submit"
              className="rounded-full border border-ink/10 px-4 py-1.5 text-sm text-ink/60 transition-colors hover:border-red-500/40 hover:text-red-600"
            >
              Log Out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
