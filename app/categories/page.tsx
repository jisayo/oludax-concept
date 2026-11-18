"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronRight, Sparkles } from "lucide-react";
import { categories } from "@/lib/products";

export default function CategoriesPage() {
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

        {/* Categories Grid (Aspect 4/5 ĒLAN style) */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative aspect-4/5 overflow-hidden rounded-[20px] border border-black/8 bg-panel transition duration-300 hover:border-black/20 dark:border-[rgba(244,244,242,0.08)] dark:hover:border-[rgba(244,244,242,0.2)]"
            >
              <div
                aria-hidden="true"
                className={`absolute inset-0 bg-gradient-to-br ${
                  categoryGradients[idx % categoryGradients.length]
                }`}
              />
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <span className="text-5xl group-hover:scale-125 transition-transform duration-500 select-none opacity-90 drop-shadow-md">
                  {cat.icon}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
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
