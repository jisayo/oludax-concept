"use client";

import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ChevronRight,
  Shield,
  Truck,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/products";

const FREE_SHIPPING_THRESHOLD = 50000;

export default function CartPage() {
  const {
    items,
    count,
    subtotal,
    deliveryFee,
    total,
    updateQty,
    removeItem,
    clearCart,
  } = useCart();

  const progressToFreeShipping = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  const amountNeededForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotal
  );

  return (
    <div className="min-h-screen bg-base text-cloud pt-20 sm:pt-24 lg:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header Glass Banner */}
        <div className="glass rounded-[24px] p-6 sm:p-8 border border-black/8 dark:border-[rgba(244,244,242,0.08)] mb-8">
          <nav className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-cloud/40 mb-3">
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-cloud/30" />
            <span className="text-accent font-semibold">Shopping Cart</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-cloud">
                Your Shopping Bag
              </h1>
              <p className="text-cloud/50 text-xs sm:text-sm mt-1">
                Review your bespoke creations, custom specifications, and delivery summary.
              </p>
            </div>
            <span className="glass rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider text-cloud/70 self-start md:self-auto border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
              {count} item{count !== 1 ? "s" : ""} selected
            </span>
          </div>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT: CART ITEMS LIST (8 COLS) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Delivery Tracker Bar */}
              <div className="glass rounded-[20px] p-4 border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-cloud">
                    <Truck className="w-3.5 h-3.5 text-accent" />
                    {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                      <span className="text-emerald-500 font-semibold">
                        Free Nationwide Delivery Unlocked!
                      </span>
                    ) : (
                      <span>
                        Add{" "}
                        <strong className="text-accent">
                          {formatPrice(amountNeededForFreeShipping)}
                        </strong>{" "}
                        more to qualify for Free Delivery
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-[10px] text-cloud/40">
                    {progressToFreeShipping}%
                  </span>
                </div>
                <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-accent h-full transition-all duration-500 rounded-full"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              {/* Items Card List */}
              <div className="glass rounded-[24px] divide-y divide-black/8 dark:divide-[rgba(244,244,242,0.08)] border border-black/8 dark:border-[rgba(244,244,242,0.08)] overflow-hidden">
                {items.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
                    {/* Visual Item Avatar */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-panel border border-black/8 dark:border-[rgba(244,244,242,0.08)] shrink-0 flex items-center justify-center p-2">
                      <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/30 text-accent font-display font-semibold text-sm flex items-center justify-center shadow-inner">
                        {item.name.split(" ")[0]?.[0]}
                        {item.name.split(" ")[1]?.[0] || ""}
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-display font-medium text-base sm:text-lg text-cloud">
                            {item.name}
                          </h3>
                          <span className="font-mono text-xs text-cloud/50 block mt-0.5">
                            Unit Price: {formatPrice(item.price)}
                          </span>
                        </div>
                        <span className="font-mono text-base font-semibold text-accent">
                          {formatPrice(item.price * item.qty)}
                        </span>
                      </div>

                      {/* Customization Details */}
                      {item.customization && (
                        <div className="mt-3 glass rounded-xl p-3 border border-black/8 dark:border-[rgba(244,244,242,0.08)] space-y-1 font-mono text-xs">
                          <span className="text-[10px] uppercase tracking-wider text-accent flex items-center gap-1 font-semibold">
                            <Sparkles className="w-3 h-3" /> Bespoke Personalization
                          </span>
                          {item.customization.customerName && (
                            <p className="text-cloud/80">
                              <span className="text-cloud/50">Name:</span>{" "}
                              <strong>{item.customization.customerName}</strong>
                            </p>
                          )}
                          {item.customization.message && (
                            <p className="text-cloud/80 italic line-clamp-1">
                              <span className="text-cloud/50 not-italic">Note:</span>{" "}
                              &ldquo;{item.customization.message}&rdquo;
                            </p>
                          )}
                          {item.customization.color && (
                            <p className="text-cloud/80 flex items-center gap-1.5">
                              <span className="text-cloud/50">Colour:</span>
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-black/20 dark:border-white/20 inline-block"
                                style={{ backgroundColor: item.customization.color }}
                              />
                            </p>
                          )}
                        </div>
                      )}

                      {/* Stepper + Delete Action */}
                      <div className="flex items-center justify-between pt-4 mt-3 border-t border-black/8 dark:border-[rgba(244,244,242,0.08)]">
                        {/* Stepper */}
                        <div className="glass flex items-center gap-1 rounded-full px-1 py-1">
                          <button
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-cloud/70 transition hover:bg-black/8 dark:hover:bg-[rgba(244,244,242,0.12)] cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="flex h-7 min-w-6 items-center justify-center font-mono text-xs text-cloud select-none">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-cloud/70 transition hover:bg-black/8 dark:hover:bg-[rgba(244,244,242,0.12)] cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Remove Action */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="font-mono text-xs text-cloud/50 hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Actions Row */}
              <div className="flex items-center justify-between pt-2 font-mono text-xs">
                <Link
                  href="/shop"
                  className="text-accent hover:brightness-110 transition-colors"
                >
                  ← Continue Shopping
                </Link>
                <button
                  onClick={clearCart}
                  className="text-cloud/40 hover:text-red-500 transition-colors cursor-pointer"
                >
                  Clear Bag
                </button>
              </div>
            </div>

            {/* RIGHT: ORDER SUMMARY (4 COLS) */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 glass rounded-[24px] p-6 border border-black/8 dark:border-[rgba(244,244,242,0.08)] space-y-6">
                <h2 className="font-display font-medium text-lg text-cloud pb-3 border-b border-black/8 dark:border-[rgba(244,244,242,0.08)]">
                  Order Summary
                </h2>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between text-cloud/70">
                    <span>Subtotal ({count} items)</span>
                    <span className="text-cloud font-semibold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-cloud/70">
                    <span>Delivery Fee (Nationwide)</span>
                    <span
                      className={`font-semibold ${
                        deliveryFee === 0 ? "text-emerald-500" : "text-cloud"
                      }`}
                    >
                      {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-dashed border-black/15 dark:border-white/15 flex items-baseline justify-between text-sm">
                    <span className="text-cloud font-medium">Total Amount</span>
                    <span className="text-xl font-bold text-accent">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="btn-primary w-full py-3.5 font-mono text-xs uppercase tracking-[0.14em]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <a
                  href={`https://wa.me/2348144412006?text=${encodeURIComponent(
                    `Hello Oludax Concept! 🛍️\nI want to place an order for my shopping bag:\n\n` +
                    items.map((i, idx) => `${idx + 1}. *${i.name}* (x${i.qty}) - ${formatPrice(i.price * i.qty)}${i.customization?.customerName ? `\n   • Custom Name: ${i.customization.customerName}` : ""}${i.customization?.designPreference ? `\n   • Option: ${i.customization.designPreference}` : ""}`).join("\n\n") +
                    `\n\n*Total:* ${formatPrice(total)}\n\nPlease confirm availability!`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-full font-mono text-xs uppercase tracking-[0.14em] flex items-center justify-center gap-2 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 transition shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  <span>Order Entire Bag via WhatsApp</span>
                </a>

                <div className="pt-4 border-t border-black/8 dark:border-[rgba(244,244,242,0.08)] space-y-3 font-mono text-[11px] text-cloud/50">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>256-bit SSL Paystack Secured</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span>Doorstep delivery across all 36 states</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass rounded-[24px] p-12 max-w-md mx-auto text-center border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
            <div className="w-14 h-14 rounded-full bg-accent/15 text-accent flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h2 className="font-display font-medium text-xl text-cloud mb-2">
              Your Bag is Empty
            </h2>
            <p className="text-xs text-cloud/50 leading-relaxed mb-6">
              Looks like you haven&apos;t added any gifts yet. Discover our curated gift boxes, fresh bouquets, and personalized items.
            </p>
            <Link href="/shop" className="btn-primary text-xs py-3 w-full font-mono uppercase tracking-wider">
              <span>Start Shopping Now</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
