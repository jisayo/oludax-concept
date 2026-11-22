"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  ArrowRight,
  Truck,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { formatPrice } from "@/lib/products";

type SavedOrder = {
  ref: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    qty: number;
    customization?: {
      customerName?: string;
      message?: string;
      color?: string;
      designPreference?: string;
      specialInstructions?: string;
    };
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
  };
  paymentMethod: string;
  date: string;
};

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const refParam = searchParams ? searchParams.get("ref") : null;
  const referenceParam = searchParams ? (searchParams.get("reference") || searchParams.get("trxref")) : null;

  const [order, setOrder] = useState<SavedOrder | null>(null);

  useEffect(() => {
    // 1. If Paystack returned a reference, trigger verification API
    if (referenceParam) {
      fetch(`/api/paystack/verify?reference=${encodeURIComponent(referenceParam)}`)
        .then((res) => res.json())
        .catch((err) => console.warn("Payment verify warning:", err));
    }

    // 2. Fetch order from server API if ref is present
    const targetRef = refParam || referenceParam;
    if (targetRef) {
      fetch(`/api/orders/${encodeURIComponent(targetRef)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.order) {
            const apiOrder = data.order;
            setOrder({
              ref: apiOrder.orderRef,
              items: (apiOrder.items || []).map((it: any) => ({
                id: it.productId,
                name: it.name,
                price: it.price,
                qty: it.quantity,
                customization: it.customization,
              })),
              subtotal: apiOrder.subtotal,
              deliveryFee: apiOrder.deliveryFee,
              total: apiOrder.total,
              customer: {
                fullName: apiOrder.customerName,
                email: apiOrder.customerEmail,
                phone: apiOrder.customerPhone,
                address: apiOrder.deliveryAddress,
                city: apiOrder.deliveryCity,
                state: apiOrder.deliveryState,
              },
              paymentMethod: apiOrder.paymentMethod,
              date: apiOrder.createdAt,
            });
            return;
          }
          throw new Error("Not in API");
        })
        .catch(() => {
          // Fallback to localStorage if API request did not find it
          try {
            if (refParam) {
              const stored = localStorage.getItem(`order_${refParam}`);
              if (stored) {
                setOrder(JSON.parse(stored));
              }
            }
          } catch {}
        });
    } else {
      // Direct localStorage check
      try {
        const stored = localStorage.getItem(`order_${refParam}`);
        if (stored) {
          setOrder(JSON.parse(stored));
        }
      } catch {}
    }
  }, [refParam, referenceParam]);

  const displayRef = refParam || order?.ref || "";

  return (
    <div className="min-h-screen bg-base text-cloud pt-20 sm:pt-24 lg:pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Success Card Header */}
        <div className="glass rounded-[28px] p-8 sm:p-12 text-center mb-8 border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/25 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="font-mono text-[10px] uppercase tracking-wider text-accent bg-accent/10 px-3 py-1 rounded-full inline-block mb-3 border border-accent/20">
            Payment Confirmed
          </span>

          <h1 className="font-display font-medium text-2xl sm:text-3xl lg:text-4xl text-cloud tracking-tight mb-2">
            Thank You for Your Order!
          </h1>
          <p className="text-cloud/50 text-xs sm:text-sm max-w-md mx-auto mb-6">
            We have received your order and our team in Ile-Ife has begun gift customization and hand-packaging.
          </p>

          {displayRef && (
            <div className="glass border border-black/10 dark:border-white/10 rounded-full px-5 py-2 inline-flex items-center gap-3">
              <span className="font-mono text-xs text-cloud/50">Order Reference:</span>
              <span className="font-mono font-bold text-accent text-sm tracking-wider">
                #{displayRef}
              </span>
            </div>
          )}
        </div>

        {/* Order Details Breakdown */}
        {order && (
          <div className="glass rounded-[24px] p-6 sm:p-8 space-y-6 mb-8 border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
            <h2 className="font-display font-medium text-lg text-cloud pb-3 border-b border-black/8 dark:border-[rgba(244,244,242,0.08)]">
              Order Details & Destination
            </h2>

            {/* Recipient & Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-black/5 dark:bg-white/5 rounded-2xl p-4 border border-black/5 dark:border-white/5">
              <div>
                <span className="text-cloud/40 uppercase tracking-wider block mb-1">
                  Destination
                </span>
                <p className="font-semibold text-cloud">
                  {order.customer.fullName}
                </p>
                <p className="text-cloud/70">{order.customer.address}</p>
                <p className="text-cloud/70">
                  {order.customer.city}, {order.customer.state}
                </p>
                <p className="text-cloud/70 mt-1">{order.customer.phone}</p>
              </div>

              <div>
                <span className="text-cloud/40 uppercase tracking-wider block mb-1">
                  Payment Status
                </span>
                <p className="font-semibold text-emerald-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Authorized via Paystack
                </p>
                <p className="text-cloud/50 text-[11px] mt-2">
                  Receipt sent to: <strong>{order.customer.email}</strong>
                </p>
              </div>
            </div>

            {/* Ordered Items List */}
            <div className="divide-y divide-black/8 dark:divide-white/10">
              {order.items.map((it, idx) => (
                <div key={idx} className="py-3 flex justify-between items-start text-xs font-mono">
                  <div>
                    <h4 className="font-semibold text-cloud">
                      {it.name} <span className="text-cloud/40">× {it.qty}</span>
                    </h4>
                    {it.customization?.customerName && (
                      <span className="text-[10px] text-accent block">
                        Name: {it.customization.customerName}
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-cloud">
                    {formatPrice(it.price * it.qty)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total breakdown */}
            <div className="pt-4 border-t border-black/8 dark:border-[rgba(244,244,242,0.08)] space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-cloud/60">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-cloud/60">
                <span>Delivery Fee</span>
                <span>
                  {order.deliveryFee === 0 ? "FREE" : formatPrice(order.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-cloud pt-2 border-t border-dashed border-black/15 dark:border-white/15">
                <span>Total Paid</span>
                <span className="text-accent">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={displayRef ? `/track?ref=${encodeURIComponent(displayRef)}` : "/track"}
            className="btn-primary py-3.5 px-8 font-mono text-xs uppercase tracking-[0.14em] flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order Status</span>
          </Link>
          <Link
            href="/shop"
            className="btn-outline py-3.5 px-8 font-mono text-xs uppercase tracking-[0.14em] flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-base flex items-center justify-center p-8">
          <div className="w-10 h-10 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
