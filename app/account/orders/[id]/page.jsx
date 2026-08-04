import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, MapPin, CreditCard, CheckCircle2 } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Order Details" };

const STATUS_STYLES = {
  pending: "text-ink/60 bg-ink/5 border-ink/10",
  processing: "text-gold-700 bg-gold-400/10 border-gold-400/25 shadow-[0_0_20px_rgba(212,163,89,0.12)]",
  shipped: "text-blue-700 bg-blue-500/10 border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]",
  delivered: "text-green-700 bg-green-500/10 border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.12)]",
  cancelled: "text-red-600 bg-red-500/10 border-red-500/20",
};

export default async function OrderDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: order } = await supabase
    .from("orders")
    .select(
      "id, order_number, subtotal, shipping_cost, discount_amount, coupon_discount, quantity_discount, coupon_code, total_amount, payment_method, payment_status, order_status, created_at, order_items ( id, product_name, variant_name, quantity, line_total ), addresses:addresses!address_id ( full_name, phone, address_line_1, address_line_2, city, state, postal_code )"
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!order) notFound();

  const address = order.addresses;
  const statusStyle = STATUS_STYLES[order.order_status] || STATUS_STYLES.pending;

  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen overflow-hidden bg-white pb-28 pt-14">

        <div className="relative mx-auto max-w-3xl px-5 md:px-8">
          <Link
            href="/account"
            className="group mb-8 inline-flex items-center gap-1.5 text-sm font-bold text-ink/50 transition-colors hover:text-gold-600"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back to My Account
          </Link>

          <Reveal className="mb-10 flex flex-wrap items-start justify-between gap-4 border-b border-gold-400/15 pb-8">
            <div className="min-w-0">
              <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-ink leading-tight break-words">
                Order{" "}
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">
                  {order.order_number}
                </span>
              </h1>
              <p className="mt-3 text-sm sm:text-base text-ink/75 font-semibold">
                Placed on{" "}
                {new Date(order.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <span className={`shrink-0 rounded-full border px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold uppercase tracking-widest ${statusStyle}`}>
              {order.order_status}
            </span>
          </Reveal>

          <div className="space-y-6">
            {/* Items */}
            <Reveal className="relative rounded-[2rem] border border-gold-400/15 bg-white p-6 sm:p-8 hover:border-gold-400/25 hover:shadow-soft transition-all duration-300 overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-[3px] bg-gold-gradient" />
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold-400/20 bg-gold-400/5 text-gold-600 shadow-[0_0_15px_rgba(212,163,89,0.05)]">
                  <Package className="h-5 w-5" />
                </div>
                <h2 className="font-display text-xl sm:text-2xl text-ink font-bold">Items</h2>
              </div>
              <ul className="divide-y divide-ink/10 relative z-10">
                {order.order_items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-3 py-4 text-base">
                    <div className="min-w-0">
                      <p className="text-ink font-bold">{item.product_name}</p>
                      <p className="text-ink/60 font-semibold mt-1 text-sm">
                        {item.variant_name ? `${item.variant_name} · ` : ""}Qty {item.quantity}
                      </p>
                    </div>
                    <span className="shrink-0 text-lg font-bold text-gold-700">
                      ₹{Number(item.line_total).toLocaleString("en-IN")}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-2.5 border-t border-gold-400/15 pt-5 text-base relative z-10">
                <div className="flex justify-between text-ink/65 font-semibold">
                  <span>Subtotal</span>
                  <span className="text-ink font-bold">₹{Number(order.subtotal).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-ink/65 font-semibold">
                  <span>Shipping</span>
                  <span className="text-ink font-bold">₹{Number(order.shipping_cost).toLocaleString("en-IN")}</span>
                </div>
                {order.quantity_discount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Bulk Discount</span>
                    <span className="font-bold">-₹{Number(order.quantity_discount).toLocaleString("en-IN")}</span>
                  </div>
                )}
                {order.coupon_discount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Coupon{order.coupon_code ? ` (${order.coupon_code})` : ""}</span>
                    <span className="font-bold">-₹{Number(order.coupon_discount).toLocaleString("en-IN")}</span>
                  </div>
                )}
                {order.quantity_discount === 0 && order.coupon_discount === 0 && order.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Discount{order.coupon_code ? ` (${order.coupon_code})` : ""}</span>
                    <span className="font-bold">-₹{Number(order.discount_amount).toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gold-400/15 pt-4 font-display text-xl text-ink">
                  <span className="text-gold-600 font-bold">Total</span>
                  <span className="font-bold text-gold-700">₹{Number(order.total_amount).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </Reveal>

            {/* Shipping Address */}
            {address && (
              <Reveal delay={80} className="relative rounded-[2rem] border border-gold-400/15 bg-white p-6 sm:p-8 hover:border-gold-400/25 hover:shadow-soft transition-all duration-300 overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-[3px] bg-gold-gradient" />
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold-400/20 bg-gold-400/5 text-gold-600 shadow-[0_0_15px_rgba(212,163,89,0.05)]">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl text-ink font-bold">Shipping Address</h2>
                </div>
                <div className="relative z-10">
                  <p className="text-lg text-ink font-bold">
                    {address.full_name} · {address.phone}
                  </p>
                  <p className="text-base text-ink/70 font-semibold mt-2">
                    {address.address_line_1}
                    {address.address_line_2 ? `, ${address.address_line_2}` : ""}
                  </p>
                  <p className="text-base text-ink/70 font-semibold">
                    {address.city}, {address.state} {address.postal_code}
                  </p>
                </div>
              </Reveal>
            )}

            {/* Payment */}
            <Reveal delay={160} className="relative rounded-[2rem] border border-gold-400/15 bg-white p-6 sm:p-8 hover:border-gold-400/25 hover:shadow-soft transition-all duration-300 overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-[3px] bg-gold-gradient" />
              <div className="flex items-center gap-3 mb-5 relative z-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold-400/20 bg-gold-400/5 text-gold-600 shadow-[0_0_15px_rgba(212,163,89,0.05)]">
                  <CreditCard className="h-5 w-5" />
                </div>
                <h2 className="font-display text-xl sm:text-2xl text-ink font-bold">Payment</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-base relative z-10">
                <span className="text-ink/60 font-semibold">Method:</span>
                <span className="text-ink font-bold">
                  {order.payment_method === "COD" ? "Cash on Delivery" : "Online (Razorpay)"}
                </span>
                <span className="text-ink/20">|</span>
                <span className="text-ink/60 font-semibold">Status:</span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-bold capitalize ${
                    order.payment_status === "paid"
                      ? "text-green-700 bg-green-500/10 border-green-500/20 shadow-[0_0_12px_rgba(34,197,94,0.12)]"
                      : order.payment_status === "failed"
                      ? "text-red-600 bg-red-500/10 border-red-500/20"
                      : "text-ink/70 bg-ink/5 border-ink/10"
                  }`}
                >
                  {order.payment_status === "paid" && <CheckCircle2 className="h-3.5 w-3.5" />}
                  {order.payment_status}
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
