"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  Truck,
  ArrowRight,
  ChevronRight,
  Lock,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/products";

const NIGERIAN_STATES = [
  "Lagos",
  "Abuja (FCT)",
  "Rivers",
  "Oyo",
  "Ogun",
  "Kano",
  "Kaduna",
  "Enugu",
  "Delta",
  "Edo",
  "Anambra",
  "Akwa Ibom",
  "Abia",
  "Adamawa",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Ebonyi",
  "Ekiti",
  "Gombe",
  "Imo",
  "Jigawa",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Nasarawa",
  "Niger",
  "Ondo",
  "Osun",
  "Plateau",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, count, subtotal, deliveryFee, total, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "Lagos",
    deliveryNotes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"paystack" | "bank_transfer">(
    "paystack"
  );
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.email.trim() || !formData.email.includes("@"))
      errors.email = "Valid email address is required";
    if (!formData.address.trim()) errors.address = "Street address is required";
    if (!formData.city.trim()) errors.city = "City or town is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // 1. Post order to backend API
      let orderRef = `OLU-${Math.floor(100000 + Math.random() * 900000)}`;
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: formData.fullName,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            deliveryAddress: formData.address,
            deliveryCity: formData.city,
            deliveryState: formData.state,
            deliveryNotes: formData.deliveryNotes,
            items: items.map((it) => ({
              productId: it.id,
              name: it.name,
              price: it.price,
              quantity: it.qty,
              customization: it.customization,
            })),
            paymentMethod,
          }),
        });

        const orderData = await res.json();
        if (orderData?.order?.orderRef) {
          orderRef = orderData.order.orderRef;
        }
      } catch (apiErr) {
        console.warn("Backend API call fallback, saving locally:", apiErr);
      }

      // 2. Keep in localStorage for offline & client fallback
      const orderPayload = {
        ref: orderRef,
        items,
        count,
        subtotal,
        deliveryFee,
        total,
        customer: formData,
        paymentMethod,
        date: new Date().toISOString(),
        status: "Confirmed",
      };

      try {
        localStorage.setItem(`order_${orderRef}`, JSON.stringify(orderPayload));
        const existingOrders = JSON.parse(
          localStorage.getItem("oludax_orders") || "[]"
        );
        localStorage.setItem(
          "oludax_orders",
          JSON.stringify([orderPayload, ...existingOrders])
        );
      } catch {}

      // Clear the cart
      clearCart();

      // 3. If Paystack, initialize transaction
      if (paymentMethod === "paystack") {
        try {
          const initRes = await fetch("/api/paystack/initialize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderRef,
              email: formData.email,
              amount: total,
            }),
          });
          const initData = await initRes.json();
          if (initData?.success && initData?.authorizationUrl) {
            if (
              initData.authorizationUrl.startsWith("http") &&
              !initData.authorizationUrl.includes(window.location.host)
            ) {
              window.location.href = initData.authorizationUrl;
              return;
            }
          }
        } catch (gatewayErr) {
          console.warn("Paystack gateway warning, continuing to confirmation:", gatewayErr);
        }
      }

      // Navigate to order confirmation
      router.push(`/checkout/success?ref=${orderRef}`);
    } catch {
      alert("Failed to submit order. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-base min-h-screen py-24 px-4 text-cloud">
        <div className="max-w-md mx-auto glass rounded-[24px] p-8 text-center border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
          <div className="w-14 h-14 rounded-full bg-accent/15 text-accent flex items-center justify-center mx-auto mb-4">
            <Truck className="w-6 h-6" />
          </div>
          <h1 className="font-display font-medium text-xl text-cloud mb-2">
            No Items in Checkout
          </h1>
          <p className="text-cloud/50 text-xs mb-6">
            Your shopping bag is currently empty. Please add items to your cart before proceeding to checkout.
          </p>
          <Link href="/shop" className="btn-primary text-xs py-3 w-full font-mono uppercase tracking-wider">
            Browse Gifts
          </Link>
        </div>
      </div>
    );
  }

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
            <Link href="/cart" className="hover:text-accent transition-colors">
              Cart
            </Link>
            <ChevronRight className="w-3 h-3 text-cloud/30" />
            <span className="text-accent font-semibold">Secure Checkout</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-500 px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider mb-2 border border-emerald-500/25">
                <Lock className="w-3.5 h-3.5" />
                <span>256-Bit SSL Encrypted</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-cloud">
                Checkout & Delivery
              </h1>
              <p className="text-cloud/50 text-xs sm:text-sm mt-1">
                Provide your destination details to schedule careful doorstep dispatch across Nigeria.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: SHIPPING & PAYMENT FORM (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Customer Contact */}
            <div className="glass rounded-[24px] p-6 border border-black/8 dark:border-[rgba(244,244,242,0.08)] space-y-4">
              <h2 className="font-display font-medium text-base text-cloud pb-3 border-b border-black/8 dark:border-[rgba(244,244,242,0.08)] flex items-center justify-between">
                <span>1. Contact Information</span>
                <span className="font-mono text-[10px] text-cloud/40">Step 1 of 3</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-cloud/60 block mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="e.g. Oluwaseun Adeleke"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border text-xs text-cloud focus:outline-none focus:ring-1 focus:ring-accent ${
                      formErrors.fullName
                        ? "border-red-500"
                        : "border-black/10 dark:border-white/10"
                    }`}
                  />
                  {formErrors.fullName && (
                    <span className="font-mono text-[10px] text-red-500 mt-1 block flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.fullName}
                    </span>
                  )}
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-cloud/60 block mb-1.5">
                    Phone (WhatsApp Preferred) *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="e.g. 0801 234 5678"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border text-xs text-cloud focus:outline-none focus:ring-1 focus:ring-accent ${
                      formErrors.phone
                        ? "border-red-500"
                        : "border-black/10 dark:border-white/10"
                    }`}
                  />
                  {formErrors.phone && (
                    <span className="font-mono text-[10px] text-red-500 mt-1 block flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.phone}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-cloud/60 block mb-1.5">
                  Email Address (For receipt & tracking) *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="name@example.com"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border text-xs text-cloud focus:outline-none focus:ring-1 focus:ring-accent ${
                    formErrors.email
                      ? "border-red-500"
                      : "border-black/10 dark:border-white/10"
                  }`}
                />
                {formErrors.email && (
                  <span className="font-mono text-[10px] text-red-500 mt-1 block flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {formErrors.email}
                  </span>
                )}
              </div>
            </div>

            {/* Step 2: Delivery Destination */}
            <div className="glass rounded-[24px] p-6 border border-black/8 dark:border-[rgba(244,244,242,0.08)] space-y-4">
              <h2 className="font-display font-medium text-base text-cloud pb-3 border-b border-black/8 dark:border-[rgba(244,244,242,0.08)] flex items-center justify-between">
                <span>2. Delivery Destination</span>
                <span className="font-mono text-[10px] text-cloud/40">Step 2 of 3</span>
              </h2>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-cloud/60 block mb-1.5">
                  Street Address (House number, Street, Landmark) *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="e.g. 15 Admiralty Way, Lekki Phase 1"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border text-xs text-cloud focus:outline-none focus:ring-1 focus:ring-accent ${
                    formErrors.address
                      ? "border-red-500"
                      : "border-black/10 dark:border-white/10"
                  }`}
                />
                {formErrors.address && (
                  <span className="font-mono text-[10px] text-red-500 mt-1 block flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {formErrors.address}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-cloud/60 block mb-1.5">
                    State *
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-cloud focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
                  >
                    {NIGERIAN_STATES.map((st) => (
                      <option key={st} value={st} className="bg-panel text-cloud">
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-cloud/60 block mb-1.5">
                    City / Area / Town *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="e.g. Ikeja, Lekki, or Garki"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border text-xs text-cloud focus:outline-none focus:ring-1 focus:ring-accent ${
                      formErrors.city
                        ? "border-red-500"
                        : "border-black/10 dark:border-white/10"
                    }`}
                  />
                  {formErrors.city && (
                    <span className="font-mono text-[10px] text-red-500 mt-1 block flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.city}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-cloud/60 block mb-1.5">
                  Delivery Notes / Gate Code / Gift Drop Note
                </label>
                <textarea
                  value={formData.deliveryNotes}
                  onChange={(e) =>
                    setFormData({ ...formData, deliveryNotes: e.target.value })
                  }
                  placeholder="e.g. Ring the bell, deliver to front desk, call upon arrival..."
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-cloud focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                />
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="glass rounded-[24px] p-6 border border-black/8 dark:border-[rgba(244,244,242,0.08)] space-y-4">
              <h2 className="font-display font-medium text-base text-cloud pb-3 border-b border-black/8 dark:border-[rgba(244,244,242,0.08)] flex items-center justify-between">
                <span>3. Payment Method</span>
                <span className="font-mono text-[10px] text-cloud/40">Step 3 of 3</span>
              </h2>

              <div className="space-y-3">
                <label
                  onClick={() => setPaymentMethod("paystack")}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "paystack"
                      ? "border-accent bg-accent/10 ring-1 ring-accent"
                      : "border-black/8 dark:border-white/10 glass hover:border-accent/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "paystack"}
                    onChange={() => setPaymentMethod("paystack")}
                    className="mt-1 text-accent focus:ring-accent cursor-pointer"
                  />
                  <div>
                    <span className="font-mono text-xs uppercase tracking-wider text-cloud block flex items-center gap-2 font-semibold">
                      <span>Pay Online via Paystack</span>
                      <span className="bg-emerald-500/20 text-emerald-500 text-[9px] px-2 py-0.5 rounded-full border border-emerald-500/30">
                        Recommended
                      </span>
                    </span>
                    <span className="text-xs text-cloud/50 block mt-0.5">
                      Debit Card (Mastercard, Visa, Verve), Bank Transfer, or USSD via Paystack.
                    </span>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod("bank_transfer")}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "bank_transfer"
                      ? "border-accent bg-accent/10 ring-1 ring-accent"
                      : "border-black/8 dark:border-white/10 glass hover:border-accent/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "bank_transfer"}
                    onChange={() => setPaymentMethod("bank_transfer")}
                    className="mt-1 text-accent focus:ring-accent cursor-pointer"
                  />
                  <div>
                    <span className="font-mono text-xs uppercase tracking-wider text-cloud block font-semibold">
                      Direct Bank Transfer / Invoice
                    </span>
                    <span className="text-xs text-cloud/50 block mt-0.5">
                      Make an electronic transfer directly to our corporate bank account.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY (5 COLS) */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 glass rounded-[24px] p-6 border border-black/8 dark:border-[rgba(244,244,242,0.08)] space-y-5">
              <h2 className="font-display font-medium text-base text-cloud pb-3 border-b border-black/8 dark:border-[rgba(244,244,242,0.08)]">
                Review Order ({count} items)
              </h2>

              {/* Items overview scroll */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-black/8 dark:divide-white/10">
                {items.map((i) => (
                  <div key={i.id} className="pt-2 first:pt-0 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <h4 className="font-medium text-cloud">
                        {i.name} <span className="font-mono text-cloud/40 text-[11px]">× {i.qty}</span>
                      </h4>
                      {i.customization?.customerName && (
                        <span className="font-mono text-[10px] text-accent block">
                          Name: {i.customization.customerName}
                        </span>
                      )}
                    </div>
                    <span className="font-mono font-semibold text-cloud shrink-0">
                      {formatPrice(i.price * i.qty)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals Calculation */}
              <div className="space-y-2.5 font-mono text-xs border-t border-black/8 dark:border-[rgba(244,244,242,0.08)] pt-4">
                <div className="flex justify-between text-cloud/60">
                  <span>Subtotal</span>
                  <span className="text-cloud font-semibold">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-cloud/60">
                  <span>Nationwide Delivery</span>
                  <span
                    className={`font-semibold ${
                      deliveryFee === 0 ? "text-emerald-500" : "text-cloud"
                    }`}
                  >
                    {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-sm font-semibold text-cloud pt-3 border-t border-dashed border-black/15 dark:border-white/15">
                  <span>Total Amount</span>
                  <span className="text-xl font-bold text-accent">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-4 font-mono text-xs uppercase tracking-[0.14em]"
              >
                {isSubmitting ? (
                  <span>Processing Your Order...</span>
                ) : (
                  <>
                    <span>Place Order & Pay {formatPrice(total)}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>

              <div className="font-mono text-[11px] text-cloud/40 space-y-1.5 pt-2 text-center">
                <p className="flex items-center justify-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Payments secured by Paystack</span>
                </p>
                <p>
                  By placing an order, you agree to OLUDAX Concept&apos;s Terms of Service.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
