"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ChevronRight,
  X,
  ArrowUpDown,
  Tag,
  Check,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import {
  products,
  categories,
  searchProducts,
  formatPrice,
  Product,
} from "@/lib/products";

type SortOption =
  | "featured"
  | "newest"
  | "price-low"
  | "price-high"
  | "best-selling"
  | "name";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest Arrivals" },
  { value: "best-selling", label: "Most Popular" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name", label: "Name: A to Z" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialSort = (searchParams.get("sort") as SortOption) || "featured";
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result: Product[] = searchQuery.trim()
      ? searchProducts(searchQuery)
      : [...products];

    // Category filter
    if (selectedCategory) {
      result = result.filter((p) => p.categorySlug === selectedCategory);
    }

    // Price filter
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Stock filter
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
        break;
      case "best-selling":
        result.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "featured":
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy, priceRange, inStockOnly]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const activeCategory = categories.find((c) => c.slug === selectedCategory);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setPriceRange([0, 100000]);
    setInStockOnly(false);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    Boolean(selectedCategory) ||
    Boolean(searchQuery.trim()) ||
    inStockOnly ||
    priceRange[0] > 0 ||
    priceRange[1] < 100000;

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
            <Link
              href="/shop"
              onClick={() => setSelectedCategory("")}
              className={`${
                !selectedCategory ? "text-accent font-semibold" : "hover:text-accent"
              }`}
            >
              Catalog
            </Link>
            {activeCategory && (
              <>
                <ChevronRight className="w-3 h-3 text-cloud/30" />
                <span className="text-cloud font-semibold">
                  {activeCategory.name}
                </span>
              </>
            )}
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-cloud">
                {activeCategory ? activeCategory.name : "Shop All Gifts"}
              </h1>
              <p className="text-cloud/50 text-xs sm:text-sm mt-1 max-w-xl">
                {activeCategory
                  ? activeCategory.description
                  : "Discover thoughtful bespoke gifts, personalized ceramic keepsakes, and celebration packages."}
              </p>
            </div>
            <div className="glass flex items-center gap-2 rounded-full px-4 py-2 border border-black/8 dark:border-[rgba(244,244,242,0.08)] self-start md:self-auto font-mono text-xs text-cloud/80">
              <Tag className="w-3.5 h-3.5 text-accent" />
              <span>Over ₦50,000 gets Free Delivery</span>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ============================================================= */}
          {/* DESKTOP SIDEBAR FILTERS                                      */}
          {/* ============================================================= */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-28 glass rounded-[20px] p-5 border border-black/8 dark:border-[rgba(244,244,242,0.08)] space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-black/8 dark:border-[rgba(244,244,242,0.08)]">
                <h2 className="font-display font-medium text-base text-cloud">
                  Filters
                </h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="font-mono text-[11px] uppercase tracking-wider text-accent hover:brightness-110 transition-colors"
                  >
                    Reset all
                  </button>
                )}
              </div>

              {/* Search input */}
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-cloud/40 block mb-2">
                  Search Catalog
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cloud/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Mugs, boxes, flowers..."
                    className="w-full pl-9 pr-7 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-cloud placeholder:text-cloud/40 focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-cloud/40 hover:text-cloud"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-cloud/40 block mb-2">
                  Collections
                </label>
                <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                  <button
                    onClick={() => {
                      setSelectedCategory("");
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono uppercase tracking-[0.12em] transition-all flex items-center justify-between ${
                      !selectedCategory
                        ? "bg-accent text-white font-semibold"
                        : "text-cloud/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-cloud"
                    }`}
                  >
                    <span>All Products</span>
                    <span className="text-[10px] opacity-80">
                      {products.length}
                    </span>
                  </button>
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.slug;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.slug);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between ${
                          isSelected
                            ? "bg-accent text-white font-mono uppercase tracking-[0.12em] font-semibold"
                            : "text-cloud/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-cloud"
                        }`}
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <span>{cat.icon}</span>
                          <span className="truncate">{cat.name}</span>
                        </span>
                        <span className="font-mono text-[10px] opacity-70">
                          {cat.productCount}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-cloud/40 block mb-2">
                  Price Budget
                </label>
                <div className="space-y-1">
                  {[
                    { label: "All Prices", range: [0, 100000] },
                    { label: "Under ₦10,000", range: [0, 10000] },
                    { label: "₦10,000 – ₦20,000", range: [10000, 20000] },
                    { label: "₦20,000 – ₦35,000", range: [20000, 35000] },
                    { label: "Above ₦35,000", range: [35000, 100000] },
                  ].map((tier) => {
                    const isSelected =
                      priceRange[0] === tier.range[0] &&
                      priceRange[1] === tier.range[1];
                    return (
                      <button
                        key={tier.label}
                        onClick={() => {
                          setPriceRange(tier.range as [number, number]);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${
                          isSelected
                            ? "border border-accent/40 bg-accent/15 text-accent font-semibold"
                            : "text-cloud/60 hover:text-cloud hover:bg-black/5 dark:hover:bg-white/5"
                        }`}
                      >
                        <span>{tier.label}</span>
                        {isSelected && <Check className="w-3 h-3 text-accent" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stock Filter */}
              <div className="pt-2 border-t border-black/8 dark:border-[rgba(244,244,242,0.08)]">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => {
                      setInStockOnly(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 rounded border-black/20 dark:border-white/20 text-accent focus:ring-accent cursor-pointer"
                  />
                  <span className="text-xs text-cloud/80 font-mono">
                    In-Stock Items Only
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* ============================================================= */}
          {/* MAIN CATALOGUE GRID                                          */}
          {/* ============================================================= */}
          <main className="flex-1">
            {/* Top Toolbar */}
            <div className="glass rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="lg:hidden inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 text-accent font-mono text-xs uppercase tracking-wider"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filters
                </button>

                <p className="font-mono text-xs text-cloud/50">
                  Showing{" "}
                  <span className="font-semibold text-cloud">
                    {filteredProducts.length}
                  </span>{" "}
                  creations
                </p>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-cloud/40 hidden sm:inline">
                  Sort:
                </span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="appearance-none bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full pl-3 pr-8 py-1.5 font-mono text-xs text-cloud focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-panel text-cloud">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cloud/40 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Mobile Filter Drawer */}
            {showMobileFilters && (
              <div className="lg:hidden glass rounded-2xl p-5 mb-6 space-y-4 border border-black/10 dark:border-white/10 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-black/8 dark:border-white/10">
                  <h3 className="font-display font-medium text-sm text-cloud">
                    Filter Catalogue
                  </h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="text-cloud/50 hover:text-cloud"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile Category Chips */}
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedCategory("");
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1 rounded-full font-mono text-xs uppercase tracking-wider transition ${
                      !selectedCategory
                        ? "bg-accent text-white"
                        : "glass text-cloud/70"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1 rounded-full font-mono text-xs transition flex items-center gap-1 ${
                        selectedCategory === cat.slug
                          ? "bg-accent text-white"
                          : "glass text-cloud/70"
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-black/8 dark:border-white/10">
                  <button
                    onClick={clearAllFilters}
                    className="font-mono text-xs text-accent hover:underline"
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="btn-primary py-2 px-6"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}

            {/* Active Filter Pills */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-6 font-mono text-xs">
                <span className="text-cloud/40">Active:</span>
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1.5 bg-accent text-white px-3 py-1 rounded-full">
                    {activeCategory?.name || selectedCategory}
                    <button onClick={() => setSelectedCategory("")}>
                      <X className="w-3.5 h-3.5 hover:opacity-80" />
                    </button>
                  </span>
                )}
                {searchQuery.trim() && (
                  <span className="inline-flex items-center gap-1.5 glass text-accent px-3 py-1 rounded-full border border-accent/25">
                    &ldquo;{searchQuery}&rdquo;
                    <button onClick={() => setSearchQuery("")}>
                      <X className="w-3.5 h-3.5 hover:opacity-80" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-cloud/50 hover:text-accent transition-colors ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Product Grid */}
            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {paginatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="glass rounded-[24px] p-12 text-center max-w-md mx-auto my-8 border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
                <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-4 text-accent">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-display font-medium text-lg text-cloud mb-2">
                  No matching gifts found
                </h3>
                <p className="text-cloud/50 text-xs mb-6">
                  Try adjusting your keywords or clearing selected filters.
                </p>
                <button onClick={clearAllFilters} className="btn-primary text-xs">
                  View All Products
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  const isCurrent = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`w-9 h-9 rounded-full font-mono text-xs font-semibold transition-all ${
                        isCurrent
                          ? "bg-accent text-white shadow-md shadow-accent/25 scale-105"
                          : "glass text-cloud/70 hover:text-cloud border border-black/8 dark:border-white/10"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-base flex items-center justify-center p-8">
          <div className="w-10 h-10 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
