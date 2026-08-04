"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import SherwaniGlyph from "@/components/SherwaniGlyph";
import { calculateQuantityDiscount } from "@/lib/constants";

export default function CartDrawer({ quantityDiscount }) {
  const { cart, drawerOpen, setDrawerOpen, updateQuantity, removeFromCart, cartSubtotal, cartCount } = useCart();
  const qtyDiscount = calculateQuantityDiscount(cartCount, quantityDiscount);

  return (
    <>
      {drawerOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-md transition-opacity duration-500"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-gold-400/15 bg-white transition-transform duration-500 ease-out shadow-2xl ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-gold-400/15 px-6 py-5">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-5 w-5 text-gold-600" />
            <h2 className="font-display text-lg sm:text-xl font-bold tracking-wide text-ink">
              Your Bag
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-gold-500/10 border border-gold-500/20 px-2.5 py-0.5 text-xs font-bold text-gold-700">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </h2>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close bag"
            className="group p-1.5 rounded-full border border-gold-400/15 bg-white text-ink/60 hover:text-gold-700 hover:border-gold-400/40 transition-all duration-300"
          >
            <X className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-gold-400/10">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center px-4">
              <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold-400/5 border border-gold-400/10 shadow-[0_0_30px_rgba(212,163,89,0.02)]">
                <SherwaniGlyph className="h-10 w-auto text-gold-300 animate-floatSlow" />
              </div>
              <h3 className="font-display text-lg text-ink font-bold tracking-wide">
                Your bag is empty
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-ink/60 font-semibold leading-relaxed max-w-[260px]">
                Discover premium fabrics and ready-made kurtas, tailored for you.
              </p>
              <Link
                href="/shop"
                onClick={() => setDrawerOpen(false)}
                className="btn-gold mt-8 w-fit px-8 py-3.5 text-xs font-bold tracking-wider uppercase shadow-[0_4px_15px_rgba(212,163,89,0.1)] hover:shadow-[0_4px_20px_rgba(212,163,89,0.2)] hover:-translate-y-0.5 transition-all duration-300"
              >
                Explore the Shop
              </Link>
            </div>
          ) : (
            <ul className="space-y-6">
              {cart.map((item) => (
                <li
                  key={(item.cartKey || item.variantId)}
                  className="group flex gap-4 border-b border-ink/10 pb-5 transition-all duration-300 hover:border-gold-400/20"
                >
                  {/* Product Image */}
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-ink/10 bg-white shadow-md group-hover:border-gold-400/30 transition-colors duration-300">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-1 flex-col justify-between py-0.5">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-display text-base sm:text-lg text-ink font-bold leading-snug group-hover:text-gold-700 transition-colors">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart((item.cartKey || item.variantId))}
                          aria-label="Remove item"
                          className="text-ink/40 hover:text-red-500 p-1 rounded-lg hover:bg-red-500/5 transition-all shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      {item.variantName && (
                        <span className="inline-block text-[10px] sm:text-[11px] uppercase tracking-widest text-gold-600 font-bold mt-1.5">
                          {item.variantName}
                        </span>
                      )}
                      {item.fabricName && (
                        <span className="block text-xs sm:text-sm font-semibold text-ink/65 mt-1.5">
                          Fabric: {item.fabricName}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 rounded-full border border-gold-400/20 bg-white px-3 py-1.5">
                        <button
                          onClick={() => updateQuantity((item.cartKey || item.variantId), item.quantity - 1)}
                          className="text-ink/50 hover:text-gold-700 transition-colors p-0.5"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-4 text-center text-xs font-bold text-ink">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity((item.cartKey || item.variantId), item.quantity + 1)}
                          className="text-ink/50 hover:text-gold-700 transition-colors p-0.5"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Product Price */}
                      <span className="text-base sm:text-lg font-bold text-gold-700">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gold-400/15 bg-white px-6 py-6 space-y-4 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-sm uppercase tracking-widest text-ink/50 font-semibold">Subtotal</span>
              <span className="font-display text-2xl text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-400 to-gold-700 font-bold">
                ₹{cartSubtotal.toLocaleString("en-IN")}
              </span>
            </div>
            {qtyDiscount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm uppercase tracking-widest text-green-600 font-semibold">Bulk Discount</span>
                <span className="text-base font-bold text-green-600">-₹{qtyDiscount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <p className="text-xs text-ink/50 leading-normal font-semibold">
              Shipping and COD fees calculated at checkout. Free shipping available on select orders.
            </p>
            <Link
              href="/checkout"
              onClick={() => setDrawerOpen(false)}
              className="btn-gold w-full py-4 text-xs font-bold tracking-widest uppercase text-center block shadow-gold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
