"use client";

import { useState } from "react";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import { Banknote, CreditCard, CheckCircle2, Minus, Plus, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { processCheckout, verifyRazorpayPayment, validateCoupon } from "@/actions/checkout";
import { calculateQuantityDiscount } from "@/lib/constants";

const inputClass =
  "w-full rounded-2xl border border-ink/10 bg-ivory-deep px-5 py-4 text-base text-ink placeholder:text-ink/30 transition-all duration-500 focus:border-gold-400/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/30";
const labelClass = "mb-2 block text-xs font-semibold uppercase tracking-widest text-gold-600/90";

export default function CheckoutForm({ codEnabled, razorpayEnabled, shipping, quantityDiscount }) {
  const { cart, cartSubtotal, cartCount, clearCart, updateQuantity } = useCart();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState(codEnabled ? "COD" : razorpayEnabled ? "RAZORPAY" : null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [errors, setErrors] = useState({});

  const needsPickup = cart.some((i) => i.ownFabric || i.measurementType === "reference_garment");
  const [pickupSameAsDelivery, setPickupSameAsDelivery] = useState(true);
  const [pickupForm, setPickupForm] = useState({ addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "" });
  const [pickupDate, setPickupDate] = useState("");
  const [pickupNotes, setPickupNotes] = useState("");

  const updatePickup = (key) => (e) => setPickupForm((f) => ({ ...f, [key]: e.target.value }));

  const shippingCost = cartSubtotal >= shipping.free_threshold ? 0 : shipping.flat_rate;
  const codCost = paymentMethod === "COD" ? shipping.cod_charge : 0;
  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const qtyDiscount = calculateQuantityDiscount(cartCount, quantityDiscount);
  const total = Math.max(0, cartSubtotal + shippingCost + codCost - couponDiscount - qtyDiscount);

  const handleApplyCoupon = async () => {
    if (!couponInput) return;
    setApplyingCoupon(true);
    const result = await validateCoupon(couponInput, cartSubtotal);
    setApplyingCoupon(false);
    if (!result.valid) {
      showToast(result.error || "Invalid coupon.", "error");
      setAppliedCoupon(null);
      return;
    }
    setAppliedCoupon({ code: couponInput.toUpperCase(), discountAmount: result.discountAmount });
    showToast("Coupon applied!");
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!form.fullName || form.fullName.trim().length < 3 || !/^[a-zA-Z\s]*$/.test(form.fullName)) {
      tempErrors.fullName = "Name must only contain letters and spaces (min. 3 characters).";
    }
    if (!form.phone || !/^[6-9][0-9]{9}$/.test(form.phone)) {
      tempErrors.phone = "Enter a valid 10-digit Indian phone number.";
    }
    if (!form.addressLine1 || form.addressLine1.trim() === "") {
      tempErrors.addressLine1 = "Address is required.";
    }
    if (!form.city || form.city.trim() === "") {
      tempErrors.city = "City is required.";
    }
    if (!form.state || form.state.trim() === "") {
      tempErrors.state = "State is required.";
    }
    if (!form.postalCode || !/^[0-9]{6}$/.test(form.postalCode)) {
      tempErrors.postalCode = "Enter a valid 6-digit postal code.";
    }
    if (needsPickup && !pickupSameAsDelivery) {
      if (!pickupForm.addressLine1.trim()) tempErrors.pickupAddressLine1 = "Pickup address is required.";
      if (!pickupForm.city.trim()) tempErrors.pickupCity = "Pickup city is required.";
      if (!pickupForm.state.trim()) tempErrors.pickupState = "Pickup state is required.";
      if (!/^[0-9]{6}$/.test(pickupForm.postalCode)) tempErrors.pickupPostalCode = "Enter a valid 6-digit pickup PIN code.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    // Clear error on change
    if (errors[key]) {
      setErrors((err) => ({ ...err, [key]: "" }));
    }
  };

  const cartForServer = () =>
    cart.map((i) => ({
      variantId: i.variantId,
      productId: i.productId,
      name: i.name,
      variantName: i.variantName,
      price: i.price,
      quantity: i.quantity,
      fabricProductId: i.fabricProductId || null,
      fabricVariantId: i.fabricVariantId || null,
      meters: i.meters || null,
      measurementType: i.measurementType || null,
      measurements: i.measurements || null,
      notes: i.notes || null,
    }));

  const pickupPayload = () =>
    needsPickup
      ? {
          required: true,
          sameAsDelivery: pickupSameAsDelivery,
          address: pickupSameAsDelivery ? null : pickupForm,
          preferredDate: pickupDate || null,
          notes: pickupNotes || null,
        }
      : { required: false };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!paymentMethod) {
      showToast("No payment method is available right now.", "error");
      return;
    }

    if (!validateForm()) {
      showToast("Please correct the errors in the form.", "error");
      return;
    }

    setSubmitting(true);
    const result = await processCheckout(form, cartForServer(), paymentMethod, appliedCoupon?.code, pickupPayload());
    setSubmitting(false);

    if (!result.success) {
      showToast(result.error || "Something went wrong. Please try again.", "error");
      return;
    }

    if (result.isRazorpay) {
      openRazorpay(result);
      return;
    }

    clearCart();
    setConfirmedOrder(result.orderNumber);
  };

  const openRazorpay = (result) => {
    if (typeof window === "undefined" || !window.Razorpay) {
      showToast("Payment gateway is still loading — please try again in a moment.", "error");
      return;
    }

    const rzp = new window.Razorpay({
      key: result.razorpayKeyId,
      amount: result.amount,
      currency: "INR",
      name: "Taj Tailor",
      description: `Order ${result.orderNumber}`,
      order_id: result.razorpayOrderId,
      handler: async (response) => {
        const verify = await verifyRazorpayPayment(
          response.razorpay_payment_id,
          response.razorpay_order_id,
          response.razorpay_signature,
          result.orderId,
          cartForServer()
        );
        if (verify.success) {
          clearCart();
          setConfirmedOrder(result.orderNumber);
        } else {
          showToast(verify.error || "Payment verification failed.", "error");
        }
      },
      theme: { color: "#caa14b" },
    });
    rzp.open();
  };

  if (confirmedOrder) {
    return (
      <div className="relative overflow-hidden rounded-[2.5rem] border border-gold-400/20 bg-gradient-to-b from-white via-ivory to-ivory-deep px-10 sm:px-16 pt-6 sm:pt-8 pb-10 sm:pb-16 text-center shadow-2xl">
        {/* Decorative glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(202,161,75,0.12),transparent_65%)] pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-72 h-72 rounded-full bg-gold-400/10 blur-[100px] pointer-events-none" />
        <div className="absolute -right-16 -bottom-16 w-72 h-72 rounded-full bg-gold-300/10 blur-[100px] pointer-events-none" />

        <div className="relative">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10 shadow-[0_0_40px_rgba(212,163,89,0.15)]">
            <CheckCircle2 className="h-8 w-8 text-gold-600" strokeWidth={1.5} />
          </div>

          <p className="eyebrow justify-center text-sm">
            <span className="gold-line" /> Order Confirmed
          </p>
          <h2 className="font-display mt-4 text-4xl sm:text-6xl font-light text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">
            Thank You!
          </h2>
          <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
          <p className="mt-8 text-base sm:text-xl text-ink/60 font-light max-w-xl mx-auto leading-relaxed">
            Your order <span className="font-semibold text-gold-600">{confirmedOrder}</span> has been placed successfully.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/shop" className="btn-gold inline-flex w-full sm:w-fit px-10 py-4 text-sm font-semibold tracking-wide hover:scale-[1.02] transition-transform">
              Continue Shopping
            </Link>
            <Link href="/account" className="btn-outline inline-flex w-full sm:w-fit px-10 py-4 text-sm font-semibold tracking-wide hover:scale-[1.02] transition-transform">
              My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/15 py-24 text-center">
        <p className="font-display text-xl sm:text-2xl text-ink/70">Your bag is empty</p>
        <Link href="/shop" className="btn-gold mt-6 inline-flex w-full sm:w-fit px-8 py-4 text-sm font-medium">
          Explore the Shop
        </Link>
      </div>
    );
  }

  return (
    <>
      {razorpayEnabled && <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />}

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <h2 className="font-display text-xl sm:text-2xl uppercase tracking-widest text-gold-600/90">Shipping Details</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Full Name</label>
              <input 
                required 
                placeholder="Full Name" 
                value={form.fullName} 
                onChange={update("fullName")} 
                minLength={3}
                pattern="^[a-zA-Z\s]*$"
                title="Name must only contain letters and spaces, at least 3 characters."
                className={inputClass} 
              />
              {errors.fullName && <p className="text-red-400 text-sm mt-1.5">{errors.fullName}</p>}
            </div>
            <div>
              <label className={labelClass}>Phone Number</label>
              <input 
                required 
                type="tel"
                placeholder="10-Digit Phone Number" 
                value={form.phone} 
                onChange={update("phone")} 
                maxLength={10}
                pattern="[6-9][0-9]{9}"
                title="Enter a valid 10-digit Indian phone number starting with 6-9."
                className={inputClass} 
              />
              {errors.phone && <p className="text-red-400 text-sm mt-1.5">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>Address Line 1</label>
            <input required placeholder="Flat, House no., Building, Street, Area" value={form.addressLine1} onChange={update("addressLine1")} className={inputClass} />
            {errors.addressLine1 && <p className="text-red-400 text-sm mt-1.5">{errors.addressLine1}</p>}
          </div>
          
          <div>
            <label className={labelClass}>Address Line 2 (Optional)</label>
            <input placeholder="Landmark, Suite, Unit, etc." value={form.addressLine2} onChange={update("addressLine2")} className={inputClass} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClass}>City</label>
              <input required placeholder="City" value={form.city} onChange={update("city")} className={inputClass} />
              {errors.city && <p className="text-red-400 text-sm mt-1.5">{errors.city}</p>}
            </div>
            <div>
              <label className={labelClass}>State</label>
              <input required placeholder="State" value={form.state} onChange={update("state")} className={inputClass} />
              {errors.state && <p className="text-red-400 text-sm mt-1.5">{errors.state}</p>}
            </div>
            <div>
              <label className={labelClass}>PIN Code</label>
              <input 
                required 
                placeholder="6-digit PIN code" 
                value={form.postalCode} 
                onChange={update("postalCode")} 
                maxLength={6}
                pattern="[0-9]{6}"
                title="Enter a valid 6-digit PIN code."
                className={inputClass} 
              />
              {errors.postalCode && <p className="text-red-400 text-sm mt-1.5">{errors.postalCode}</p>}
            </div>
          </div>

          {needsPickup && (
            <>
              <h2 className="pt-4 font-display text-xl sm:text-2xl uppercase tracking-widest text-gold-600/90 flex items-center gap-2">
                <Truck className="h-5 w-5" /> Pickup Details
              </h2>
              <p className="text-sm text-ink/45 -mt-4">
                Your order includes an item where you're sending your own fabric or a reference garment — we'll arrange a courier pickup.
              </p>

              <label className="flex items-center gap-2.5 rounded-2xl border border-gold-400/15 bg-ivory-deep px-5 py-3.5 text-sm text-ink/70">
                <input
                  type="checkbox"
                  checked={pickupSameAsDelivery}
                  onChange={(e) => setPickupSameAsDelivery(e.target.checked)}
                />
                Pick up from the same address as delivery
              </label>

              {!pickupSameAsDelivery && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Pickup Address Line 1</label>
                    <input placeholder="Flat, House no., Building, Street, Area" value={pickupForm.addressLine1} onChange={updatePickup("addressLine1")} className={inputClass} />
                    {errors.pickupAddressLine1 && <p className="text-red-400 text-sm mt-1.5">{errors.pickupAddressLine1}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Pickup Address Line 2 (Optional)</label>
                    <input placeholder="Landmark, Suite, Unit, etc." value={pickupForm.addressLine2} onChange={updatePickup("addressLine2")} className={inputClass} />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className={labelClass}>City</label>
                      <input placeholder="City" value={pickupForm.city} onChange={updatePickup("city")} className={inputClass} />
                      {errors.pickupCity && <p className="text-red-400 text-sm mt-1.5">{errors.pickupCity}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>State</label>
                      <input placeholder="State" value={pickupForm.state} onChange={updatePickup("state")} className={inputClass} />
                      {errors.pickupState && <p className="text-red-400 text-sm mt-1.5">{errors.pickupState}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>PIN Code</label>
                      <input placeholder="6-digit PIN code" value={pickupForm.postalCode} onChange={updatePickup("postalCode")} maxLength={6} className={inputClass} />
                      {errors.pickupPostalCode && <p className="text-red-400 text-sm mt-1.5">{errors.pickupPostalCode}</p>}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Preferred Pickup Date</label>
                  <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Pickup Notes (Optional)</label>
                  <input placeholder="e.g. sending 2m fabric + 1 reference kurta" value={pickupNotes} onChange={(e) => setPickupNotes(e.target.value)} className={inputClass} />
                </div>
              </div>
            </>
          )}

          <h2 className="pt-4 font-display text-xl sm:text-2xl uppercase tracking-widest text-gold-600/90">Payment Method</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {codEnabled && (
              <label
                className={`group relative flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition-all duration-500 hover:-translate-y-0.5 ${
                  paymentMethod === "COD"
                    ? "border-gold-400/60 bg-gold-400/5 shadow-[0_0_20px_rgba(212,163,89,0.05)]"
                    : "border-gold-400/15 bg-ivory-deep hover:border-gold-400/40"
                }`}
              >
                <input
                  type="radio"
                  name="pm"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="sr-only"
                />
                
                {/* Custom Radio Ring */}
                <div className={`mt-1 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                  paymentMethod === "COD" ? "border-gold-400 bg-gold-400" : "border-gold-400/30"
                }`}>
                  <div className={`h-1.5 w-1.5 rounded-full bg-ink transition-transform duration-300 ${paymentMethod === "COD" ? "scale-100" : "scale-0"}`} />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Banknote className={`h-5 w-5 ${paymentMethod === "COD" ? "text-gold-600" : "text-ink/40 group-hover:text-gold-500"} transition-colors duration-300`} />
                    <span className="font-semibold text-base text-ink tracking-wide">Cash on Delivery</span>
                  </div>
                  <p className="text-sm leading-relaxed text-ink/45 font-light">Pay when your order arrives (₹{shipping.cod_charge} COD fee applies).</p>
                </div>
              </label>
            )}

            {razorpayEnabled && (
              <label
                className={`group relative flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition-all duration-500 hover:-translate-y-0.5 ${
                  paymentMethod === "RAZORPAY"
                    ? "border-gold-400/60 bg-gold-400/5 shadow-[0_0_20px_rgba(212,163,89,0.05)]"
                    : "border-gold-400/15 bg-ivory-deep hover:border-gold-400/40"
                }`}
              >
                <input
                  type="radio"
                  name="pm"
                  checked={paymentMethod === "RAZORPAY"}
                  onChange={() => setPaymentMethod("RAZORPAY")}
                  className="sr-only"
                />

                {/* Custom Radio Ring */}
                <div className={`mt-1 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                  paymentMethod === "RAZORPAY" ? "border-gold-400 bg-gold-400" : "border-gold-400/30"
                }`}>
                  <div className={`h-1.5 w-1.5 rounded-full bg-ink transition-transform duration-300 ${paymentMethod === "RAZORPAY" ? "scale-100" : "scale-0"}`} />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <CreditCard className={`h-5 w-5 ${paymentMethod === "RAZORPAY" ? "text-gold-600" : "text-ink/40 group-hover:text-gold-500"} transition-colors duration-300`} />
                    <span className="font-semibold text-base text-ink tracking-wide">Pay Online</span>
                  </div>
                  <p className="text-sm leading-relaxed text-ink/45 font-light">Cards, UPI, and netbanking via Razorpay.</p>
                </div>
              </label>
            )}

            {!codEnabled && !razorpayEnabled && (
              <div className="sm:col-span-2 flex items-center gap-2 rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300">
                <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse shrink-0" />
                Checkout is temporarily unavailable — please contact us on WhatsApp to place your order.
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || !paymentMethod}
            className="btn-gold group w-full sm:w-fit px-10 py-5 text-sm font-semibold tracking-widest uppercase disabled:opacity-60 shadow-[0_4px_20px_rgba(212,163,89,0.12)] hover:shadow-[0_4px_25px_rgba(212,163,89,0.25)] hover:-translate-y-0.5 transition-all duration-300 mt-4 text-center"
          >
            {submitting ? "Placing Order…" : `Place Order — ₹${total.toLocaleString("en-IN")}`}
          </button>
        </form>

        <div className="relative rounded-[2.5rem] border border-gold-400/15 bg-gradient-to-b from-white via-ivory to-ivory-deep p-6 sm:p-8 space-y-5 shadow-2xl h-fit">
          {/* Subtle radial backdrop to echo the About page's glass panels */}
          <div className="absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_top,rgba(202,161,75,0.08),transparent_70%)] pointer-events-none" />

          <h2 className="relative font-display text-xl sm:text-2xl uppercase tracking-widest text-gold-600/90">Order Summary</h2>
          <ul className="relative space-y-4">
            {cart.map((item) => (
              <li key={(item.cartKey || item.variantId)} className="flex gap-4 items-center pb-4 border-b border-gold-400/5 last:border-b-0 last:pb-0">
                {/* Product Thumbnail */}
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl border border-ink/10 bg-ivory-deep shadow-sm">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="60px"
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                </div>
                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="truncate text-base font-medium text-ink">{item.name}</h4>
                  {item.variantName && (
                    <span className="text-sm text-ink/45">{item.variantName}</span>
                  )}
                  {item.fabricName && (
                    <p className="text-sm text-ink/45">
                      {item.ownFabric ? "Customer's own fabric" : `${item.fabricName} (${item.meters}m)`}
                      {item.measurementType === "reference_garment" && " · Reference garment"}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 rounded-full border border-gold-400/20 bg-white px-3 py-1">
                      <button
                        type="button"
                        onClick={() => item.quantity > 1 && updateQuantity((item.cartKey || item.variantId), item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="text-ink/50 hover:text-gold-600 transition-colors p-0.5 disabled:opacity-30 disabled:hover:text-ink/50"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-4 text-center text-xs font-semibold text-ink">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity((item.cartKey || item.variantId), item.quantity + 1)}
                        className="text-ink/50 hover:text-gold-600 transition-colors p-0.5"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-base font-semibold text-gold-700">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="relative space-y-2 border-t border-gold-400/10 pt-4 text-base">
            <div className="flex justify-between text-ink/55 font-light">
              <span>Subtotal</span>
              <span className="text-ink font-medium">₹{cartSubtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-ink/55 font-light">
              <span>Shipping</span>
              <span className="text-ink font-medium">{shippingCost === 0 ? "Free" : `₹${shippingCost}`}</span>
            </div>
            {codCost > 0 && (
              <div className="flex justify-between text-ink/55 font-light">
                <span>COD Fee</span>
                <span className="text-ink font-medium">₹{codCost}</span>
              </div>
            )}
            {qtyDiscount > 0 && (
              <div className="flex justify-between text-green-600 font-light">
                <span>Bulk Discount ({cartCount} items)</span>
                <span className="font-medium">-₹{qtyDiscount.toLocaleString("en-IN")}</span>
              </div>
            )}
            {couponDiscount > 0 && (
              <div className="flex justify-between text-green-600 font-light">
                <span>Coupon ({appliedCoupon.code})</span>
                <span className="font-medium">-₹{couponDiscount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-gold-400/15 pt-3 font-display text-lg text-ink">
              <span className="text-gold-600">Total</span>
              <span className="font-semibold text-gold-700">₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="relative flex flex-col sm:flex-row gap-2 border-t border-gold-400/15 pt-4">
            <input
              placeholder="Coupon code"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              className="min-w-0 flex-1 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/30 transition-all duration-300 focus:border-gold-400/50 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={applyingCoupon || !couponInput}
              className="btn-outline shrink-0 rounded-2xl px-5 py-3 text-xs disabled:opacity-60 hover:bg-gold-400/10 transition-colors duration-300"
            >
              {applyingCoupon ? "Checking…" : "Apply"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
