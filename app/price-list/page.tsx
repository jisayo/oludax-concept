"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  MessageCircle,
  ExternalLink,
  Check,
  Search,
  Tag,
  Maximize2,
  X,
} from "lucide-react";
import { products, formatPrice } from "@/lib/products";

const PRICE_SHEETS = [
  {
    title: "Mugs, Phone Pouches & Headwears",
    image: "/images/catalog/price-list-mugs-caps.jpg",
    category: "Mugs & Headwear",
    highlights: ["Custom Mugs: ₦5,500 - ₦7,500", "Phone Cases: ₦5,000 - ₦6,000", "Bonnets & Hats: ₦3,000 - ₦8,000"],
  },
  {
    title: "Border Frames, Jewelry & Throw Pillows",
    image: "/images/catalog/price-list-frames-jewelry.jpg",
    category: "Frames & Jewelry",
    highlights: ["Border Frames: ₦8,500 - ₦15,000", "Jewelry: ₦11,000 - ₦20,000", "Throw Pillows: ₦10,000 - ₦18,000"],
  },
  {
    title: "Borderless Frames, Journals & Bottles",
    image: "/images/catalog/price-list-borderless-bottles.jpg",
    category: "Frames & Bottles",
    highlights: ["Borderless Frames: ₦4,000 - ₦8,500", "Journals: ₦5,500 - ₦8,000", "Bottles & Flasks: ₦4,000 - ₦10,000"],
  },
  {
    title: "Towels, T-Shirts & Souvenirs",
    image: "/images/catalog/price-list-towels-tshirts.jpg",
    category: "Apparel & Souvenirs",
    highlights: ["Embroidered Towels: ₦5,500 - ₦12,000", "Custom T-Shirts: ₦8,500 - ₦12,000", "Souvenirs: ₦1,200 - ₦2,000"],
  },
  {
    title: "Custom Cards, Magazines & Wall Collages",
    image: "/images/catalog/price-list-cards-magazines.jpg",
    category: "Prints & Magazines",
    highlights: ["Custom Cards: ₦1,500 - ₦4,500", "Milestone Magazine: ₦6,500 - ₦11,000", "Wall Collages: ₦3,000 - ₦4,000"],
  },
  {
    title: "Brand Logo Stickers & Labels",
    image: "/images/catalog/price-list-stickers.jpg",
    category: "Packaging & Stickers",
    highlights: ["Round/Square 3x3 (50 pcs): ₦4,000", "Round/Square (100 pcs): ₦7,500", "Rectangle 3.5x5: ₦5,000 - ₦9,000"],
  },
  {
    title: "Custom Carrier Nylons",
    image: "/images/catalog/price-list-nylons.jpg",
    category: "Packaging & Nylons",
    highlights: ["Small (50/100): ₦10,000 / ₦16,000", "Medium (50/100): ₦14,000 / ₦19,000", "Large (50/100): ₦19,500 / ₦28,000"],
  },
  {
    title: "Thank You Cards, Business Cards & Flyers",
    image: "/images/catalog/price-list-business-cards-flyers.jpg",
    category: "Stationery & Flyers",
    highlights: ["Thank You Cards: ₦4,000 - ₦7,000", "Business Cards: ₦6,500 - ₦11,000", "Paper Flyers A5/A4: ₦5,000 - ₦15,000"],
  },
];

export default function PriceListPage() {
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"catalog" | "sheets">("catalog");

  const filteredProducts = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-base text-cloud pt-20 sm:pt-24 lg:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 space-y-10">
        {/* Header Glass Banner */}
        <div className="glass rounded-[28px] p-6 sm:p-10 border border-black/8 dark:border-[rgba(244,244,242,0.08)] relative overflow-hidden">
          <nav className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-cloud/40 mb-3">
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-cloud/30" />
            <span className="text-accent font-semibold">Official Price List</span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official 2026 Price Guide • All Prices in NGN (₦)</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-cloud">
              Oludax Concept Price List
            </h1>

            <p className="text-cloud/60 text-xs sm:text-sm leading-relaxed">
              Explore the verified pricing for all bespoke frames, personalized mugs, custom apparel, executive stationery, carrier nylons, and milestone prints. Every item can be ordered directly online or via WhatsApp.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://wa.me/message/Y4CATULMNOZHK1?text=Hello%20Oludax%20Concept,%20I%20would%20like%20to%20place%20an%20order"
                target="_blank"
                rel="noreferrer"
                className="btn-primary py-2.5 px-6 font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-300" />
                <span>Instant WhatsApp Order (08144412006)</span>
              </a>

              <a
                href="https://wa.me/c/2348144412006"
                target="_blank"
                rel="noreferrer"
                className="btn-outline py-2.5 px-5 font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2"
              >
                <span>WhatsApp Catalog</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* View Switcher & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="inline-flex p-1 rounded-2xl glass border border-black/8 dark:border-white/10 shrink-0">
            <button
              onClick={() => setActiveTab("catalog")}
              className={`px-5 py-2 rounded-xl font-mono text-xs uppercase tracking-wider transition ${
                activeTab === "catalog"
                  ? "bg-accent text-white font-semibold shadow-sm"
                  : "text-cloud/60 hover:text-cloud"
              }`}
            >
              Interactive Catalog ({products.length})
            </button>
            <button
              onClick={() => setActiveTab("sheets")}
              className={`px-5 py-2 rounded-xl font-mono text-xs uppercase tracking-wider transition ${
                activeTab === "sheets"
                  ? "bg-accent text-white font-semibold shadow-sm"
                  : "text-cloud/60 hover:text-cloud"
              }`}
            >
              Original Sheets ({PRICE_SHEETS.length})
            </button>
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cloud/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products (e.g. borderless frame, magic mug, nylons)..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl glass border border-black/10 dark:border-white/10 text-xs text-cloud placeholder:text-cloud/40 focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* TAB 1: INTERACTIVE PRODUCT PRICE TABLE */}
        {activeTab === "catalog" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="glass rounded-[24px] p-5 sm:p-6 border border-black/8 dark:border-[rgba(244,244,242,0.08)] flex flex-col justify-between hover:border-accent/30 transition group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-accent font-semibold px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                        {prod.category}
                      </span>
                      <span className="font-mono text-xs font-bold text-accent">
                        Starting {formatPrice(prod.price)}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-medium text-cloud group-hover:text-accent transition-colors">
                      {prod.name}
                    </h3>

                    <p className="text-xs text-cloud/60 leading-relaxed line-clamp-2">
                      {prod.description}
                    </p>

                    {/* Variant options if available */}
                    {prod.customizationOptions?.designs && (
                      <div className="pt-2 border-t border-black/5 dark:border-white/5 space-y-1">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-cloud/40 block">
                          Tiers & Variants:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {prod.customizationOptions.designs.map((d, i) => (
                            <span
                              key={i}
                              className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 text-cloud/70"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-4 mt-4 border-t border-black/8 dark:border-white/10">
                    <Link
                      href={`/product/${prod.id}`}
                      className="btn-primary flex-1 py-2 text-xs font-mono uppercase tracking-wider text-center"
                    >
                      Personalize
                    </Link>
                    <a
                      href={`https://wa.me/message/Y4CATULMNOZHK1?text=Hello%20Oludax%20Concept,%20I%20would%20like%20to%20order%20${encodeURIComponent(prod.name)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-outline px-3 py-2 text-xs inline-flex items-center justify-center text-emerald-400"
                      title="Order on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ORIGINAL PRICE LIST SHEETS */}
        {activeTab === "sheets" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PRICE_SHEETS.map((sheet, idx) => (
                <div
                  key={idx}
                  className="glass rounded-[24px] overflow-hidden border border-black/8 dark:border-[rgba(244,244,242,0.08)] flex flex-col group hover:border-accent/40 transition"
                >
                  <div
                    className="relative aspect-square cursor-pointer overflow-hidden bg-black/10"
                    onClick={() => setSelectedSheet(sheet.image)}
                  >
                    <img
                      src={sheet.image}
                      alt={sheet.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-mono text-xs uppercase tracking-wider">
                      <Maximize2 className="w-4 h-4" />
                      <span>Click to Zoom</span>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-accent font-semibold block mb-1">
                        {sheet.category}
                      </span>
                      <h4 className="font-display font-medium text-sm text-cloud">
                        {sheet.title}
                      </h4>
                      <ul className="mt-2 space-y-1 font-mono text-[11px] text-cloud/60">
                        {sheet.highlights.map((h, i) => (
                          <li key={i} className="flex items-center gap-1.5 truncate">
                            <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                            <span className="truncate">{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => setSelectedSheet(sheet.image)}
                      className="btn-outline w-full py-1.5 text-[11px] font-mono uppercase tracking-wider text-center"
                    >
                      View Full Sheet
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedSheet && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedSheet(null)}
          >
            <div
              className="relative max-w-2xl w-full max-h-[90vh] bg-base rounded-3xl overflow-hidden p-2 border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedSheet(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="overflow-auto max-h-[85vh] rounded-2xl flex items-center justify-center">
                <img
                  src={selectedSheet}
                  alt="Price List Detail"
                  className="w-full h-auto object-contain rounded-xl"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
