"use client";

import { useState } from "react";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import { Banknote, CreditCard, CheckCircle2, Minus, Plus, Truck, MapPin } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { processCheckout, verifyRazorpayPayment, validateCoupon } from "@/actions/checkout";
import { calculateQuantityDiscount } from "@/lib/constants";
import SherwaniGlyph from "@/components/SherwaniGlyph";

const inputClass =
  "w-full rounded-2xl border border-ink/10 bg-white px-5 py-4 text-base text-ink placeholder:text-ink/30 transition-all duration-500 focus:border-gold-400/50 focus:shadow-[0_0_20px_rgba(212,163,89,0.06)] focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/30";
const labelClass = "mb-2 block text-xs sm:text-sm font-bold uppercase tracking-[0.15em] text-gold-700";

// Numbered section headings — same visual language as the outfit
// configurator's steps, so the checkout form reads as a continuation of the
// same journey instead of a plain generic form.
function SectionHeading({ number, icon: Icon, children }) {
  return (
    <div className="border-b border-gold-400/10 pb-3 mb-6">
      <p className="flex items-center gap-3 font-display text-lg sm:text-xl uppercase tracking-[0.15em] text-gold-700 font-bold">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-gradient text-xs font-bold text-ink shadow-gold">
          {number}
        </span>
        {Icon && <Icon className="h-5 w-5 text-gold-600" />}
        {children}
      </p>
    </div>
  );
}

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
  const [confirmedTransactionId, setConfirmedTransactionId] = useState(null);
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
  const pickupCost = needsPickup ? shipping.pickup_charge : 0;
  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const qtyDiscount = calculateQuantityDiscount(cartCount, quantityDiscount);
  const total = Math.max(0, cartSubtotal + shippingCost + codCost + pickupCost - couponDiscount - qtyDiscount);

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
          setConfirmedTransactionId(response.razorpay_payment_id);
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
      <div className="relative overflow-hidden rounded-[2.5rem] border border-gold-400/20 bg-white px-10 sm:px-20 pt-12 pb-14 text-center shadow-2xl animate-pop">
        {/* Luxury top accent bar with animation */}
        <div className="absolute inset-x-0 top-0 h-[4px] bg-gold-gradient bg-[length:200%_200%] animate-shimmer" />

        {/* CSS Keyframe Animations for Luxury Sparkles */}
        <style>{`
          @keyframes floatSparkle {
            0%, 100% { transform: translateY(0) scale(1) rotate(0deg); opacity: 0.35; }
            50% { transform: translateY(-20px) scale(1.2) rotate(180deg); opacity: 0.95; }
          }
          @keyframes scalePop {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes lineGrow {
            0% { width: 0; opacity: 0; }
            100% { width: 96px; opacity: 1; }
          }
          .animate-sparkle-1 { animation: floatSparkle 7s ease-in-out infinite; }
          .animate-sparkle-2 { animation: floatSparkle 9s ease-in-out infinite 1.5s; }
          .animate-sparkle-3 { animation: floatSparkle 8s ease-in-out infinite 3.5s; }
          .animate-sparkle-4 { animation: floatSparkle 10s ease-in-out infinite 0.5s; }
          .animate-sparkle-5 { animation: floatSparkle 6s ease-in-out infinite 2s; }
          .animate-pop { animation: scalePop 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .animate-line-grow { animation: lineGrow 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; }
          @keyframes floatClothes {
            0%, 100% { transform: translateY(0) rotate(-3deg); }
            50% { transform: translateY(-8px) rotate(3deg); }
          }
          .animate-floatClothes { animation: floatClothes 5s ease-in-out infinite; }
        `}</style>

        {/* Floating Sparkles & Luxury Elements */}
        <div className="absolute top-[15%] left-[8%] w-5 h-5 text-gold-500/40 animate-sparkle-1 pointer-events-none">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z"/></svg>
        </div>
        <div className="absolute top-[25%] right-[10%] w-6 h-6 text-gold-500/50 animate-sparkle-2 pointer-events-none">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12 0l2.5 8.5 8.5 2.5-8.5 2.5-2.5 8.5-2.5-8.5-8.5-2.5 8.5-2.5z"/></svg>
        </div>
        <div className="absolute bottom-[20%] left-[12%] w-4 h-4 text-gold-500/30 animate-sparkle-3 pointer-events-none">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12 2a10 10 0 1010 10A10 10 0 0012 2z"/></svg>
        </div>
        <div className="absolute bottom-[30%] right-[15%] w-5 h-5 text-gold-500/40 animate-sparkle-4 pointer-events-none">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z"/></svg>
        </div>
        <div className="absolute top-[50%] left-[5%] w-3 h-3 text-gold-500/30 animate-sparkle-5 pointer-events-none">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12 2a10 10 0 1010 10A10 10 0 0012 2z"/></svg>
        </div>

        {/* Decorative backdrop glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(202,161,75,0.05),transparent_65%)] pointer-events-none" />

        <div className="relative z-10 pt-4">
          {/* Animated Stamp Seal Check */}
          <div className="relative mx-auto mb-6 flex h-28 w-28 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-gold-400/10 border border-gold-400/20 animate-ping opacity-75" />
            <span className="absolute inset-2 rounded-full bg-gold-400/5 border border-gold-400/30 animate-pulse" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-gold-400/30 bg-white shadow-soft transition-transform duration-500 hover:scale-105">
              <CheckCircle2 className="h-10 w-10 text-gold-600 animate-pulse" strokeWidth={1.5} />
            </div>
          </div>

          <p className="eyebrow justify-center text-xs tracking-[0.25em] font-bold text-gold-700 uppercase">
            <span className="gold-line" /> Order Confirmed
          </p>
          <h2 className="font-display mt-4 text-5xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700 tracking-tight">
            Thank You!
          </h2>
          <div className="mx-auto mt-6 h-[1.5px] w-24 bg-gradient-to-r from-transparent via-gold-400/60 to-transparent animate-line-grow" />
          <p className="mt-8 text-base sm:text-xl text-ink/70 font-semibold max-w-xl mx-auto leading-relaxed">
            Your order <span className="font-bold text-gold-600 tracking-wide">{confirmedOrder}</span> has been placed successfully.
          </p>
          {confirmedTransactionId && (
            <p className="mt-3 text-sm text-ink/50 font-mono tracking-wide">
              Transaction ID: <span className="font-bold text-gold-600">{confirmedTransactionId}</span>
            </p>
          )}
          
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/shop" className="btn-gold inline-flex w-full sm:w-fit px-10 py-4 text-xs font-bold tracking-[0.15em] uppercase hover:scale-[1.02] transition-transform shadow-gold">
              Continue Shopping
            </Link>
            <Link href="/account" className="btn-outline inline-flex w-full sm:w-fit px-10 py-4 text-xs font-bold tracking-[0.15em] uppercase hover:scale-[1.02] transition-transform">
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

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_420px] lg:gap-16">
        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          <SectionHeading number={1} icon={MapPin}>Shipping Details</SectionHeading>

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
              <div className="pt-2">
                <SectionHeading number={2} icon={Truck}>Pickup Details</SectionHeading>
              </div>
              <p className="text-sm text-ink/65 font-semibold -mt-4">
                Your order includes an item where you're sending your own fabric or a reference garment — we'll arrange a courier pickup.
              </p>

              <label className="flex items-center gap-2.5 rounded-2xl border border-gold-400/15 bg-white px-5 py-3.5 text-sm text-ink/75 font-semibold">
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

          <div className="pt-2">
            <SectionHeading number={needsPickup ? 3 : 2} icon={CreditCard}>Payment Method</SectionHeading>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {codEnabled && (
              <label
                className={`group relative flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition-all duration-500 hover:-translate-y-1 ${
                  paymentMethod === "COD"
                    ? "border-gold-400 bg-gold-50/20 shadow-soft"
                    : "border-ink/10 bg-white hover:border-gold-400/40 hover:shadow-soft"
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
                  paymentMethod === "COD" ? "border-gold-400 bg-gold-400" : "border-ink/20"
                }`}>
                  <div className={`h-1.5 w-1.5 rounded-full bg-ink transition-transform duration-300 ${paymentMethod === "COD" ? "scale-100" : "scale-0"}`} />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Banknote className={`h-5 w-5 ${paymentMethod === "COD" ? "text-gold-600" : "text-ink/40 group-hover:text-gold-500"} transition-colors duration-300`} />
                    <span className="font-bold text-base text-ink tracking-wide">Cash on Delivery</span>
                  </div>
                  <p className="text-sm leading-relaxed text-ink/65 font-semibold">Pay when your order arrives (₹{shipping.cod_charge} COD fee applies).</p>
                </div>
              </label>
            )}

            {razorpayEnabled && (
              <label
                className={`group relative flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition-all duration-500 hover:-translate-y-1 ${
                  paymentMethod === "RAZORPAY"
                    ? "border-gold-400 bg-gold-50/20 shadow-soft"
                    : "border-ink/10 bg-white hover:border-gold-400/40 hover:shadow-soft"
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
                  paymentMethod === "RAZORPAY" ? "border-gold-400 bg-gold-400" : "border-ink/20"
                }`}>
                  <div className={`h-1.5 w-1.5 rounded-full bg-ink transition-transform duration-300 ${paymentMethod === "RAZORPAY" ? "scale-100" : "scale-0"}`} />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <CreditCard className={`h-5 w-5 ${paymentMethod === "RAZORPAY" ? "text-gold-600" : "text-ink/40 group-hover:text-gold-500"} transition-colors duration-300`} />
                    <span className="font-bold text-base text-ink tracking-wide">Pay Online</span>
                  </div>
                  <p className="text-sm leading-relaxed text-ink/65 font-semibold">Cards, UPI, and netbanking via Razorpay.</p>
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
            className="btn-gold group w-full sm:w-fit px-12 py-5 text-xs font-bold tracking-[0.2em] uppercase disabled:opacity-60 shadow-gold hover:shadow-lg hover:-translate-y-1 transition-all duration-300 mt-4 text-center"
          >
            {submitting ? "Placing Order…" : `Place Order · ₹${total.toLocaleString("en-IN")}`}
          </button>
        </form>

        <div className="relative rounded-[2.5rem] border border-gold-400/15 bg-white p-6 sm:p-8 space-y-6 shadow-2xl h-fit overflow-hidden">
          {/* Seductive gold accent bar on top of card */}
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gold-gradient" />
          
          {/* Subtle radial backdrop to echo the About page's glass panels */}
          <div className="absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_top,rgba(202,161,75,0.04),transparent_70%)] pointer-events-none" />

          <h2 className="relative font-display text-xl sm:text-2xl uppercase tracking-widest text-gold-600/90 font-bold">Order Summary</h2>
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
                  <h4 className="truncate text-base font-bold text-ink">{item.name}</h4>
                  {item.variantName && (
                    <span className="text-sm text-ink/50 font-semibold">{item.variantName}</span>
                  )}
                  {item.fabricName && (
                    <p className="text-sm text-ink/50 font-semibold">
                      {item.ownFabric ? "Customer's own fabric" : `${item.fabricName} (${item.meters}m)`}
                      {item.measurementType === "reference_garment" && " · Reference garment"}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    {item.productType === "fabric" ? (
                      <div className="flex items-center gap-1.5 rounded-xl border-2 border-gold-400/40 bg-white px-2.5 py-1">
                        <input
                          type="number"
                          min={1}
                          step="0.5"
                          value={item.quantity}
                          onChange={(e) =>
                            e.target.value !== "" &&
                            updateQuantity((item.cartKey || item.variantId), Math.max(1, Number(e.target.value)))
                          }
                          className="w-12 rounded-md border border-ink/15 bg-white px-1 py-1 text-center text-xs font-bold text-ink focus:border-gold-400/50 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          aria-label="Meters needed"
                        />
                        <span className="text-[11px] font-bold text-ink/60">m</span>
                      </div>
                    ) : (
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
                    )}
                    <span className="text-base font-semibold text-gold-700">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="relative space-y-2 border-t border-gold-400/10 pt-4 text-base">
            <div className="flex justify-between text-ink/65 font-semibold">
              <span>Subtotal</span>
              <span className="text-ink font-bold">₹{cartSubtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-ink/65 font-semibold">
              <span>Shipping</span>
              <span className="text-ink font-bold">{shippingCost === 0 ? "Free" : `₹${shippingCost}`}</span>
            </div>
            {codCost > 0 && (
              <div className="flex justify-between text-ink/65 font-semibold">
                <span>COD Fee</span>
                <span className="text-ink font-bold">₹{codCost}</span>
              </div>
            )}
            {pickupCost > 0 && (
              <div className="flex justify-between text-ink/65 font-semibold">
                <span>Fabric Pickup Fee</span>
                <span className="text-ink font-bold">₹{pickupCost}</span>
              </div>
            )}
            {qtyDiscount > 0 && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Bulk Discount ({cartCount} items)</span>
                <span className="font-bold">-₹{qtyDiscount.toLocaleString("en-IN")}</span>
              </div>
            )}
            {couponDiscount > 0 && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Coupon ({appliedCoupon.code})</span>
                <span className="font-bold">-₹{couponDiscount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-gold-400/15 pt-3 font-display text-lg text-ink">
              <span className="text-gold-600">Total</span>
              <span className="font-semibold text-gold-700">₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="relative flex items-center border border-ink/10 rounded-2xl bg-white focus-within:border-gold-400/50 transition-all duration-300 pr-1.5 focus-within:shadow-[0_0_15px_rgba(212,163,89,0.06)]">
            <input
              placeholder="Enter coupon code"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm text-ink placeholder:text-ink/30 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={applyingCoupon || !couponInput}
              className="btn-gold shrink-0 rounded-xl px-5 py-2.5 text-[10px] font-bold tracking-widest uppercase disabled:opacity-40"
            >
              {applyingCoupon ? "Checking…" : "Apply"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
