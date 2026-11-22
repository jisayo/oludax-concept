"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Truck,
  Search,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Package,
  MapPin,
  Clock,
  AlertCircle,
} from "lucide-react";
import { formatPrice } from "@/lib/products";

type TrackingMilestone = {
  key: string;
  title: string;
  desc: string;
  time: string;
  isCompleted: boolean;
  isCurrent: boolean;
};

type OrderData = {
  orderRef: string;
  customerName: string;
  deliveryCity: string;
  deliveryState: string;
  orderStatus: string;
  paymentStatus: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
};

function TrackContent() {
  const searchParams = useSearchParams();
  const initialRef = (typeof searchParams?.get === "function" ? searchParams.get("ref") : "") || "";

  const [orderQuery, setOrderQuery] = useState(initialRef);
  const [searchedOrder, setSearchedOrder] = useState<string | null>(initialRef || null);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [milestones, setMilestones] = useState<TrackingMilestone[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchOrder = async (ref: string) => {
    if (!ref.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const cleanRef = ref.trim().replace(/^#/, "");
      const res = await fetch(`/api/orders/${encodeURIComponent(cleanRef)}`);
      const data = await res.json();

      if (data.success && data.order) {
        setOrderData(data.order);
        setMilestones(data.milestones || []);
      } else {
        setErrorMessage(data.error || `Order #${ref} not found.`);
        setOrderData(null);
      }
    } catch {
      setErrorMessage("Could not connect to tracking server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchedOrder) {
      fetchOrder(searchedOrder);
    }
  }, [searchedOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;
    setSearchedOrder(orderQuery.trim());
  };

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
            <span className="text-accent font-semibold">Track Order</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-accent/15 text-accent px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider mb-2 border border-accent/25">
                <Truck className="w-3.5 h-3.5" />
                <span>Real-Time Dispatch Updates</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-cloud">
                Track Your Gift Package
              </h1>
              <p className="text-cloud/50 text-xs sm:text-sm mt-1 max-w-xl">
                Enter your order reference number to view artisan personalization status and courier transit milestones.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          {/* Search Card */}
          <div className="glass rounded-[24px] p-6 sm:p-8 border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cloud/40" />
                <input
                  type="text"
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  placeholder="Enter order reference (e.g. OLU-XXXXXX)"
                  className="w-full pl-11 pr-4 py-3 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs sm:text-sm font-mono text-cloud focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary py-3 px-8 font-mono text-xs uppercase tracking-wider shrink-0 disabled:opacity-50"
              >
                {isLoading ? "Searching..." : "Track Package"}
              </button>
            </form>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="glass rounded-[20px] p-5 border border-rose-500/20 text-rose-500 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-xs sm:text-sm font-mono">{errorMessage}</p>
            </div>
          )}

          {/* Initial Guidance Card when no search performed yet */}
          {!orderData && !errorMessage && !isLoading && (
            <div className="glass rounded-[24px] p-8 sm:p-12 text-center border border-black/8 dark:border-[rgba(244,244,242,0.08)] space-y-3">
              <Package className="w-12 h-12 text-cloud/20 mx-auto" />
              <h3 className="font-display font-medium text-lg text-cloud">
                Track Your Custom Keepsake
              </h3>
              <p className="text-xs sm:text-sm text-cloud/50 max-w-md mx-auto leading-relaxed">
                Enter your order reference number (e.g. OLU-XXXXXX) from your confirmation receipt, SMS, or WhatsApp notification above to view live production milestones.
              </p>
            </div>
          )}

          {/* Timeline Card */}
          {orderData && (
            <div className="glass rounded-[24px] p-6 sm:p-10 border border-black/8 dark:border-[rgba(244,244,242,0.08)] space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-black/8 dark:border-[rgba(244,244,242,0.08)]">
                <div>
                  <span className="font-mono text-xs text-cloud/40 block">
                    Tracking Information for
                  </span>
                  <span className="font-mono font-bold text-lg sm:text-xl text-accent">
                    #{orderData.orderRef}
                  </span>
                </div>
                <span className="glass rounded-full px-3.5 py-1.5 font-mono text-xs text-accent border border-accent/25 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {orderData.orderStatus}
                </span>
              </div>

              {/* Recipient & Destination Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-black/5 dark:bg-white/5 rounded-2xl p-4 border border-black/5 dark:border-white/5">
                <div>
                  <span className="text-cloud/40 uppercase tracking-wider block mb-1">
                    Recipient
                  </span>
                  <p className="font-semibold text-cloud">{orderData.customerName}</p>
                  <p className="text-cloud/70">
                    {orderData.deliveryCity}, {orderData.deliveryState}
                  </p>
                </div>
                <div>
                  <span className="text-cloud/40 uppercase tracking-wider block mb-1">
                    Package Items
                  </span>
                  <p className="font-semibold text-cloud">
                    {orderData.items.map((i) => `${i.name} (×${i.quantity})`).join(", ")}
                  </p>
                </div>
              </div>

              {/* Timeline Steps */}
              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-black/10 dark:before:bg-white/10">
                {milestones.map((step) => {
                  return (
                    <div key={step.key} className="relative flex items-start gap-4">
                      {/* Status Icon Indicator */}
                      <div
                        className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          step.isCompleted
                            ? "bg-accent text-white"
                            : step.isCurrent
                            ? "bg-accent/20 text-accent border border-accent ring-4 ring-accent/15"
                            : "bg-black/10 dark:bg-white/10 text-cloud/30"
                        }`}
                      >
                        {step.isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : step.isCurrent ? (
                          <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            className={`font-mono text-sm font-semibold ${
                              step.isCompleted || step.isCurrent
                                ? "text-cloud"
                                : "text-cloud/40"
                            }`}
                          >
                            {step.title}
                          </h3>
                          <span className="font-mono text-[10px] text-cloud/40">
                            {step.time}
                          </span>
                        </div>
                        <p className="text-xs text-cloud/50 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Need Assistance Banner */}
              <div className="glass rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
                <div>
                  <h4 className="font-display font-medium text-sm text-cloud">
                    Need to update delivery instructions?
                  </h4>
                  <p className="text-xs text-cloud/50 mt-0.5">
                    Reach out to our dispatch desk with your order reference number.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="btn-outline py-2 px-5 font-mono text-xs uppercase tracking-wider shrink-0"
                >
                  Contact Courier Desk
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-base pt-28 text-center text-cloud font-mono text-xs">
          Loading tracking...
        </div>
      }
    >
      <TrackContent />
    </Suspense>
  );
}
