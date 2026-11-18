import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Eye,
  Sparkles,
  Gift,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Headphones,
  Check,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import {
  categories,
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
} from "@/lib/products";

export default function Home() {
  const bestSellers = getBestSellers().slice(0, 4);
  const newArrivals = getNewArrivals().slice(0, 4);

  // Category gradients matching Ēlan's rich gradient overlays
  const categoryGradients = [
    "from-blue-500/30 to-cyan-500/20",
    "from-amber-500/30 to-orange-500/20",
    "from-rose-400/30 to-pink-500/20",
    "from-teal-500/30 to-emerald-500/20",
    "from-violet-500/30 to-purple-500/20",
    "from-fuchsia-500/30 to-pink-500/20",
    "from-sky-500/30 to-indigo-500/20",
    "from-emerald-500/30 to-teal-500/20",
    "from-red-500/30 to-rose-500/20",
    "from-purple-500/30 to-indigo-500/20",
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-20 px-3 py-6 pt-20 sm:px-4 sm:pt-24 md:px-6 lg:px-8 lg:py-12 lg:pt-28">
      {/* ===== HERO / EDITORIAL SPOTLIGHT ===== */}
      <section className="relative overflow-hidden rounded-[28px] glass p-6 sm:p-10 lg:p-16 border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 text-center lg:text-left">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.16em] text-accent">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bespoke Gifting Studio • Lagos</span>
            </div>

            {/* Editorial Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-medium tracking-tight text-cloud leading-[1.08]">
              Gift More.
              <br />
              <span className="text-accent italic font-normal">Create More.</span>
            </h1>

            {/* Sub-description */}
            <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-cloud/60 max-w-lg mx-auto lg:mx-0">
              Thoughtfully curated bespoke gifts, engraved treasures, and personalized
              celebration packages crafted for Nigeria&apos;s most meaningful moments.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href="/shop"
                className="btn-primary w-full sm:w-auto px-8 py-3.5 text-xs font-mono uppercase tracking-[0.16em]"
              >
                Explore Catalog
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <Link
                href="/customize"
                className="btn-outline w-full sm:w-auto px-8 py-3.5 text-xs font-mono uppercase tracking-[0.16em]"
              >
                Customize Studio
              </Link>
            </div>

            {/* Micro Metadata */}
            <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 font-mono text-xs text-cloud/50">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-accent" />
                Fast Dispatch
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-accent" />
                Paystack Verified
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-accent" />
                100% Handcrafted
              </span>
            </div>
          </div>

          {/* Hero Visual Studio Badge */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
              {/* Rotating outer ring */}
              <div className="absolute inset-0 rounded-full border border-cloud/10 animate-[spin_24s_linear_infinite]" />
              <div className="absolute inset-6 rounded-full border border-dashed border-accent/30 animate-[spin_36s_linear_infinite_reverse]" />

              {/* Central Elevated Glass Disc */}
              <div className="glass w-64 h-64 rounded-full flex flex-col items-center justify-center text-center p-6 shadow-2xl border border-black/10 dark:border-white/10 group cursor-default">
                <div className="w-16 h-16 rounded-2xl bg-accent/20 border border-accent/30 text-accent flex items-center justify-center mb-3 shadow-inner group-hover:scale-105 transition-transform">
                  <Gift className="w-8 h-8" />
                </div>
                <span className="font-display text-2xl font-medium tracking-tight text-cloud">
                  Oludax
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent mt-1">
                  Concept Studio
                </span>
                <p className="font-mono text-[11px] text-cloud/40 mt-3">
                  ₦ Naira • Nationwide Delivery
                </p>
              </div>

              {/* Floating feature pills */}
              <div className="absolute top-4 right-4 glass px-3.5 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider text-cloud flex items-center gap-1.5 shadow-md">
                <span>🎁</span> Bespoke Hampers
              </div>
              <div className="absolute bottom-6 left-2 glass px-3.5 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider text-cloud flex items-center gap-1.5 shadow-md">
                <span>✨</span> Custom Mugs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SHOP BY CATEGORY (ĒLAN Aspect 4/5 Visual Grid) ===== */}
      <section aria-labelledby="categories-heading" className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2
              id="categories-heading"
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium text-cloud tracking-tight"
            >
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-cloud/50 mt-1">
              Curated collections for celebrations, corporate gifting, and intimate surprises.
            </p>
          </div>
          <Link
            href="/categories"
            className="hidden items-center gap-1 font-mono text-xs uppercase tracking-[0.16em] text-cloud/60 transition hover:text-accent sm:inline-flex"
          >
            View All
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 5-Column Aspect-4/5 Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.slice(0, 10).map((cat, idx) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative aspect-4/5 overflow-hidden rounded-[20px] border border-black/8 bg-panel transition duration-300 hover:border-black/20 dark:border-[rgba(244,244,242,0.08)] dark:hover:border-[rgba(244,244,242,0.2)]"
            >
              {/* Vibrant Atmospheric Linear Gradient */}
              <div
                aria-hidden="true"
                className={`absolute inset-0 bg-gradient-to-br ${
                  categoryGradients[idx % categoryGradients.length]
                }`}
              />

              {/* Decorative Emoji Icon Centerpiece */}
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <span className="text-5xl group-hover:scale-125 transition-transform duration-500 select-none opacity-90 drop-shadow-md">
                  {cat.icon}
                </span>
              </div>

              {/* Dark Gradient Overlay for Typography Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Bottom Category Label */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/70">
                  {cat.productCount} items
                </p>
                <h3 className="mt-0.5 font-display text-base sm:text-lg font-medium text-white truncate">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== CURATED BESTSELLERS (ĒLAN Catalog Grid) ===== */}
      <section aria-labelledby="bestsellers-heading" className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2
              id="bestsellers-heading"
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium text-cloud tracking-tight"
            >
              Curated Bestsellers
            </h2>
            <p className="text-xs sm:text-sm text-cloud/50 mt-1">
              Top selections loved by thousands of happy gift givers across Nigeria.
            </p>
          </div>
          <Link
            href="/shop?sort=best-selling"
            className="hidden items-center gap-1 font-mono text-xs uppercase tracking-[0.16em] text-cloud/60 transition hover:text-accent sm:inline-flex"
          >
            View Catalog
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 4-column Product Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ===== HOW OLUDAX CRAFTS YOUR STYLE (ĒLAN Explainer Section) ===== */}
      <section aria-labelledby="explainer-heading" className="space-y-12">
        <div className="mx-auto max-w-xl text-center">
          <h2
            id="explainer-heading"
            className="font-display text-2xl font-medium text-cloud sm:text-3xl tracking-tight"
          >
            How Oludax Crafts Your Style
          </h2>
          <p className="mt-2 text-sm text-cloud/50">
            Three simple steps from bespoke inspiration to unforgettable celebrations.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
          <div className="glass rounded-2xl p-6 transition duration-300 hover:bg-black/[0.04] dark:hover:bg-[rgba(244,244,242,0.08)] sm:p-8 space-y-3">
            <Eye className="h-6 w-6 text-accent mb-4" />
            <h3 className="font-display text-lg font-medium text-cloud">
              1. Browse & Select
            </h3>
            <p className="text-sm leading-relaxed text-cloud/50">
              Explore our curated gift boxes, personalized ceramic mugs, apparel, and
              fresh blooms tailored to any recipient.
            </p>
          </div>

          <div className="glass rounded-2xl p-6 transition duration-300 hover:bg-black/[0.04] dark:hover:bg-[rgba(244,244,242,0.08)] sm:p-8 space-y-3">
            <Sparkles className="h-6 w-6 text-accent mb-4" />
            <h3 className="font-display text-lg font-medium text-cloud">
              2. Personalize Live
            </h3>
            <p className="text-sm leading-relaxed text-cloud/50">
              Add recipient names, sentimental love notes, select custom colour palettes,
              and upload photo memories via our Customization Studio.
            </p>
          </div>

          <div className="glass rounded-2xl p-6 transition duration-300 hover:bg-black/[0.04] dark:hover:bg-[rgba(244,244,242,0.08)] sm:p-8 space-y-3">
            <Truck className="h-6 w-6 text-accent mb-4" />
            <h3 className="font-display text-lg font-medium text-cloud">
              3. Nationwide Dispatch
            </h3>
            <p className="text-sm leading-relaxed text-cloud/50">
              Each package is hand-wrapped in luxury presentation boxes and delivered
              speedily across all 36 Nigerian states.
            </p>
          </div>
        </div>
      </section>

      {/* ===== NEW ARRIVALS CATALOG SECTION ===== */}
      <section aria-labelledby="new-arrivals-heading" className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2
              id="new-arrivals-heading"
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium text-cloud tracking-tight"
            >
              Fresh New Arrivals
            </h2>
            <p className="text-xs sm:text-sm text-cloud/50 mt-1">
              The latest personalized treasures freshly added to our studio catalog.
            </p>
          </div>
          <Link
            href="/shop?sort=newest"
            className="hidden items-center gap-1 font-mono text-xs uppercase tracking-[0.16em] text-cloud/60 transition hover:text-accent sm:inline-flex"
          >
            View All
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ===== TRUST & QUALITY PILLARS ===== */}
      <section className="glass rounded-[24px] p-6 sm:p-8 border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-wider font-semibold text-cloud">
                Swift Delivery
              </p>
              <p className="text-xs text-cloud/50">Across Lagos & Nationwide</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-wider font-semibold text-cloud">
                Paystack Protected
              </p>
              <p className="text-xs text-cloud/50">Bank card, transfer, USSD</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-wider font-semibold text-cloud">
                Care Guarantee
              </p>
              <p className="text-xs text-cloud/50">100% Quality Assurance</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-wider font-semibold text-cloud">
                WhatsApp Concierge
              </p>
              <p className="text-xs text-cloud/50">Direct artisan support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
