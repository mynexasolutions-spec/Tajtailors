"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, User, Mail, Phone, ChevronRight, Truck, ExternalLink } from "lucide-react";

const STATUS_STYLES = {
  pending: "text-ink/60 bg-ink/5 border-ink/10",
  processing: "text-gold-700 bg-gold-400/10 border-gold-400/25 shadow-[0_0_12px_rgba(212,163,89,0.12)]",
  shipped: "text-blue-700 bg-blue-500/10 border-blue-500/20 shadow-[0_0_12px_rgba(59,130,246,0.1)]",
  delivered: "text-green-700 bg-green-500/10 border-green-500/20 shadow-[0_0_12px_rgba(34,197,94,0.12)]",
  cancelled: "text-red-600 bg-red-500/10 border-red-500/20",
};

const TABS = [
  { key: "orders", label: "Orders", icon: Package },
  { key: "profile", label: "My Profile", icon: User },
];

const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

export default function AccountTabs({ profile, orders, initialTab = "orders" }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders =
    statusFilter === "all" ? orders : (orders || []).filter((o) => o.order_status === statusFilter);

  return (
    <div>
      {/* Tab Switcher */}
      <div className="flex gap-2 rounded-2xl border border-gold-400/15 bg-white p-1.5 w-full sm:w-fit shadow-soft">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-bold tracking-wide transition-all duration-300 ${
                isActive
                  ? "bg-gold-gradient text-ink shadow-gold"
                  : "text-ink/60 hover:text-gold-700 hover:bg-gold-50/10"
              }`}
            >
              <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="mt-8">
          <h2 className="font-display text-xl sm:text-2xl text-ink font-bold mb-6">Order History</h2>
 
          {orders && orders.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {STATUS_FILTERS.map((f) => {
                const isActive = statusFilter === f.key;
                const count = f.key === "all" ? orders.length : orders.filter((o) => o.order_status === f.key).length;
                return (
                  <button
                    key={f.key}
                    onClick={() => setStatusFilter(f.key)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "border-gold-400/60 bg-gold-400/10 text-gold-700 shadow-[0_0_15px_rgba(212,163,89,0.08)]"
                        : "border-ink/10 bg-white text-ink/65 hover:border-gold-400/30 hover:text-ink"
                    }`}
                  >
                    {f.label}
                    <span className={`text-xs ${isActive ? "text-gold-600" : "text-ink/35"}`}>({count})</span>
                  </button>
                );
              })}
            </div>
          )}

          {!orders || orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink/15 py-16 text-center">
              <p className="text-base text-ink/45">You haven't placed any orders yet.</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink/15 py-16 text-center">
              <p className="text-base text-ink/45">No {statusFilter} orders found.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {filteredOrders.map((order) => (
                <li key={order.id} className="relative rounded-[1.75rem] border border-gold-400/15 bg-white p-5 sm:p-6 hover:border-gold-400/25 hover:-translate-y-0.5 hover:shadow-soft transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-[2.5px] bg-gold-gradient" />
                  <div className="flex flex-wrap items-start justify-between gap-3 relative z-10">
                    <div className="min-w-0">
                      <p className="font-display text-lg sm:text-xl text-ink font-bold break-words">{order.order_number}</p>
                      <p className="text-sm text-ink/60 font-semibold mt-0.5">
                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-gold-700 mb-1.5">₹{Number(order.total_amount).toLocaleString("en-IN")}</p>
                      <span className={`inline-block rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${STATUS_STYLES[order.order_status] || "text-ink/60 bg-ink/5 border-ink/10"}`}>
                        {order.order_status}
                      </span>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-1.5 border-t border-ink/10 pt-4 text-base text-ink/70 font-semibold relative z-10">
                    {order.order_items.map((item, i) => (
                      <li key={i}>
                        {item.product_name} {item.variant_name ? `(${item.variant_name})` : ""} × {item.quantity}
                      </li>
                    ))}
                  </ul>

                  {order.tracking_number && (
                    <div className="relative z-10 mt-4 flex items-center gap-3 rounded-2xl border border-gold-400/20 bg-gradient-to-r from-gold-400/10 via-gold-300/5 to-transparent px-4 py-3">
                      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-gradient shadow-gold">
                        <Truck className="h-4 w-4 text-ink" />
                        {order.order_status !== "delivered" && (
                          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-700/80">
                          {order.courier_name || "Delhivery"} · {order.order_status === "delivered" ? "Delivered" : "On the way"}
                        </p>
                        <p className="truncate font-mono text-sm text-ink font-semibold">{order.tracking_number}</p>
                      </div>
                      <a
                        href={order.tracking_url || `https://www.delhivery.com/track/package/${order.tracking_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gold-400/25 bg-gold-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-gold-700 transition-all duration-300 hover:border-gold-400/50 hover:bg-gold-400/20"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Track
                      </a>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end border-t border-ink/10 pt-4 relative z-10">
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="group/link inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-widest text-gold-600 hover:text-gold-700 transition-colors"
                    >
                      View Details
                      <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* My Profile Tab */}
      {activeTab === "profile" && (
        <div className="mt-8">
          <h2 className="font-display text-xl sm:text-2xl text-ink font-bold mb-6">My Profile</h2>
          <div className="relative rounded-[2.5rem] border border-gold-400/15 bg-white p-6 sm:p-10 space-y-6 shadow-soft overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gold-gradient" />
            <div className="flex items-center gap-4 sm:gap-5 pb-6 border-b border-ink/10 relative z-10">
              <div className="flex h-14 w-14 sm:h-18 sm:w-18 shrink-0 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/5 text-gold-600 shadow-[0_0_20px_rgba(212,163,89,0.1)]">
                <User className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <p className="font-display text-xl sm:text-3xl text-ink font-bold break-words">{profile?.full_name || "Taj Tailor Customer"}</p>
                <p className="text-sm uppercase tracking-widest text-gold-700 font-bold mt-1.5">Customer Account</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm sm:text-base relative z-10">
              <Mail className="h-5 w-5 text-gold-500/70 shrink-0" />
              <span className="text-ink/60 font-semibold">Email</span>
              <ChevronRight className="h-3.5 w-3.5 text-ink/25 hidden sm:block" />
              <span className="text-ink font-bold break-all">{profile?.email || "—"}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm sm:text-base relative z-10">
              <Phone className="h-5 w-5 text-gold-500/70 shrink-0" />
              <span className="text-ink/60 font-semibold">Phone</span>
              <ChevronRight className="h-3.5 w-3.5 text-ink/25 hidden sm:block" />
              <span className="text-ink font-bold break-all">{profile?.phone || "Not provided"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
