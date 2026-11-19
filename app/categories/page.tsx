"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronRight, Sparkles } from "lucide-react";
import { categories } from "@/lib/products";

export default function CategoriesPage() {
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
            <span className="text-accent font-semibold">Categories</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-cloud">
                Collections & Categories
              </h1>
              <p className="text-cloud/50 text-xs sm:text-sm mt-1 max-w-xl">
                Explore our full spectrum of curated gift boxes, personalized keepsakes, floral creations, and celebration packages.
              </p>
            </div>
            <Link
              href="/shop"
              className="glass rounded-full px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-cloud/80 hover:text-accent transition-colors self-start md:self-auto flex items-center gap-1.5"
            >
              <span>View Catalog</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
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

        {/* Custom Studio Banner */}
        <div className="mt-12 glass rounded-[24px] p-6 sm:p-10 border border-black/8 dark:border-[rgba(244,244,242,0.08)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-accent/15 text-accent px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider border border-accent/25">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bespoke Personalization</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-cloud">
              Looking for something custom crafted?
            </h3>
            <p className="text-cloud/50 text-xs sm:text-sm">
              Use our dedicated Customization Studio to design bespoke items with your names, custom colors, sizing, and personalized messages.
            </p>
          </div>
          <Link
            href="/customize"
            className="btn-primary px-8 py-3.5 font-mono text-xs uppercase tracking-[0.14em] shrink-0"
          >
            <span>Open Studio</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
