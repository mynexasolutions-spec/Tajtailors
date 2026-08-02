import Link from "next/link";
import { ShoppingCart, Clock, Truck, XCircle, Eye } from "lucide-react";
import { getAllOrdersAdmin } from "@/actions/admin/orders";

export const metadata = { title: "Orders" };

const STATUS_STYLES = {
  pending: "bg-ink/5 text-ink/70 border-ink/10",
  processing: "bg-gold-400/15 text-gold-700 border-gold-400/25",
  shipped: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  delivered: "bg-green-500/10 text-green-700 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default async function AdminOrdersPage() {
  const orders = await getAllOrdersAdmin();

  const pendingCount = orders.filter((o) => o.order_status === "pending").length;
  const shippedCount = orders.filter((o) => o.order_status === "shipped").length;
  const cancelledCount = orders.filter((o) => o.order_status === "cancelled").length;

  const stats = [
    { label: "Total Orders", value: orders.length, icon: ShoppingCart },
    { label: "Pending", value: pendingCount, icon: Clock },
    { label: "Shipped", value: shippedCount, icon: Truck },
    { label: "Cancelled", value: cancelledCount, icon: XCircle },
  ];

  return (
    <div>
      {/* Header Panel */}
      <div className="mb-8 border-b border-gold-400/10 pb-6">
        <h1 className="font-display text-3xl font-light text-ink">
          Order <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">Management</span>
        </h1>
        <p className="text-sm text-ink/50 font-light mt-1">
          {orders.length} order{orders.length === 1 ? "" : "s"} placed so far.
        </p>
      </div>

      {/* Stat Strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 rounded-2xl border border-gold-400/10 bg-white px-4 py-3.5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-400/10 text-gold-300">
              <s.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-xl leading-none text-ink">{s.value}</p>
              <p className="truncate text-xs uppercase tracking-wide text-ink/45">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table (sm and up) */}
      <div className="hidden overflow-x-auto rounded-[2rem] border border-gold-400/10 bg-white p-6 backdrop-blur-md shadow-2xl sm:block md:p-8">
        {orders.length === 0 ? (
          <p className="py-12 text-center text-sm text-ink/45">No orders yet.</p>
        ) : (
          <table className="w-full min-w-[720px] text-left border-collapse">
            <thead>
              <tr className="border-b border-gold-400/10 text-xs uppercase tracking-widest text-ink/45 font-semibold">
                <th className="pb-4 font-medium pl-2">Order</th>
                <th className="pb-4 font-medium">Customer</th>
                <th className="pb-4 font-medium">Date</th>
                <th className="pb-4 font-medium">Payment</th>
                <th className="pb-4 font-medium">Total</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 font-medium pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-400/5">
              {orders.map((o) => (
                <tr key={o.id} className="group/row transition-colors duration-300 hover:bg-ivory-deep">
                  <td className="py-4 pr-4 pl-2">
                    <Link href={`/admin/orders/${o.id}`} className="text-sm font-medium text-ink group-hover/row:text-gold-700 transition-colors">
                      {o.order_number}
                    </Link>
                  </td>
                  <td className="py-4 pr-4 text-sm text-ink/60">{o.profiles?.full_name || o.profiles?.email || "—"}</td>
                  <td className="py-4 pr-4 text-sm text-ink/45">
                    {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="py-4 pr-4 text-sm capitalize text-ink/60">
                    {o.payment_method === "COD" ? "COD" : "Online"} · {o.payment_status}
                  </td>
                  <td className="py-4 pr-4 text-sm font-semibold text-ink">₹{Number(o.total_amount).toLocaleString("en-IN")}</td>
                  <td className="py-4 pr-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider border capitalize ${STATUS_STYLES[o.order_status] || ""}`}>
                      {o.order_status}
                    </span>
                  </td>
                  <td className="py-4 pr-2 text-right">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-gold-400/20 bg-gold-400/5 px-3 py-2 text-xs font-semibold text-gold-700 transition-all duration-300 hover:border-gold-400/50 hover:bg-gold-400/10"
                    >
                      <Eye className="h-3.5 w-3.5" /> View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Card List (mobile only) */}
      <div className="rounded-[2rem] border border-gold-400/10 bg-white p-4 backdrop-blur-md shadow-2xl sm:hidden">
        {orders.length === 0 ? (
          <p className="py-12 text-center text-sm text-ink/45">No orders yet.</p>
        ) : (
          <ul className="space-y-3">
            {orders.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/admin/orders/${o.id}`}
                  className="block rounded-2xl border border-gold-400/15 bg-white p-4 transition-colors hover:bg-gold-400/5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-ink">{o.order_number}</span>
                    <span className="text-sm font-semibold text-ink">₹{Number(o.total_amount).toLocaleString("en-IN")}</span>
                  </div>
                  <p className="mt-1 truncate text-sm text-ink/50">{o.profiles?.full_name || o.profiles?.email || "—"}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider border capitalize ${STATUS_STYLES[o.order_status] || ""}`}>
                      {o.order_status}
                    </span>
                    <span className="rounded-full border border-ink/10 bg-ink/5 px-2.5 py-1 text-xs font-semibold capitalize text-ink/50">
                      {o.payment_method === "COD" ? "COD" : "Online"} · {o.payment_status}
                    </span>
                    <span className="ml-auto text-sm text-ink/35">
                      {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold-600">
                    <Eye className="h-3.5 w-3.5" /> View Details
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
