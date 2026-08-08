"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { calculateQuantityDiscount } from "@/lib/constants";

export default function CartView({ quantityDiscount }) {
  const { cart, updateQuantity, removeFromCart, cartSubtotal, cartCount } = useCart();
  const qtyDiscount = calculateQuantityDiscount(cartCount, quantityDiscount);

  if (cart.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/15 py-20 text-center">
        <p className="font-display text-lg text-ink/70">Your bag is empty</p>
        <Link href="/shop" className="btn-gold mt-6 inline-flex">
          Explore the Shop
        </Link>
      </div>
    );
  }

  return (
    <>
      <ul className="divide-y divide-ink/10 border-y border-ink/10">
        {cart.map((item) => (
          <li key={(item.cartKey || item.variantId)} className="flex gap-4 py-5">
            <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-ivory-deep">
              {item.image && (
                <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
              )}
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`/shop/${item.slug}`} className="font-display text-base text-ink hover:text-gold-600">
                    {item.name}
                  </Link>
                  {item.variantName && <p className="text-sm text-ink/50">{item.variantName}</p>}
                </div>
                <button
                  onClick={() => removeFromCart((item.cartKey || item.variantId))}
                  className="text-ink/40 hover:text-red-500"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                {item.productType === "fabric" ? (
                  <div className="flex items-center gap-1.5 rounded-xl border-2 border-gold-400/40 px-2.5 py-1">
                    <input
                      type="number"
                      min={1}
                      step="0.5"
                      value={item.quantity}
                      onChange={(e) =>
                        e.target.value !== "" &&
                        updateQuantity((item.cartKey || item.variantId), Math.max(1, Number(e.target.value)))
                      }
                      className="w-14 rounded-md border border-ink/15 bg-white px-1 py-1 text-center text-sm font-semibold text-ink focus:border-gold-400/50 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      aria-label="Meters needed"
                    />
                    <span className="text-xs font-semibold text-ink/60">m</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 rounded-full border border-ink/10 px-3 py-1.5">
                    <button onClick={() => updateQuantity((item.cartKey || item.variantId), item.quantity - 1)} aria-label="Decrease">
                      <Minus className="h-3.5 w-3.5 text-ink/60 hover:text-gold-600" />
                    </button>
                    <span className="w-5 text-center text-sm text-ink">{item.quantity}</span>
                    <button onClick={() => updateQuantity((item.cartKey || item.variantId), item.quantity + 1)} aria-label="Increase">
                      <Plus className="h-3.5 w-3.5 text-ink/60 hover:text-gold-600" />
                    </button>
                  </div>
                )}
                <span className="font-semibold text-ink">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between">
        <span className="text-ink/60">Subtotal</span>
        <span className="font-display text-2xl text-ink">
          ₹{cartSubtotal.toLocaleString("en-IN")}
        </span>
      </div>
      {qtyDiscount > 0 && (
        <div className="mt-2 flex items-center justify-between">
          <span className="text-green-600 text-sm">Bulk Discount ({cartCount} items)</span>
          <span className="font-semibold text-green-600">-₹{qtyDiscount.toLocaleString("en-IN")}</span>
        </div>
      )}
      <p className="mt-2 text-xs text-ink/45">Shipping and any COD fee calculated at checkout.</p>

      <Link href="/checkout" className="btn-gold mt-8 w-full">
        Proceed to Checkout
      </Link>
    </>
  );
}
