"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  Minus,
  Plus,
  Upload,
  Check,
  Sparkles,
  Info,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import {
  products,
  getProductBySlug,
  getProductById,
  getProductsByCategory,
  formatPrice,
} from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();

  // Look up product by either slug or id
  const product =
    getProductBySlug(params.id) ||
    getProductById(params.id) ||
    products.find(
      (p) =>
        p.id.toLowerCase() === params.id.toLowerCase() ||
        p.slug?.toLowerCase() === params.id.toLowerCase()
    );

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedDesign, setSelectedDesign] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedPhoneModel, setSelectedPhoneModel] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "delivery">(
    "description"
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-base text-cloud flex items-center justify-center p-4 pt-20">
        <div className="glass rounded-[24px] p-8 max-w-md w-full text-center border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
          <div className="w-14 h-14 rounded-full bg-accent/15 text-accent flex items-center justify-center mx-auto mb-4">
            <Info className="w-6 h-6" />
          </div>
          <h1 className="font-display text-2xl font-medium text-cloud mb-2">
            Gift Not Found
          </h1>
          <p className="text-cloud/50 text-xs mb-6">
            The product you are looking for may have been moved or is currently unavailable in the catalog.
          </p>
          <Link href="/shop" className="btn-primary text-xs py-3 w-full font-mono uppercase tracking-wider">
            Browse All Gifts
          </Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const relatedProducts = getProductsByCategory(product.categorySlug || "")
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : 0;

  const options = product.customizationOptions;
  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.primaryImage || ""];

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.primaryImage,
        color: selectedColor || undefined,
        size: selectedSize || undefined,
        customization: product.customizable
          ? {
              customerName: customerName.trim() || undefined,
              message: personalMessage.trim() || undefined,
              color: selectedColor || undefined,
              designPreference: selectedDesign || undefined,
              specialInstructions:
                [
                  specialInstructions.trim(),
                  selectedPhoneModel ? `Phone model: ${selectedPhoneModel}` : "",
                  selectedSize ? `Size: ${selectedSize}` : "",
                ]
                  .filter(Boolean)
                  .join(" | ") || undefined,
            }
          : undefined,
      },
      quantity
    );

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-base text-cloud pt-20 sm:pt-24 lg:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Breadcrumb Glass Banner */}
        <div className="glass rounded-[24px] p-4 sm:p-5 border border-black/8 dark:border-[rgba(244,244,242,0.08)] mb-8">
          <nav className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-cloud/40 truncate">
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-cloud/30 shrink-0" />
            <Link href="/shop" className="hover:text-accent transition-colors">
              Catalog
            </Link>
            {product.category && (
              <>
                <ChevronRight className="w-3 h-3 text-cloud/30 shrink-0" />
                <Link
                  href={`/shop?category=${product.categorySlug}`}
                  className="hover:text-accent transition-colors truncate"
                >
                  {product.category}
                </Link>
              </>
            )}
            <ChevronRight className="w-3 h-3 text-cloud/30 shrink-0" />
            <span className="text-cloud font-semibold truncate">
              {product.name}
            </span>
          </nav>
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT: GALLERY */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-[24px] overflow-hidden border border-black/10 dark:border-[rgba(244,244,242,0.12)] bg-panel p-8 flex items-center justify-center">
              {product.primaryImage ? (
                <img
                  src={product.primaryImage}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fb = e.currentTarget.parentElement?.querySelector(".gallery-fb");
                    if (fb) fb.classList.remove("hidden");
                  }}
                />
              ) : null}
              <div
                className={`gallery-fb text-center ${
                  product.primaryImage ? "hidden" : ""
                }`}
              >
                <div className="w-28 h-28 rounded-3xl bg-accent/20 border border-accent/30 text-accent font-display font-semibold text-4xl flex items-center justify-center mx-auto shadow-inner mb-3">
                  {product.name.split(" ")[0]?.[0]}
                  {product.name.split(" ")[1]?.[0] || ""}
                </div>
                <span className="font-mono text-xs uppercase tracking-wider text-cloud/40">
                  {product.category}
                </span>
              </div>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleItem(product.id)}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                className="absolute top-4 right-4 glass h-10 w-10 rounded-full flex items-center justify-center text-cloud/70 hover:text-accent transition-all cursor-pointer z-10"
              >
                <Heart
                  className={`w-4 h-4 ${inWishlist ? "fill-accent text-accent" : ""}`}
                />
              </button>
            </div>

            {/* Thumbnail Strip */}
            <div className="grid grid-cols-4 gap-3">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`aspect-square rounded-2xl border flex items-center justify-center transition-all bg-panel overflow-hidden p-2 ${
                    idx === selectedImageIndex
                      ? "border-accent ring-1 ring-accent"
                      : "border-black/10 dark:border-white/10 hover:border-accent/40"
                  }`}
                >
                  <span className="font-mono text-xs text-cloud/70">
                    0{idx + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: DETAILS & CUSTOMIZATION */}
          <div className="space-y-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-accent font-semibold block mb-1">
                {product.category}
              </span>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium text-cloud tracking-tight">
                {product.name}
              </h1>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mt-4 mb-4">
                <span className="font-mono text-2xl sm:text-3xl font-semibold text-accent">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="font-mono text-sm text-cloud/40 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="glass rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent border border-accent/20">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              <p className="text-sm leading-relaxed text-cloud/60">
                {product.description}
              </p>
            </div>

            {/* CUSTOMIZATION OPTIONS (if customizable) */}
            {product.customizable && options && (
              <div className="glass rounded-[20px] p-5 sm:p-6 border border-accent/25 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-black/8 dark:border-[rgba(244,244,242,0.08)]">
                  <h3 className="font-display font-medium text-sm text-cloud flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                    <span>Bespoke Customization</span>
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                    Complimentary
                  </span>
                </div>

                {/* Recipient Name Field */}
                {options.allowName && (
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-cloud/60 block mb-1">
                      {options.namePrompt || "Personalized Name"}
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Adebayo, Sarah, or The Johnsons"
                      maxLength={options.nameMaxLength || 25}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-cloud focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                )}

                {/* Message Field */}
                {options.allowMessage && (
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-cloud/60 block mb-1">
                      {options.messagePrompt || "Greeting Message"}
                    </label>
                    <textarea
                      value={personalMessage}
                      onChange={(e) => setPersonalMessage(e.target.value)}
                      placeholder="Write your sentimental note..."
                      maxLength={options.messageMaxLength || 150}
                      rows={2}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-cloud focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                    />
                  </div>
                )}

                {/* Colour selection */}
                {options.allowColor && options.colors && options.colors.length > 0 && (
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-cloud/60 block mb-1.5">
                      Select Colour
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {options.colors.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setSelectedColor(c)}
                          style={{ backgroundColor: c }}
                          className={`w-7 h-7 rounded-full border transition-all ${
                            selectedColor === c
                              ? "ring-2 ring-accent scale-110"
                              : "border-black/20 hover:scale-105"
                          }`}
                          title={c}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {options.clothingSizes && options.clothingSizes.length > 0 && (
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-cloud/60 block mb-1.5">
                      Select Size
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {options.clothingSizes.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={`w-9 h-9 rounded-xl font-mono text-xs font-semibold transition ${
                            selectedSize === sz
                              ? "bg-accent text-white"
                              : "glass text-cloud/70 hover:text-cloud"
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Device Model */}
                {options.phoneModels && options.phoneModels.length > 0 && (
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-cloud/60 block mb-1">
                      Phone Model
                    </label>
                    <select
                      value={selectedPhoneModel}
                      onChange={(e) => setSelectedPhoneModel(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-cloud focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      <option value="" className="bg-panel text-cloud">-- Select Device --</option>
                      {options.phoneModels.map((m) => (
                        <option key={m} value={m} className="bg-panel text-cloud">
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Stepper & Add to Cart Bar */}
            <div className="glass rounded-[20px] p-4 border border-black/8 dark:border-[rgba(244,244,242,0.08)] flex items-center gap-3">
              <div className="glass flex items-center gap-1 rounded-full px-1.5 py-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-cloud/70 transition hover:bg-black/8 dark:hover:bg-[rgba(244,244,242,0.12)] cursor-pointer disabled:opacity-30"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="flex h-8 min-w-8 items-center justify-center font-mono text-sm text-cloud font-semibold">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity(Math.min(product.stockCount || 99, quantity + 1))
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full text-cloud/70 transition hover:bg-black/8 dark:hover:bg-[rgba(244,244,242,0.12)] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-3.5 rounded-full font-mono text-xs uppercase tracking-[0.14em] flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer ${
                  addedSuccess
                    ? "bg-emerald-600 text-white"
                    : product.inStock
                    ? "bg-accent text-white hover:brightness-110"
                    : "bg-black/5 dark:bg-white/5 text-cloud/40 cursor-not-allowed"
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart — {formatPrice(product.price * quantity)}</span>
                  </>
                )}
              </button>
            </div>

            {/* Micro Pillars */}
            <div className="grid grid-cols-3 gap-3">
              <div className="glass rounded-xl p-3 text-center border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
                <Truck className="w-4 h-4 text-accent mx-auto mb-1" />
                <span className="font-mono text-[10px] uppercase text-cloud font-semibold block">
                  Fast Dispatch
                </span>
                <span className="text-[10px] text-cloud/40">Across Nigeria</span>
              </div>
              <div className="glass rounded-xl p-3 text-center border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
                <Shield className="w-4 h-4 text-accent mx-auto mb-1" />
                <span className="font-mono text-[10px] uppercase text-cloud font-semibold block">
                  Paystack
                </span>
                <span className="text-[10px] text-cloud/40">Secured Checkout</span>
              </div>
              <div className="glass rounded-xl p-3 text-center border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
                <RotateCcw className="w-4 h-4 text-accent mx-auto mb-1" />
                <span className="font-mono text-[10px] uppercase text-cloud font-semibold block">
                  Gift Boxed
                </span>
                <span className="text-[10px] text-cloud/40">Ready to Present</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Creations */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-black/8 dark:border-[rgba(244,244,242,0.08)] space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-cloud">
                  Related Creations
                </h2>
                <p className="text-xs text-cloud/50 mt-1">
                  More curated gifts from the {product.category} collection.
                </p>
              </div>
              <Link
                href={`/shop?category=${product.categorySlug}`}
                className="font-mono text-xs uppercase tracking-wider text-accent hover:brightness-110 transition-colors"
              >
                View Category →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
