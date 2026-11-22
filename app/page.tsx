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
  Frame,
  Layers,
  Printer,
  Heart,
  MessageCircle,
  ExternalLink,
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

  return (
    <div className="mx-auto w-full max-w-7xl space-y-20 px-3 py-6 pt-20 sm:px-4 sm:pt-24 md:px-6 lg:px-8 lg:py-12 lg:pt-28">
      {/* ===== HERO / EDITORIAL SPOTLIGHT ===== */}
      <section className="relative overflow-hidden rounded-[28px] glass p-6 sm:p-10 lg:p-16 border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
        <div className="relative grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 text-center lg:text-left">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.16em] text-accent">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Your Number One Gift Plug • Est. 2022</span>
            </div>

            {/* Editorial Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-medium tracking-tight text-cloud leading-[1.08]">
              Gift More.
              <br />
              <span className="text-accent italic font-normal">Create Keepsakes.</span>
            </h1>

            {/* Sub-description with authentic story */}
            <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-cloud/60 max-w-lg mx-auto lg:mx-0">
              Founded in 2022, <strong className="text-cloud font-semibold">Oludax Concept</strong> was born from a passion for creativity and the desire to bring beautiful ideas to life. From custom acrylic frames and personalized gift packages to business branding and luxury prints.
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
              <a
                href="https://wa.me/message/Y4CATULMNOZHK1"
                target="_blank"
                rel="noreferrer"
                className="btn-outline w-full sm:w-auto px-6 py-3.5 text-xs font-mono uppercase tracking-[0.16em] inline-flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-500" />
                <span>WhatsApp Plug</span>
              </a>
            </div>

            {/* Micro Metadata */}
            <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 font-mono text-xs text-cloud/50">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-accent" />
                Frames • Brand • Print
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-accent" />
                Paystack Verified
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-accent" />
                Nationwide Dispatch
              </span>
            </div>
          </div>

          {/* Hero Visual Studio Showcase (Authentic Product Photography) */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-md p-6 glass rounded-[32px] border border-black/10 dark:border-white/10 shadow-2xl space-y-4">
              {/* Product Gallery Strip */}
              <div className="grid grid-cols-3 gap-3">
                <div className="aspect-square rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] p-2 flex items-center justify-center border border-black/8 dark:border-white/8 hover:scale-105 transition-transform duration-300">
                  <img
                    src="/images/products/giftbox-luxury.png"
                    alt="Luxury Gift Hamper"
                    className="w-full h-full object-contain drop-shadow"
                  />
                </div>
                <div className="aspect-square rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] p-2 flex items-center justify-center border border-black/8 dark:border-white/8 hover:scale-105 transition-transform duration-300">
                  <img
                    src="/images/products/borderless-frame.png"
                    alt="Keepsake Frame"
                    className="w-full h-full object-contain drop-shadow"
                  />
                </div>
                <div className="aspect-square rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] p-2 flex items-center justify-center border border-black/8 dark:border-white/8 hover:scale-105 transition-transform duration-300">
                  <img
                    src="/images/products/custom-mug.png"
                    alt="Personalized Mug"
                    className="w-full h-full object-contain drop-shadow"
                  />
                </div>
              </div>

              {/* Studio Bio Card */}
              <div className="pt-2 border-t border-black/8 dark:border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-medium text-lg text-cloud">
                      Oludax Concept
                    </h3>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-accent font-semibold">
                      Your Number One Gift Plug
                    </p>
                  </div>
                  <span className="font-mono text-[10px] text-cloud/60 bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-full border border-black/8 dark:border-white/10">
                    Est. 2022
                  </span>
                </div>
                <p className="text-xs text-cloud/70 leading-relaxed">
                  Ile-Ife & Akure customized gifting & branding store. Custom frames, personalized corporate souvenirs, quality print stationery, and celebration packages.
                </p>
                <div className="flex items-center justify-between pt-2 text-[11px] font-mono text-cloud/60">
                  <span className="flex items-center gap-1 text-emerald-500 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Accepting Orders
                  </span>
                  <span>📍 Ile-Ife, Osun State</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SHOP BY CATEGORY (Real Photography Grid) ===== */}
      <section aria-labelledby="categories-heading" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2
              id="categories-heading"
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium text-cloud tracking-tight"
            >
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-cloud/70 mt-1 max-w-xl">
              Browse custom frames, personalized mugs, apparel, luxury hampers, and branded souvenirs.
            </p>
          </div>
          <Link
            href="/categories"
            className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-[0.16em] text-cloud/70 transition hover:text-accent font-medium self-start sm:self-auto"
          >
            <span>View All Collections</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 4-Column Balanced Real Photography Grid (2 rows of 4 = 8 categories) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 md:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative flex flex-col rounded-[22px] border border-black/10 dark:border-white/10 bg-panel hover:border-accent/50 dark:hover:border-accent/50 transition-all duration-300 hover:shadow-xl overflow-hidden"
            >
              {/* Product Photograph Container */}
              <div className="aspect-square w-full bg-black/[0.02] dark:bg-white/[0.03] p-5 sm:p-6 flex items-center justify-center relative overflow-hidden">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500 drop-shadow-sm"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent text-2xl font-bold font-display">
                    {cat.name.charAt(0)}
                  </div>
                )}
                {/* Item Count Badge */}
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider font-semibold uppercase bg-white/95 dark:bg-[#141418]/95 text-cloud border border-black/10 dark:border-white/15 shadow-sm">
                  {cat.productCount} items
                </span>
              </div>

              {/* Category Info */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between border-t border-black/8 dark:border-white/8 bg-panel">
                <div>
                  <h3 className="font-display text-base sm:text-lg font-medium text-cloud group-hover:text-accent transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-cloud/60 mt-1 line-clamp-1 font-body">
                    {cat.description}
                  </p>
                </div>
                <div className="pt-3 mt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between font-mono text-[11px] text-accent font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>Shop Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== THE 3 SIGNATURE PILLARS: FRAME • BRAND • PRINT ===== */}
      <section aria-labelledby="pillars-heading" className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-accent mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Our Core Offerings</span>
            </div>
            <h2
              id="pillars-heading"
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium text-cloud tracking-tight"
            >
              Frames • Branding • Printing
            </h2>
            <p className="text-xs sm:text-sm text-cloud/70 mt-1 max-w-xl">
              From cherished photo frames to business branding and luxury print stationery.
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden items-center gap-1 font-mono text-xs uppercase tracking-[0.16em] text-cloud/70 transition hover:text-accent sm:inline-flex"
          >
            Explore All Offerings
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: FRAME */}
          <div className="glass rounded-[24px] p-6 sm:p-8 border border-black/8 dark:border-[rgba(244,244,242,0.08)] flex flex-col justify-between relative overflow-hidden group hover:border-accent/40 transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent">
                <Frame className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                  Keepsakes & Wall Art
                </span>
                <h3 className="font-display text-2xl font-medium text-cloud">
                  FRAMES
                </h3>
                <p className="text-xs sm:text-sm text-cloud/70 italic leading-relaxed">
                  &ldquo;Turning your special moments into beautiful keepsakes.&rdquo;
                </p>
              </div>

              <div className="pt-2 border-t border-black/8 dark:border-white/10">
                <p className="font-mono text-[10px] uppercase tracking-wider text-cloud/40 mb-2.5">
                  Available Formats:
                </p>
                <ul className="space-y-1.5 font-mono text-xs text-cloud/70">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Borderless & Border Frames
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Crystal Acrylic Floating Frames
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Vintage Polaroid Keepsake Frames
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Pinterest Aesthetic Displays
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Personalized Wall Photo Collages
                  </li>
                </ul>
              </div>
            </div>

            <Link
              href="/shop?category=frames"
              className="mt-6 btn-outline w-full py-2.5 text-xs font-mono uppercase tracking-[0.14em] text-center"
            >
              Shop Frames
            </Link>
          </div>

          {/* Pillar 2: BRAND */}
          <div className="glass rounded-[24px] p-6 sm:p-8 border border-black/8 dark:border-[rgba(244,244,242,0.08)] flex flex-col justify-between relative overflow-hidden group hover:border-accent/40 transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent">
                <Layers className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                  Pillar 02 • Merchandise
                </span>
                <h3 className="font-display text-2xl font-medium text-cloud">
                  BRAND
                </h3>
                <p className="text-xs sm:text-sm text-cloud/60 italic leading-relaxed">
                  &ldquo;Helping you gift personal gifts and give your business a look that stands out.&rdquo;
                </p>
              </div>

              <div className="pt-2 border-t border-black/8 dark:border-white/10">
                <p className="font-mono text-[10px] uppercase tracking-wider text-cloud/40 mb-2.5">
                  Available Items:
                </p>
                <ul className="space-y-1.5 font-mono text-xs text-cloud/70">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Customized Mugs & Thermal Bottles
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Executive Journals & Engraved Pens
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Custom T-Shirts & Face Caps
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Tote Bags & Silk Satin Bonnets
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Branded Retail Nylons & Souvenirs
                  </li>
                </ul>
              </div>
            </div>

            <Link
              href="/shop?category=branding"
              className="mt-6 btn-outline w-full py-2.5 text-xs font-mono uppercase tracking-[0.14em] text-center"
            >
              Explore Branding
            </Link>
          </div>

          {/* Pillar 3: PRINT */}
          <div className="glass rounded-[24px] p-6 sm:p-8 border border-black/8 dark:border-[rgba(244,244,242,0.08)] flex flex-col justify-between relative overflow-hidden group hover:border-accent/40 transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent">
                <Printer className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                  Pillar 03 • Publishing
                </span>
                <h3 className="font-display text-2xl font-medium text-cloud">
                  PRINT
                </h3>
                <p className="text-xs sm:text-sm text-cloud/60 italic leading-relaxed">
                  &ldquo;Bringing your ideas to life through print.&rdquo;
                </p>
              </div>

              <div className="pt-2 border-t border-black/8 dark:border-white/10">
                <p className="font-mono text-[10px] uppercase tracking-wider text-cloud/40 mb-2.5">
                  Available Prints:
                </p>
                <ul className="space-y-1.5 font-mono text-xs text-cloud/70">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Magazines & Mini Booklets
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Business Flyers, Banners & Posters
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Custom Invitations & Event Programmes
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Thank You & Luxury Greeting Cards
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Commemorative Certificates
                  </li>
                </ul>
              </div>
            </div>

            <Link
              href="/shop?category=prints"
              className="mt-6 btn-outline w-full py-2.5 text-xs font-mono uppercase tracking-[0.14em] text-center"
            >
              Order Prints
            </Link>
          </div>
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
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ===== HOW ORDERING WORKS ===== */}
      <section aria-labelledby="explainer-heading" className="space-y-12">
        <div className="mx-auto max-w-xl text-center">
          <h2
            id="explainer-heading"
            className="font-display text-2xl font-medium text-cloud sm:text-3xl tracking-tight"
          >
            How Ordering Works
          </h2>
          <p className="mt-2 text-sm text-cloud/70">
            Three simple steps from selecting your gift to nationwide doorstep delivery.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
          <div className="glass rounded-2xl p-6 transition duration-300 hover:bg-black/[0.04] dark:hover:bg-[rgba(244,244,242,0.08)] sm:p-8 space-y-3">
            <Eye className="h-6 w-6 text-accent mb-4" />
            <h3 className="font-display text-lg font-medium text-cloud">
              1. Choose Your Gift
            </h3>
            <p className="text-sm leading-relaxed text-cloud/70">
              Browse our catalog of custom photo frames, personalized ceramic mugs, apparel, and luxury hampers.
            </p>
          </div>

          <div className="glass rounded-2xl p-6 transition duration-300 hover:bg-black/[0.04] dark:hover:bg-[rgba(244,244,242,0.08)] sm:p-8 space-y-3">
            <Sparkles className="h-6 w-6 text-accent mb-4" />
            <h3 className="font-display text-lg font-medium text-cloud">
              2. Add Personal Touch
            </h3>
            <p className="text-sm leading-relaxed text-cloud/70">
              Upload your photos, specify recipient names, add heartfelt messages, or choose your custom colors.
            </p>
          </div>

          <div className="glass rounded-2xl p-6 transition duration-300 hover:bg-black/[0.04] dark:hover:bg-[rgba(244,244,242,0.08)] sm:p-8 space-y-3">
            <Truck className="h-6 w-6 text-accent mb-4" />
            <h3 className="font-display text-lg font-medium text-cloud">
              3. Swift Nationwide Dispatch
            </h3>
            <p className="text-sm leading-relaxed text-cloud/70">
              Crafted in Ile-Ife, beautifully packaged with love, and dispatched safely across Osun, Ondo, and all Nigerian states.
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

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ===== THE CEO & BRAND STORY (Precious Oluwatofunmi) ===== */}
      <section className="glass rounded-[28px] p-6 sm:p-10 lg:p-12 border border-black/8 dark:border-[rgba(244,244,242,0.08)] relative overflow-hidden">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Meet The CEO • The Creative Mind</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-cloud">
              Who is Oludax? Meet Precious Oluwatofunmi
            </h2>

            <p className="text-sm sm:text-base leading-relaxed text-cloud/70">
              Meet <strong>Precious Oluwatofunmi</strong>, the student entrepreneur and creative mind behind <strong>Oludax Concept</strong>. With a love for creativity and an eye for beautiful things, Precious is passionate about creating pieces that feel personal, thoughtful, and special.
            </p>

            <p className="text-xs sm:text-sm leading-relaxed text-cloud/60">
              Through Oludax Concept, she brings ideas to life through frames, customised gifts, business branding, and printing. As she continues to balance school and entrepreneurship, Precious is steadily building a brand that reflects her creativity, passion, and vision.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="https://wa.me/p/25445532225087863/2348144412006"
                target="_blank"
                rel="noreferrer"
                className="btn-primary px-6 py-3 text-xs font-mono uppercase tracking-[0.14em] inline-flex items-center gap-2"
              >
                <span>Read Verified Client Reviews</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://wa.me/c/2348144412006"
                target="_blank"
                rel="noreferrer"
                className="btn-outline px-6 py-3 text-xs font-mono uppercase tracking-[0.14em] inline-flex items-center gap-2"
              >
                <span>View WhatsApp Catalog</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="p-6 rounded-[24px] glass border border-black/8 dark:border-[rgba(244,244,242,0.08)] space-y-4 max-w-sm w-full">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                  Client Proof & Trust
                </span>
                <span className="text-xs text-amber-400 flex items-center gap-1 font-mono">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  5.0 Rating
                </span>
              </div>
              <p className="text-xs leading-relaxed text-cloud/80 italic">
                &ldquo;Testimonials from happy clients 💖✨ More than enough proof to trust our brand. From custom frames to thoughtful gift boxes, our clients always leave with smiles.&rdquo;
              </p>
              <div className="pt-2 flex items-center justify-between font-mono text-[11px] text-cloud/50">
                <span>📍 Ile-Ife & Akure, Nigeria</span>
                <span className="text-emerald-500 font-medium">WhatsApp Verified</span>
              </div>
            </div>
          </div>
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
              <p className="text-xs text-cloud/50">Across Ile-Ife, Akure & Nationwide</p>
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
