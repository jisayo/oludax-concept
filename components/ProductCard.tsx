"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  Sparkles,
  Minus,
  Plus,
  Check,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const targetUrl = `/product/${product.slug || product.id}`;

  const isAvailable =
    product.inStock !== false &&
    (product.stockCount === undefined || product.stockCount > 0);
  const maxStock = product.stockCount ?? 99;

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity((prev) => Math.min(maxStock, prev + 1));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAvailable) return;

    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.primaryImage,
      },
      quantity
    );

    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      setQuantity(1);
    }, 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
  };

  return (
    <article className="group glass flex flex-col overflow-hidden rounded-[18px] sm:rounded-[20px] p-3 sm:p-4 transition duration-300 hover:bg-black/[0.03] dark:hover:bg-[rgba(244,244,242,0.08)]">
      <Link href={targetUrl} className="flex flex-1 flex-col">
        {/* Product Image Frame */}
        <div className="relative mb-3 sm:mb-4 aspect-square sm:h-52 shrink-0 overflow-hidden rounded-xl sm:rounded-2xl border border-black/10 bg-panel dark:border-[rgba(244,244,242,0.12)]">
          {product.primaryImage ? (
            <img
              src={product.primaryImage}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-contain p-2 transition duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fallback = e.currentTarget.parentElement?.querySelector(
                  ".fallback-monogram"
                );
                if (fallback) fallback.classList.remove("hidden");
              }}
            />
          ) : null}

          {/* Monogram Fallback if image not provided or fails */}
          <div
            className={`fallback-monogram h-full w-full flex flex-col items-center justify-center p-4 sm:p-6 text-center transition duration-500 group-hover:scale-105 bg-gradient-to-br from-[#720D46]/10 via-panel to-[#C40E75]/10 dark:from-[#720D46]/30 dark:via-[#141419] dark:to-[#C40E75]/20 ${
              product.primaryImage ? "hidden" : "flex"
            }`}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-accent/15 border border-accent/25 text-accent font-display font-semibold text-xl sm:text-2xl flex items-center justify-center shadow-inner mb-1.5 sm:mb-2 group-hover:scale-110 transition-transform">
              {product.name.split(" ")[0]?.[0]}
              {product.name.split(" ")[1]?.[0] || ""}
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent font-semibold">
              Oludax
            </span>
          </div>

          {/* Status Badges */}
          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
            {product.newArrival && (
              <span className="glass rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-cloud font-semibold shadow-sm">
                New
              </span>
            )}
            {product.customizable && (
              <span className="glass rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-accent font-semibold shadow-sm flex items-center gap-1 border border-accent/20">
                <Sparkles className="w-2.5 h-2.5" /> <span className="hidden sm:inline">Bespoke</span>
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 glass h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center text-cloud/70 hover:text-accent transition-all z-10 cursor-pointer"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                isFavorited ? "fill-accent text-accent" : ""
              }`}
            />
          </button>
        </div>

        {/* Title */}
        <h3 className="truncate capitalize font-display text-sm sm:text-lg font-medium text-cloud group-hover:text-accent transition-colors">
          {product.name}
        </h3>

        {/* Short Description */}
        <div className="mt-1 flex-1 hidden sm:block">
          <p className="text-xs leading-relaxed text-cloud/75 line-clamp-2">
            {product.shortDescription ||
              product.description ||
              "Bespoke personalized gift crafted with love and care for memorable moments."}
          </p>
        </div>

        {/* Price & Category Tag */}
        <div className="mt-2 sm:mt-3.5 flex flex-wrap items-center justify-between gap-1.5">
          <div className="flex items-baseline gap-1.5">
            <p className="font-mono text-xs sm:text-sm text-accent font-semibold">
              {formatPrice(product.price)}
            </p>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="font-mono text-[10px] sm:text-[11px] text-cloud/60 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          <span className="shrink-0 glass rounded-full px-2 py-0.5 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.12em] text-cloud/70 font-medium truncate max-w-[90px] sm:max-w-none">
            {product.category || "Gift"}
          </span>
        </div>
      </Link>

      {/* Stepper + Add to Cart Row */}
      <div className="mt-2.5 sm:mt-3 flex items-center gap-1.5 sm:gap-2">
        {isAvailable ? (
          <>
            {/* Quantity Stepper (compact on mobile) */}
            <div className="glass flex items-center gap-0.5 rounded-full px-1 py-0.5 shrink-0">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-cloud/70 transition hover:bg-black/8 dark:hover:bg-[rgba(244,244,242,0.12)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </button>
              <span className="flex h-6 min-w-4 sm:min-w-6 items-center justify-center font-mono text-[11px] sm:text-xs text-cloud select-none font-semibold">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                disabled={quantity >= maxStock}
                aria-label="Increase quantity"
                className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-cloud/70 transition hover:bg-black/8 dark:hover:bg-[rgba(244,244,242,0.12)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 sm:py-2.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.12em] sm:tracking-[0.14em] transition active:scale-95 cursor-pointer truncate ${
                justAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-accent/15 text-accent hover:bg-accent/25 dark:bg-accent/15 dark:hover:bg-accent/25 font-semibold"
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                  <span className="hidden sm:inline">Add to Bag</span>
                  <span className="sm:hidden">Add</span>
                </>
              )}
            </button>
          </>
        ) : (
          <button
            type="button"
            disabled
            className="flex flex-1 items-center justify-center py-2 sm:py-2.5 rounded-full font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] bg-black/5 dark:bg-white/5 text-cloud/40 cursor-not-allowed"
          >
            Sold Out
          </button>
        )}
      </div>
    </article>
  );
}
