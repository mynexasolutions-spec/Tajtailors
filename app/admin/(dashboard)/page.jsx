import Link from "next/link";
import {
  ShoppingCart,
  Package,
  Users,
  IndianRupee,
  AlertTriangle,
  ArrowUpRight,
  ChevronRight,
  PlusCircle,
  Tag,
  Settings,
  Star,
  MessageSquare,
  LayoutTemplate,
} from "lucide-react";
import { getDashboardStats } from "@/actions/admin/dashboard";

const QUICK_ACTIONS = [
  { label: "Add Product", href: "/admin/products/new", icon: PlusCircle },
  { label: "View Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Home Customization", href: "/admin/hero-slides", icon: LayoutTemplate },
  { label: "Coupons", href: "/admin/settings/coupons", icon: Tag },
  { label: "Site Settings", href: "/admin/settings", icon: Settings },
];

const STATUS_STYLES = {
  pending: "bg-ink/5 text-ink/70",
  processing: "bg-gold-400/15 text-gold-700",
  shipped: "bg-blue-500/15 text-blue-700",
  delivered: "bg-green-500/15 text-green-700",
  cancelled: "bg-red-500/15 text-red-700",
};

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Total Revenue", value: `₹${stats.revenue.toLocaleString("en-IN")}`, icon: IndianRupee },
    { label: "Total Orders", value: stats.orderCount, icon: ShoppingCart, sub: `${stats.pendingOrders} pending` },
    { label: "Products", value: stats.productCount, icon: Package },
    { label: "Users", value: stats.customerCount, icon: Users },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gold-400/10 pb-6">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink">
            Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">Dashboard</span>
          </h1>
          <p className="text-lg text-ink/50 font-semibold mt-1">A snapshot of how the store is doing.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="group relative overflow-hidden rounded-2xl sm:rounded-[2rem] border border-gold-400/10 bg-white p-4 sm:p-6 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-400/30 hover:shadow-gold"
          >
            {/* Top accent line, fills in on hover */}
            <span className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 transition-transform duration-500 group-hover:scale-x-100" />
            {/* Ambient Corner Glow */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gold-400/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-gold-400/10 text-gold-600 shadow-gold transition-all duration-500 group-hover:scale-110 group-hover:bg-gold-400/15">
                <c.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>

            <p className="mt-3 sm:mt-5 text-xs sm:text-sm uppercase tracking-widest text-ink/45 font-semibold truncate">{c.label}</p>
            <p className="mt-1 sm:mt-1.5 font-display text-xl sm:text-4xl leading-none font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700 truncate">
              {c.value}
            </p>
            {c.sub && (
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-emerald-400 flex items-center gap-1 font-semibold bg-emerald-400/5 px-2 sm:px-2.5 py-1 rounded-full w-fit border border-emerald-400/10 truncate">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                {c.sub}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions + Needs Attention */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[2rem] border border-gold-400/10 bg-white p-6 shadow-soft">
          <h2 className="mb-4 font-display text-2xl font-bold text-ink">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {QUICK_ACTIONS.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-gold-400/10 bg-ivory-deep px-3 py-5 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400/30 hover:bg-gold-400/5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600 transition-transform duration-300 group-hover:scale-110">
                  <a.icon className="h-5 w-5" />
                </div>
                <span className="text-lg font-semibold text-ink/70 group-hover:text-gold-700">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-gold-400/10 bg-white p-6 shadow-soft">
          <h2 className="mb-4 font-display text-2xl font-bold text-ink">Needs Attention</h2>
          <div className="space-y-3">
            <Link
              href="/admin/reviews"
              className="group flex items-center justify-between gap-3 rounded-2xl border border-gold-400/10 bg-ivory-deep px-4 py-3.5 transition-colors hover:border-gold-400/25 hover:bg-gold-400/5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-400/10 text-gold-600">
                  <Star className="h-4 w-4" />
                </div>
                <span className="text-lg font-semibold text-ink/70 group-hover:text-ink">Reviews to approve</span>
              </div>
              <span className="rounded-full bg-gold-400/15 px-2.5 py-1 text-base font-semibold text-gold-700">
                {stats.pendingReviewCount}
              </span>
            </Link>

            <Link
              href="/admin/inquiries"
              className="group flex items-center justify-between gap-3 rounded-2xl border border-gold-400/10 bg-ivory-deep px-4 py-3.5 transition-colors hover:border-gold-400/25 hover:bg-gold-400/5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-400/10 text-blue-700">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <span className="text-lg font-semibold text-ink/70 group-hover:text-ink">Unresolved inquiries</span>
              </div>
              <span className="rounded-full bg-blue-400/15 px-2.5 py-1 text-base font-semibold text-blue-700">
                {stats.unresolvedInquiryCount}
              </span>
            </Link>

            <Link
              href="/admin/orders"
              className="group flex items-center justify-between gap-3 rounded-2xl border border-gold-400/10 bg-ivory-deep px-4 py-3.5 transition-colors hover:border-gold-400/25 hover:bg-gold-400/5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-400/10 text-red-600">
                  <ShoppingCart className="h-4 w-4" />
                </div>
                <span className="text-lg font-semibold text-ink/70 group-hover:text-ink">Orders pending</span>
              </div>
              <span className="rounded-full bg-red-400/15 px-2.5 py-1 text-base font-semibold text-red-600">
                {stats.pendingOrders}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid: Recent Orders & Stock Alert */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        
        {/* Recent Orders Panel */}
        <div className="rounded-[2rem] border border-gold-400/10 bg-white p-6 md:p-8 shadow-soft backdrop-blur-md">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="group flex items-center gap-1.5 text-sm font-semibold text-gold-600 transition-colors hover:text-gold-700 uppercase tracking-wider"
            >
              View all <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
          
          {stats.recentOrders.length === 0 ? (
            <p className="py-12 text-center text-sm text-ink/45">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-gold-400/5">
              {stats.recentOrders.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="group -mx-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-2xl px-3 py-4 text-lg transition-all duration-300 hover:bg-ivory-deep"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600 group-hover:scale-105 transition-transform duration-300">
                        <ShoppingCart className="h-4.5 w-4.5" />
                      </div>
                      <span className="truncate font-semibold text-ink group-hover:text-gold-700 transition-colors">{o.order_number}</span>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                      <span className="text-ink/70 font-semibold">₹{Number(o.total_amount).toLocaleString("en-IN")}</span>
                      <span className={`rounded-full px-2.5 py-1 text-base font-semibold capitalize sm:px-3 ${STATUS_STYLES[o.order_status] || ""}`}>
                        {o.order_status}
                      </span>
                      <ChevronRight className="hidden h-4 w-4 text-ink/25 transition-transform group-hover:translate-x-1 group-hover:text-ink/45 sm:block" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Low Stock Panel */}
        <div className="rounded-[2rem] border border-gold-400/10 bg-white p-6 md:p-8 shadow-soft backdrop-blur-md">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-400/10 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">Low Stock</h2>
          </div>

          {stats.lowStock.length === 0 ? (
            <p className="py-6 text-center text-base text-ink/45">Everything is well stocked.</p>
          ) : (
            <ul className="space-y-3">
              {stats.lowStock.map((v) => (
                <li
                  key={v.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-red-500/10 bg-red-500/[0.02] px-4 py-3.5 text-lg hover:bg-red-500/[0.04] transition-colors"
                >
                  <span className="truncate text-ink/70 font-semibold">
                    {v.products?.name} <span className="text-base text-ink/45">— {v.variant_name}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-red-400/15 px-3 py-1 text-base font-semibold text-red-600">
                    {v.stock_quantity} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
