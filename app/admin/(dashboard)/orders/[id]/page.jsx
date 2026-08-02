import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package, MapPin, CreditCard, Ruler, Truck } from "lucide-react";
import { getOrderById } from "@/actions/admin/orders";
import OrderStatusManager from "./_components/OrderStatusManager";
import SherwaniGlyph from "@/components/SherwaniGlyph";

export const metadata = { title: "Order Detail" };

const panelClass =
  "rounded-[2rem] border border-gold-400/15 bg-white p-6 shadow-soft md:p-8";

const KURTA_STYLE_LABELS = {
  pathani: "Pathani Kurta", plain: "Plain Kurta", plain_half_placket: "Plain Half-Placket Kurta",
  jawahar_cut: "Jawahar Cut", shirt: "Shirt Style",
};
const PAJAMA_STYLE_LABELS = {
  pant_cut: "Pant-Cut", choodidar: "Choodidar", mughlai_shalwar: "Mughlai Shalwar", nadawar: "Nada-vaar (Drawstring)",
};
const PAJAMA_FIT_LABELS = { straight: "Straight", not_straight: "Not Straight" };
const EXTRA_WORK_LABELS = { karigari: "Karigari / Embroidery Work", zari_buttons: "Zari Buttons" };

function titleCase(key) {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

// New orders store measurements nested by garment (kurta/pajama/pant); a
// handful of early test orders may still have the old flat shape, so fall
// back to printing whatever keys are present in that case.
function measurementLines(m) {
  if (!m) return [];
  const lines = [];
  if (m.kurta) {
    if (m.kurta.style) lines.push(["Kurta Style", KURTA_STYLE_LABELS[m.kurta.style] || m.kurta.style]);
    ["length", "collar", "sleeve", "chest", "waist"].forEach((k) => {
      if (m.kurta[k]) lines.push([`Kurta ${titleCase(k)}`, `${m.kurta[k]}"`]);
    });
    if (m.kurta.frontPlacket) lines.push(["Front Placket", m.kurta.frontPlacket === "yes" ? "Yes" : "No"]);
  }
  if (m.pajama) {
    if (m.pajama.style) lines.push(["Pajama Style", PAJAMA_STYLE_LABELS[m.pajama.style] || m.pajama.style]);
    if (m.pajama.fit) lines.push(["Pajama Fit", PAJAMA_FIT_LABELS[m.pajama.fit] || m.pajama.fit]);
    ["length", "mori", "hip"].forEach((k) => {
      if (m.pajama[k]) lines.push([`Pajama ${titleCase(k)}`, `${m.pajama[k]}"`]);
    });
  }
  if (m.pant) {
    ["length", "waist", "hip", "mori"].forEach((k) => {
      if (m.pant[k]) lines.push([`Pant ${titleCase(k)}`, `${m.pant[k]}"`]);
    });
  }
  if (lines.length === 0) {
    Object.entries(m)
      .filter(([k, v]) => v && k !== "garmentType" && k !== "extraWork")
      .forEach(([k, v]) => lines.push([titleCase(k), `${v}"`]));
  }
  return lines;
}

export default async function AdminOrderDetailPage({ params }) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const address = order.delivery_address;
  const pickupAddress = order.pickup_address;

  return (
    <div>
      <Link
        href="/admin/orders"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink/45 transition-colors hover:text-gold-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold-400/15 pb-6">
        <div>
          <h1 className="font-display text-3xl font-light text-ink">
            Order <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">{order.order_number}</span>
          </h1>
          <p className="mt-1 text-sm text-ink/50">Placed {new Date(order.created_at).toLocaleString("en-IN")}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
        <div className="min-w-0 space-y-6">
          <div className={panelClass}>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600">
                <Package className="h-4 w-4" />
              </div>
              <h2 className="font-display text-lg text-ink">Items</h2>
            </div>
            <ul className="mt-4 divide-y divide-gold-400/5">
              {order.order_items.map((item) => (
                <li key={item.id} className="py-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-ink/10 bg-ivory-deep">
                      {item.products?.featured_image_url ? (
                        <Image src={item.products.featured_image_url} alt="" fill sizes="48px" className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <SherwaniGlyph className="h-7 w-auto text-ink/25" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-ink">{item.product_name}</p>
                      <p className="text-ink/45">{item.variant_name} × {item.quantity}</p>
                    </div>
                    <span className="shrink-0 font-medium text-ink">₹{Number(item.line_total).toLocaleString("en-IN")}</span>
                  </div>

                  {item.measurement_type && (
                    <div className="mt-3 ml-15 space-y-1.5 rounded-xl border border-gold-400/15 bg-ivory-deep p-3.5 text-sm">
                      <p className="flex items-center gap-1.5 font-semibold uppercase tracking-wide text-gold-600/80 text-xs">
                        <Ruler className="h-3.5 w-3.5" /> Fabric &amp; Measurements
                      </p>
                      <p className="text-ink/70">
                        Fabric: {item.fabric?.name ? `${item.fabric.name} (${item.fabric_meters}m)` : "Customer's own fabric"}
                      </p>
                      {item.measurement_type === "reference_garment" ? (
                        <p className="text-ink/70">Customer is sending a reference garment for sizing.</p>
                      ) : (
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-ink/70">
                          {measurementLines(item.measurements).map(([label, value]) => (
                            <span key={label}>{label}: <span className="text-ink">{value}</span></span>
                          ))}
                        </div>
                      )}
                      {item.measurements?.extraWork?.length > 0 && (
                        <p className="text-ink/70">
                          Extra Work: <span className="text-ink">{item.measurements.extraWork.map((k) => EXTRA_WORK_LABELS[k] || k).join(", ")}</span>
                        </p>
                      )}
                      {item.notes && <p className="text-ink/50 italic">Description: "{item.notes}"</p>}
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1.5 border-t border-gold-400/10 pt-4 text-sm">
              <div className="flex justify-between text-ink/60">
                <span>Subtotal</span>
                <span>₹{Number(order.subtotal).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-ink/60">
                <span>Shipping</span>
                <span>₹{Number(order.shipping_cost).toLocaleString("en-IN")}</span>
              </div>
              {order.quantity_discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Bulk Discount</span>
                  <span>-₹{Number(order.quantity_discount).toLocaleString("en-IN")}</span>
                </div>
              )}
              {order.coupon_discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Coupon{order.coupon_code ? ` (${order.coupon_code})` : ""}</span>
                  <span>-₹{Number(order.coupon_discount).toLocaleString("en-IN")}</span>
                </div>
              )}
              {order.quantity_discount === 0 && order.coupon_discount === 0 && order.discount_amount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount{order.coupon_code ? ` (${order.coupon_code})` : ""}</span>
                  <span>-₹{Number(order.discount_amount).toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gold-400/10 pt-2 font-display text-base text-ink">
                <span>Total</span>
                <span className="text-gold-700">₹{Number(order.total_amount).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          <div className={panelClass}>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600">
                <MapPin className="h-4 w-4" />
              </div>
              <h2 className="font-display text-lg text-ink">Customer &amp; Shipping</h2>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-ink/45">Customer</p>
                <p className="mt-1.5 text-ink">{order.profiles?.full_name}</p>
                <p className="text-ink/50">{order.profiles?.email}</p>
                <p className="text-ink/50">{order.profiles?.phone}</p>
              </div>
              {address && (
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-ink/45">Shipping Address</p>
                  <p className="mt-1.5 text-ink">{address.full_name} · {address.phone}</p>
                  <p className="text-ink/50">{address.address_line_1}{address.address_line_2 ? `, ${address.address_line_2}` : ""}</p>
                  <p className="text-ink/50">{address.city}, {address.state} {address.postal_code}</p>
                </div>
              )}
            </div>
          </div>

          {order.pickup_required && (
            <div className={panelClass}>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600">
                  <Truck className="h-4 w-4" />
                </div>
                <h2 className="font-display text-lg text-ink">Pickup Details</h2>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                {pickupAddress && (
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-ink/45">Pickup Address</p>
                    <p className="mt-1.5 text-ink">{pickupAddress.full_name} · {pickupAddress.phone}</p>
                    <p className="text-ink/50">{pickupAddress.address_line_1}{pickupAddress.address_line_2 ? `, ${pickupAddress.address_line_2}` : ""}</p>
                    <p className="text-ink/50">{pickupAddress.city}, {pickupAddress.state} {pickupAddress.postal_code}</p>
                  </div>
                )}
                <div>
                  {order.pickup_preferred_date && (
                    <>
                      <p className="text-sm font-semibold uppercase tracking-wide text-ink/45">Preferred Date</p>
                      <p className="mt-1.5 text-ink">{new Date(order.pickup_preferred_date).toLocaleDateString("en-IN")}</p>
                    </>
                  )}
                  {order.pickup_notes && (
                    <>
                      <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-ink/45">Notes</p>
                      <p className="mt-1.5 text-ink/70 italic">"{order.pickup_notes}"</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={`${panelClass} h-fit min-w-0`}>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600">
              <CreditCard className="h-4 w-4" />
            </div>
            <h2 className="font-display text-lg text-ink">Manage Status</h2>
          </div>
          <OrderStatusManager order={order} />
          <p className="mt-5 text-sm text-ink/45">
            Payment method: <span className="text-ink/70">{order.payment_method === "COD" ? "Cash on Delivery" : "Online (Razorpay)"}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
