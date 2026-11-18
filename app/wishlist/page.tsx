"use client";

import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";
import { products, formatPrice, Product } from "@/lib/products";

export default function WishlistPage() {
  const { items: wishlistIds, removeItem } = useWishlist();
  const { addItem } = useCart();

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  const handleMoveToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.primaryImage,
    });
    removeItem(product.id);
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
            <span className="text-accent font-semibold">Wishlist</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-cloud">
                Saved Wishlist
              </h1>
              <p className="text-cloud/50 text-xs sm:text-sm mt-1">
                Keep track of your dream gifts, celebration items, and personalized surprises.
              </p>
            </div>
            <span className="glass rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider text-cloud/70 self-start md:self-auto border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
              {wishlistProducts.length} saved item
              {wishlistProducts.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Wishlist Items Grid */}
        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="glass rounded-[20px] overflow-hidden border border-black/8 dark:border-[rgba(244,244,242,0.08)] transition hover:border-black/20 dark:hover:border-[rgba(244,244,242,0.2)] flex flex-col justify-between"
              >
                {/* Visual Area */}
                <Link
                  href={`/product/${product.slug || product.id}`}
                  className="aspect-square bg-panel flex items-center justify-center p-6 relative group border-b border-black/8 dark:border-[rgba(244,244,242,0.08)]"
                >
                  <div className="text-center group-hover:scale-105 transition-transform duration-300">
                    <div className="w-20 h-20 rounded-2xl bg-accent/20 border border-accent/30 text-accent font-display font-semibold text-2xl flex items-center justify-center mx-auto shadow-inner mb-2">
                      {product.name.split(" ")[0]?.[0]}
                      {product.name.split(" ")[1]?.[0] || ""}
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-cloud/40">
                      {product.category}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeItem(product.id);
                    }}
                    aria-label="Remove item"
                    className="absolute top-3 right-3 glass h-8 w-8 rounded-full text-cloud/60 hover:text-red-500 flex items-center justify-center transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </Link>

                {/* Details */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-4">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent block mb-1">
                      {product.category}
                    </span>
                    <Link
                      href={`/product/${product.slug || product.id}`}
                      className="block mb-1.5"
                    >
                      <h3 className="font-display font-medium text-base text-cloud hover:text-accent transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-cloud/50 line-clamp-2">
                      {product.shortDescription || product.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between mb-3 pt-3 border-t border-black/8 dark:border-[rgba(244,244,242,0.08)]">
                      <span className="font-mono text-sm font-semibold text-accent">
                        {formatPrice(product.price)}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-cloud/50">
                        {product.inStock ? "Available" : "Pre-order"}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMoveToCart(product)}
                        className="flex-1 btn-primary py-2.5 text-xs font-mono uppercase tracking-[0.12em]"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Cart</span>
                      </button>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="glass px-3 rounded-full text-cloud/40 hover:text-red-500 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-[24px] p-12 max-w-md mx-auto text-center border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
            <div className="w-14 h-14 rounded-full bg-accent/15 text-accent flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h2 className="font-display font-medium text-xl text-cloud mb-2">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs text-cloud/50 leading-relaxed mb-6">
              You haven&apos;t saved any gift items to your wishlist yet. Tap the heart icon on any product in our catalog to save it here.
            </p>
            <Link
              href="/shop"
              className="btn-primary text-xs py-3 w-full font-mono uppercase tracking-wider"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
