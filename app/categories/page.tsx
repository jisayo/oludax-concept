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

        {/* Clean Categories Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-[20px] border border-black/8 bg-panel dark:border-[rgba(244,244,242,0.08)] hover:border-accent/40 dark:hover:border-accent/40 transition-all duration-300 hover:shadow-md aspect-[4/5]"
            >
              <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/8 dark:border-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>

              <div>
                <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-cloud/50">
                  {cat.productCount} items
                </p>
                <h3 className="mt-1 font-display text-sm sm:text-base font-medium text-cloud group-hover:text-accent transition-colors truncate">
                  {cat.name}
                </h3>
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
