"use client";

import { useState, useEffect } from "react";
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
  Check,
  Sparkles,
  Info,
  MessageCircle,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import {
  products,
  getProductBySlug,
  getProductById,
  formatPrice,
  extractPriceFromVariant,
  Product,
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

  // Look up product by either slug or id (initial instant match + live sync from API)
  const initialProduct =
    getProductBySlug(params.id) ||
    getProductById(params.id) ||
    products.find(
      (p) =>
        p.id.toLowerCase() === params.id.toLowerCase() ||
        p.slug?.toLowerCase() === params.id.toLowerCase()
    );

  const [liveProduct, setLiveProduct] = useState<Product | undefined>(initialProduct);
  const [allProducts, setAllProducts] = useState<Product[]>(products);
  const [isLoadingLive, setIsLoadingLive] = useState(!initialProduct);

  const product = liveProduct;
  const options = product?.customizationOptions;
  const galleryImages =
    product?.images && product.images.length > 0
      ? product.images
      : [product?.primaryImage || ""];

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedDesign, setSelectedDesign] = useState<string>(
    options?.designs?.[0] || ""
  );
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "delivery">(
    "description"
  );

  useEffect(() => {
    fetch(`/api/products/${encodeURIComponent(params.id)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && data.product) {
          setLiveProduct(data.product);
          if (data.product.customizationOptions?.designs?.length) {
            setSelectedDesign((prev) => prev || data.product.customizationOptions.designs[0]);
          }
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingLive(false));

    fetch("/api/products", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.products)) {
          setAllProducts(data.products);
        }
      })
      .catch(() => {});
  }, [params.id]);

  if (isLoadingLive && !product) {
    return (
      <div className="min-h-screen bg-base text-cloud flex items-center justify-center p-4 pt-20 font-mono text-xs">
        Loading product...
      </div>
    );
  }

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
  const relatedProducts = allProducts
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  // Dynamic price based on variant selection
  const activePrice = selectedDesign
    ? extractPriceFromVariant(selectedDesign, product.price)
    : product.price;

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > activePrice
      ? Math.round((1 - activePrice / product.compareAtPrice) * 100)
      : 0;

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: activePrice,
        image: product.primaryImage,
        customization: selectedDesign
          ? {
              designPreference: selectedDesign,
            }
          : undefined,
      },
      quantity
    );

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  const whatsappOrderUrl = `https://wa.me/2348144412006?text=${encodeURIComponent(
    `Hello Oludax Concept! 🎁\nI want to order: *${product.name}*\n` +
      (selectedDesign ? `• Option / Size: ${selectedDesign}\n` : "") +
      `• Quantity: ${quantity}\n` +
      `• Total: ${formatPrice(activePrice * quantity)}\n\nPlease let me know what details or photos you need to customise this for me!`
  )}`;

  return (
    <div className="min-h-screen bg-base text-cloud pt-20 sm:pt-24 lg:pt-28 pb-28 sm:pb-16">
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
          {/* LEFT: GALLERY & LIVE PERSONALIZATION PREVIEW */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-[24px] overflow-hidden border border-black/10 dark:border-[rgba(244,244,242,0.12)] bg-panel p-6 flex items-center justify-center">
              {galleryImages[selectedImageIndex] ? (
                <img
                  src={galleryImages[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-contain rounded-xl transition duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fb = e.currentTarget.parentElement?.querySelector(".gallery-fb");
                    if (fb) fb.classList.remove("hidden");
                  }}
                />
              ) : null}

              {/* Monogram Fallback */}
              <div
                className={`gallery-fb text-center flex flex-col items-center justify-center p-8 bg-panel rounded-2xl w-full h-full ${
                  galleryImages[selectedImageIndex] ? "hidden" : "flex"
                }`}
              >
                <div className="w-28 h-28 rounded-3xl bg-accent/20 border border-accent/30 text-accent font-display font-semibold text-4xl flex items-center justify-center mx-auto shadow-inner mb-3">
                  {product.name.split(" ")[0]?.[0]}
                  {product.name.split(" ")[1]?.[0] || ""}
                </div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent font-semibold">
                  Oludax Concept
                </span>
                <span className="font-mono text-[11px] text-cloud/40 mt-1">
                  Product Photo Coming Soon
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
            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl border flex items-center justify-center transition-all bg-panel overflow-hidden p-1.5 shrink-0 ${
                      idx === selectedImageIndex
                        ? "border-accent ring-2 ring-accent"
                        : "border-black/10 dark:border-white/10 hover:border-accent/40 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
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

              {/* Dynamic Price Row */}
              <div className="flex items-baseline gap-3 mt-4 mb-4">
                <span className="font-mono text-2xl sm:text-3xl font-semibold text-accent">
                  {formatPrice(activePrice)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > activePrice && (
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

            {/* VARIANT / SIZE SELECTOR */}
            {options?.designs && options.designs.length > 0 && (
              <div className="glass rounded-[20px] p-5 sm:p-6 border border-accent/25 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-black/8 dark:border-[rgba(244,244,242,0.08)]">
                  <h3 className="font-display font-medium text-sm text-cloud flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                    <span>Select Size / Option</span>
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-full font-semibold">
                    Catalog Variant
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {options.designs.map((design) => {
                    const isSelected = selectedDesign === design;
                    const varPrice = extractPriceFromVariant(design, product.price);
                    return (
                      <button
                        key={design}
                        type="button"
                        onClick={() => setSelectedDesign(design)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? "border-accent bg-accent/15 ring-1 ring-accent"
                            : "border-black/10 dark:border-white/10 hover:border-accent/40 bg-black/5 dark:bg-white/5"
                        }`}
                      >
                        <div className="space-y-0.5 pr-2">
                          <span className="font-mono text-xs text-cloud font-medium block">
                            {design.replace(/\s*\(₦[\d,]+\)/, "").replace(/\s*-\s*₦[\d,]+/, "")}
                          </span>
                          <span className="font-mono text-[11px] text-accent font-semibold">
                            {formatPrice(varPrice)}
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-accent shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Customization Note */}
            <div className="glass rounded-xl p-3.5 border border-black/8 dark:border-[rgba(244,244,242,0.08)] flex items-start gap-2.5 text-xs text-cloud/70">
              <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Want custom names, photos, or branding? Send your specifications directly to us on WhatsApp after ordering or click <strong className="text-cloud font-medium">&ldquo;Order via WhatsApp&rdquo;</strong> below.
              </span>
            </div>

            {/* ACTION BAR: STEPPER + ADD TO CART + WHATSAPP ORDER */}
            <div className="space-y-3">
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
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag — {formatPrice(activePrice * quantity)}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Instant WhatsApp Order Option */}
              <a
                href={whatsappOrderUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-full font-mono text-xs uppercase tracking-[0.14em] flex items-center justify-center gap-2 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 transition shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-emerald-500" />
                <span>Order via WhatsApp ({formatPrice(activePrice * quantity)})</span>
              </a>
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
                <span className="text-[10px] text-cloud/40">Premium Packaging</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="glass rounded-[24px] p-6 border border-black/8 dark:border-[rgba(244,244,242,0.08)] space-y-4">
              <div className="flex border-b border-black/8 dark:border-[rgba(244,244,242,0.08)] font-mono text-xs uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setActiveTab("description")}
                  className={`pb-3 mr-6 font-semibold transition cursor-pointer ${
                    activeTab === "description"
                      ? "text-accent border-b-2 border-accent"
                      : "text-cloud/40 hover:text-cloud"
                  }`}
                >
                  Description
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("specs")}
                  className={`pb-3 mr-6 font-semibold transition cursor-pointer ${
                    activeTab === "specs"
                      ? "text-accent border-b-2 border-accent"
                      : "text-cloud/40 hover:text-cloud"
                  }`}
                >
                  Specifications
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("delivery")}
                  className={`pb-3 font-semibold transition cursor-pointer ${
                    activeTab === "delivery"
                      ? "text-accent border-b-2 border-accent"
                      : "text-cloud/40 hover:text-cloud"
                  }`}
                >
                  Delivery
                </button>
              </div>

              {activeTab === "description" && (
                <div className="text-xs text-cloud/70 space-y-2 leading-relaxed">
                  <p>{product.description}</p>
                  {options?.instructionsHelpText && (
                    <p className="font-mono text-[11px] text-accent/80 pt-1">
                      💡 Note: {options.instructionsHelpText}
                    </p>
                  )}
                </div>
              )}

              {activeTab === "specs" && (
                <div className="space-y-2 text-xs">
                  {product.specifications ? (
                    Object.entries(product.specifications).map(([key, val]) => (
                      <div
                        key={key}
                        className="flex justify-between py-1 border-b border-black/5 dark:border-white/5 font-mono text-[11px]"
                      >
                        <span className="text-cloud/50">{key}</span>
                        <span className="text-cloud font-medium">{val}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-cloud/40">Specifications available on request.</p>
                  )}
                </div>
              )}

              {activeTab === "delivery" && (
                <div className="text-xs text-cloud/70 leading-relaxed space-y-2">
                  <p>{product.deliveryInfo || "Dispatched via verified courier partners nationwide."}</p>
                  <p className="font-mono text-[11px] text-cloud/40">
                    Ile-Ife & Akure: 1-2 business days • Rest of Nigeria: 2-4 business days.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-semibold block mb-1">
                  You Might Also Like
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-medium text-cloud tracking-tight">
                  More Keepsakes from {product.category}
                </h2>
              </div>
              <Link
                href={`/shop?category=${product.categorySlug}`}
                className="font-mono text-xs uppercase tracking-wider text-accent hover:brightness-110 transition flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </section>
        )}

        {/* MOBILE STICKY PURCHASE BAR */}
        <aside
          aria-label="Mobile Checkout Actions"
          className="fixed bottom-0 inset-x-0 z-40 sm:hidden glass bg-white/95 dark:bg-[#141418]/95 border-t border-black/15 dark:border-white/15 px-4 py-3 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="font-mono text-[10px] uppercase text-cloud/50 block truncate">
                {selectedDesign ? selectedDesign.replace(/\s*\(₦[\d,]+\)/, "") : "Total"}
              </span>
              <span className="font-mono text-base font-bold text-accent">
                {formatPrice(activePrice * quantity)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={whatsappOrderUrl}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-emerald-500/40 text-emerald-400 bg-emerald-500/10 flex items-center justify-center shrink-0 active:scale-95 transition"
                title="Order via WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-emerald-500" />
              </a>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider font-semibold transition active:scale-95 ${
                  addedSuccess
                    ? "bg-emerald-600 text-white"
                    : product.inStock
                    ? "bg-accent text-white"
                    : "bg-black/10 dark:bg-white/10 text-cloud/40"
                }`}
              >
                {addedSuccess ? "Added!" : "Add to Bag"}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
