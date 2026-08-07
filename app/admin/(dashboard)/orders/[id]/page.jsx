import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package, MapPin, CreditCard, Ruler, Truck } from "lucide-react";
import { getOrderById } from "@/actions/admin/orders";
import OrderStatusManager from "./_components/OrderStatusManager";
import DelhiveryShipmentManager from "./_components/DelhiveryShipmentManager";
import ReferenceGarmentPickupManager from "./_components/ReferenceGarmentPickupManager";
import SherwaniGlyph from "@/components/SherwaniGlyph";

export const metadata = { title: "Order Detail" };

const panelClass =
  "rounded-[2rem] border border-gold-400/15 bg-white p-6 shadow-soft md:p-8";

// Best-effort labels for known style/fit keys from the original hardcoded
// Kurta/Pajama field sets — admin-added custom fields/styles (via Garment
// Types) fall back to their raw key, which is still readable enough.
const STYLE_LABELS = {
  pathani: "Pathani Kurta", plain: "Plain Kurta", plain_half_placket: "Plain Half-Placket Kurta",
  jawahar_cut: "Jawahar Cut", shirt: "Shirt Style",
  pant_cut: "Pant-Cut", choodidar: "Choodidar", mughlai_shalwar: "Mughlai Shalwar", nadawar: "Nada-vaar (Drawstring)",
  straight: "Straight", not_straight: "Not Straight",
};
const EXTRA_WORK_LABELS = { karigari: "Karigari / Embroidery Work", zari_buttons: "Zari Buttons" };

function titleCase(key) {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

// Measurements are stored per section (kurta/pajama/pant, or a custom
// garment type's own key) as { style, ...fieldKey: value }. Rendering walks
// every section generically instead of assuming kurta/pajama/pant are the
// only possibilities, so admin-defined garment types (e.g. "Kids Kurta")
// display correctly too.
function measurementLines(m) {
  if (!m) return [];
  const lines = [];

  Object.entries(m).forEach(([sectionKey, section]) => {
    if (sectionKey === "garmentType" || sectionKey === "extraWork") return;
    if (!section || typeof section !== "object") return;
    const sectionLabel = titleCase(sectionKey);

    Object.entries(section).forEach(([fieldKey, value]) => {
      if (!value) return;
      if (fieldKey === "style") {
        lines.push([`${sectionLabel} Style`, STYLE_LABELS[value] || value]);
      } else if (fieldKey === "fit") {
        lines.push([`${sectionLabel} Fit`, STYLE_LABELS[value] || value]);
      } else if (fieldKey === "frontPlacket") {
        lines.push(["Front Placket", value === "yes" ? "Yes" : "No"]);
      } else if (value === "yes" || value === "no") {
        lines.push([`${sectionLabel} ${titleCase(fieldKey)}`, value === "yes" ? "Yes" : "No"]);
      } else if (fieldKey.toLowerCase().includes("age")) {
        lines.push([`${sectionLabel} Age`, `${value} yr${Number(value) === 1 ? "" : "s"}`]);
      } else {
        lines.push([`${sectionLabel} ${titleCase(fieldKey)}`, `${value}"`]);
      }
    });
  });

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
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-ink/50 transition-colors hover:text-gold-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold-400/15 pb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">
            Order <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">{order.order_number}</span>
          </h1>
          <p className="mt-1 text-sm text-ink/70 font-semibold">Placed {new Date(order.created_at).toLocaleString("en-IN")}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
        <div className="min-w-0 space-y-6">
          <div className={panelClass}>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600">
                <Package className="h-4 w-4" />
              </div>
              <h2 className="font-display text-xl text-ink font-bold">Items</h2>
            </div>
            <ul className="mt-4 divide-y divide-gold-400/5">
              {order.order_items.map((item) => (
                <li key={item.id} className="py-4 text-base">
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-ink/10 bg-ivory-deep">
                      {item.products?.featured_image_url ? (
                        <Image src={item.products.featured_image_url} alt="" fill sizes="56px" className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <SherwaniGlyph className="h-7 w-auto text-ink/25" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-ink font-bold text-base">{item.product_name}</p>
                      <p className="text-ink/65 font-semibold text-sm">{item.variant_name} × {item.quantity}</p>
                    </div>
                    <span className="shrink-0 font-bold text-ink text-base">₹{Number(item.line_total).toLocaleString("en-IN")}</span>
                  </div>

                  {item.measurement_type && (
                    <div className="mt-3 ml-17 space-y-1.5 rounded-xl border border-gold-400/15 bg-ivory-deep p-4 text-sm">
                      <p className="flex items-center gap-1.5 font-bold uppercase tracking-wide text-gold-600/90 text-xs">
                        <Ruler className="h-3.5 w-3.5" /> Fabric &amp; Measurements
                      </p>
                      <p className="text-ink/80 font-semibold">
                        Fabric: {item.fabric?.name ? `${item.fabric.name} (${item.fabric_meters}m)${item.fabric.product_code ? ` [Code: ${item.fabric.product_code}]` : ""}` : "Customer's own fabric"}
                      </p>
                      {item.measurement_type === "reference_garment" ? (
                        <p className="text-ink/80 font-semibold">Customer is sending a reference garment for sizing.</p>
                      ) : (
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-ink/80 font-semibold">
                          {measurementLines(item.measurements).map(([label, value]) => (
                            <span key={label}>{label}: <span className="text-ink font-bold">{value}</span></span>
                          ))}
                        </div>
                      )}
                      {item.measurements?.extraWork?.length > 0 && (
                        <p className="text-ink/80 font-semibold">
                          Extra Work:{" "}
                          <span className="text-ink font-bold">
                            {item.measurements.extraWork
                              .map((e) =>
                                typeof e === "string"
                                  ? EXTRA_WORK_LABELS[e] || e
                                  : `${e.label}${e.price > 0 ? ` (+₹${e.price})` : ""}`
                              )
                              .join(", ")}
                          </span>
                        </p>
                      )}
                      {item.notes && <p className="text-ink/60 font-semibold italic">Description: "{item.notes}"</p>}
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2 border-t border-gold-400/10 pt-4 text-base">
              <div className="flex justify-between text-ink/70 font-semibold">
                <span>Subtotal</span>
                <span className="font-bold">₹{Number(order.subtotal).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-ink/70 font-semibold">
                <span>Shipping</span>
                <span className="font-bold">₹{Number(order.shipping_cost).toLocaleString("en-IN")}</span>
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
              <div className="flex justify-between border-t border-gold-400/10 pt-3 font-display text-lg text-ink font-bold">
                <span>Total</span>
                <span className="text-gold-700 font-extrabold text-xl">₹{Number(order.total_amount).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          <div className={panelClass}>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600">
                <MapPin className="h-4 w-4" />
              </div>
              <h2 className="font-display text-xl text-ink font-bold">Customer &amp; Shipping</h2>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-6 text-base sm:grid-cols-2">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-ink/60">Customer</p>
                <p className="mt-1.5 text-ink font-bold">{order.profiles?.full_name}</p>
                <p className="text-ink/70 font-semibold">{order.profiles?.email}</p>
                <p className="text-ink/70 font-semibold">{order.profiles?.phone}</p>
              </div>
              {address && (
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-ink/60">Shipping Address</p>
                  <p className="mt-1.5 text-ink font-bold">{address.full_name} · {address.phone}</p>
                  <p className="text-ink/70 font-semibold">{address.address_line_1}{address.address_line_2 ? `, ${address.address_line_2}` : ""}</p>
                  <p className="text-ink/70 font-semibold">{address.city}, {address.state} {address.postal_code}</p>
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
                <h2 className="font-display text-xl text-ink font-bold">Pickup Details</h2>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-6 text-base sm:grid-cols-2">
                {pickupAddress && (
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-ink/60">Pickup Address</p>
                    <p className="mt-1.5 text-ink font-bold">{pickupAddress.full_name} · {pickupAddress.phone}</p>
                    <p className="text-ink/70 font-semibold">{pickupAddress.address_line_1}{pickupAddress.address_line_2 ? `, ${pickupAddress.address_line_2}` : ""}</p>
                    <p className="text-ink/70 font-semibold">{pickupAddress.city}, {pickupAddress.state} {pickupAddress.postal_code}</p>
                  </div>
                )}
                <div>
                  {order.pickup_preferred_date && (
                    <>
                      <p className="text-sm font-bold uppercase tracking-wide text-ink/60">Preferred Date</p>
                      <p className="mt-1.5 text-ink font-bold">{new Date(order.pickup_preferred_date).toLocaleDateString("en-IN")}</p>
                    </>
                  )}
                  {order.pickup_notes && (
                    <>
                      <p className="mt-3 text-sm font-bold uppercase tracking-wide text-ink/60">Notes</p>
                      <p className="mt-1.5 text-ink/80 font-semibold italic">"{order.pickup_notes}"</p>
                    </>
                  )}
                </div>
              </div>
              <ReferenceGarmentPickupManager order={order} />
            </div>
          )}
        </div>

        <div className={`${panelClass} h-fit min-w-0`}>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600">
              <CreditCard className="h-4 w-4" />
            </div>
            <h2 className="font-display text-xl text-ink font-bold">Manage Status</h2>
          </div>
          <OrderStatusManager order={order} />
          <p className="mt-5 text-sm text-ink/65 font-semibold">
            Payment method: <span className="text-ink font-bold">{order.payment_method === "COD" ? "Cash on Delivery" : "Online (Razorpay)"}</span>
          </p>
          {order.payment_method === "RAZORPAY" && order.razorpay_payment_id && (
            <p className="mt-2 text-sm text-ink/65 font-semibold flex items-center flex-wrap gap-1.5">
              Razorpay ID: <span className="font-mono text-ink font-bold select-all bg-ivory-deep border border-ink/10 px-2 py-0.5 rounded-lg">{order.razorpay_payment_id}</span>
            </p>
          )}
          <DelhiveryShipmentManager order={order} />
        </div>
      </div>
    </div>
  );
}
