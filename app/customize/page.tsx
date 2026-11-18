"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Check,
  ChevronRight,
  Palette,
  Type,
  FileText,
  Info,
} from "lucide-react";
import { products, Product, formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

export default function CustomizeStudioPage() {
  const router = useRouter();
  const { addItem } = useCart();

  // Filter only customizable products
  const customizableProducts = products.filter((p) => p.customizable);

  const [selectedProduct, setSelectedProduct] = useState<Product>(
    customizableProducts[0] || products[0]
  );

  const [customerName, setCustomerName] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedDesign, setSelectedDesign] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedPhoneModel, setSelectedPhoneModel] = useState<string>("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [addedSuccess, setAddedSuccess] = useState(false);

  const options = selectedProduct?.customizationOptions;

  const handleSelectProduct = (prod: Product) => {
    setSelectedProduct(prod);
    setSelectedColor("");
    setSelectedDesign("");
    setSelectedSize("");
    setSelectedPhoneModel("");
  };

  const handleAddToCart = () => {
    addItem({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      image: selectedProduct.primaryImage,
      color: selectedColor || undefined,
      size: selectedSize || undefined,
      customization: {
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
      },
    });

    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      router.push("/cart");
    }, 1200);
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
            <span className="text-accent font-semibold">Customization Studio</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-accent/15 text-accent px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider mb-2 border border-accent/25">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Personalization</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-cloud">
                Customization Studio
              </h1>
              <p className="text-cloud/50 text-xs sm:text-sm mt-1 max-w-xl">
                Personalize drinkware, apparel, gift boxes, and celebration packages with custom names, heartfelt messages, and tailored aesthetics.
              </p>
            </div>
          </div>
        </div>

        {/* Studio Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT 7 COLS: FORM STEPS */}
          <div className="lg:col-span-7 space-y-6">
            {/* STEP 1: Select Product */}
            <section className="glass rounded-[24px] p-6 border border-black/8 dark:border-[rgba(244,244,242,0.08)] space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent text-white font-mono font-semibold text-xs flex items-center justify-center">
                  1
                </span>
                <h2 className="font-display font-medium text-base text-cloud">
                  Choose a Customizable Item
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {customizableProducts.map((p) => {
                  const isSelected = selectedProduct.id === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectProduct(p)}
                      className={`text-left p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? "border-accent bg-accent/10 ring-1 ring-accent"
                          : "border-black/8 dark:border-white/10 glass hover:border-accent/40"
                      }`}
                    >
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-accent block">
                          {p.category}
                        </span>
                        <h3 className="font-display font-medium text-xs text-cloud line-clamp-1 mt-0.5">
                          {p.name}
                        </h3>
                      </div>
                      <span className="font-mono font-semibold text-xs text-accent mt-2 block">
                        {formatPrice(p.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* STEP 2: Personal Details */}
            <section className="glass rounded-[24px] p-6 border border-black/8 dark:border-[rgba(244,244,242,0.08)] space-y-5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent text-white font-mono font-semibold text-xs flex items-center justify-center">
                  2
                </span>
                <h2 className="font-display font-medium text-base text-cloud">
                  Add Your Personal Details
                </h2>
              </div>

              {/* Name */}
              {options?.allowName && (
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-cloud/60 flex items-center gap-1.5 mb-1.5">
                    <Type className="w-3.5 h-3.5 text-accent" />
                    <span>{options.namePrompt || "Name on Gift"}</span>
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Oluwaseun or Funke"
                    maxLength={options.nameMaxLength || 25}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-cloud focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              )}

              {/* Message */}
              {options?.allowMessage && (
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-cloud/60 flex items-center gap-1.5 mb-1.5">
                    <FileText className="w-3.5 h-3.5 text-accent" />
                    <span>{options.messagePrompt || "Greeting Card Message"}</span>
                  </label>
                  <textarea
                    value={personalMessage}
                    onChange={(e) => setPersonalMessage(e.target.value)}
                    placeholder="Wishing you a magical celebration filled with joy and blessings..."
                    maxLength={options.messageMaxLength || 180}
                    rows={3}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-cloud focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                  />
                </div>
              )}

              {/* Color Scheme */}
              {options?.allowColor && options.colors && options.colors.length > 0 && (
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-cloud/60 flex items-center gap-1.5 mb-2">
                    <Palette className="w-3.5 h-3.5 text-accent" />
                    <span>Select Colour Scheme</span>
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {options.colors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-8 h-8 rounded-full border transition-all ${
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
              {options?.clothingSizes && options.clothingSizes.length > 0 && (
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-cloud/60 block mb-1.5">
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

              {/* Phone Models */}
              {options?.phoneModels && options.phoneModels.length > 0 && (
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-cloud/60 block mb-1">
                    Device Model
                  </label>
                  <select
                    value={selectedPhoneModel}
                    onChange={(e) => setSelectedPhoneModel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-cloud focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="" className="bg-panel text-cloud">-- Choose device --</option>
                    {options.phoneModels.map((m) => (
                      <option key={m} value={m} className="bg-panel text-cloud">
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Special Instructions */}
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-cloud/60 block mb-1">
                  Special Finishing Instructions
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Specify ribbon shade, placement, or special packaging notes..."
                  maxLength={200}
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-cloud focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                />
              </div>
            </section>
          </div>

          {/* RIGHT 5 COLS: LIVE MOCKUP PREVIEW */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 glass rounded-[24px] p-6 border border-black/8 dark:border-[rgba(244,244,242,0.08)] space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-black/8 dark:border-[rgba(244,244,242,0.08)]">
                <h3 className="font-display font-medium text-base text-cloud flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span>Live Studio Preview</span>
                </h3>
                <span className="font-mono text-[10px] uppercase text-cloud/40">
                  Visualization
                </span>
              </div>

              {/* Preview Canvas */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-panel border border-black/8 dark:border-[rgba(244,244,242,0.08)] p-6 flex flex-col justify-between items-center text-center">
                <div className="w-full flex justify-between items-center font-mono text-[10px] uppercase tracking-wider text-cloud/40">
                  <span>{selectedProduct.category}</span>
                  {selectedColor && (
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: selectedColor }}
                    />
                  )}
                </div>

                <div className="my-auto space-y-3">
                  <div className="w-20 h-20 rounded-2xl bg-accent/20 border border-accent/30 text-accent font-display font-semibold text-2xl flex items-center justify-center mx-auto shadow-inner">
                    {selectedProduct.name.split(" ")[0]?.[0]}
                    {selectedProduct.name.split(" ")[1]?.[0] || ""}
                  </div>

                  {customerName ? (
                    <div className="glass px-4 py-1.5 rounded-full inline-block border border-accent/30">
                      <p className="font-display font-medium text-sm text-cloud">
                        &ldquo;{customerName}&rdquo;
                      </p>
                    </div>
                  ) : (
                    <p className="font-mono text-xs text-cloud/40 italic">
                      [Personalized Name Appears Here]
                    </p>
                  )}

                  {selectedSize && (
                    <span className="font-mono text-[10px] uppercase text-accent bg-accent/15 px-2 py-0.5 rounded-md block mx-auto w-fit">
                      Size: {selectedSize}
                    </span>
                  )}
                </div>

                {personalMessage ? (
                  <p className="glass text-xs italic text-cloud/70 rounded-xl p-2 w-full line-clamp-2">
                    &ldquo;{personalMessage}&rdquo;
                  </p>
                ) : (
                  <span className="font-mono text-[10px] uppercase text-cloud/30">
                    Complimentary card note included
                  </span>
                )}
              </div>

              {/* Summary */}
              <div className="space-y-2 font-mono text-xs border-t border-black/8 dark:border-[rgba(244,244,242,0.08)] pt-4">
                <div className="flex justify-between text-cloud/60">
                  <span>Base Price</span>
                  <span className="text-cloud font-semibold">
                    {formatPrice(selectedProduct.price)}
                  </span>
                </div>
                <div className="flex justify-between text-cloud/60">
                  <span>Personalization</span>
                  <span className="text-emerald-500 font-semibold">
                    INCLUDED (Free)
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-cloud pt-2 border-t border-dashed border-black/15 dark:border-white/15">
                  <span>Total</span>
                  <span className="text-accent">
                    {formatPrice(selectedProduct.price)}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`w-full py-3.5 rounded-full font-mono text-xs uppercase tracking-[0.14em] flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer ${
                  addedSuccess
                    ? "bg-emerald-600 text-white"
                    : "bg-accent text-white hover:brightness-110"
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added! Redirecting...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Customized Gift to Bag</span>
                  </>
                )}
              </button>

              <div className="glass rounded-xl p-3 text-[11px] font-mono text-cloud/50 flex items-start gap-2 border border-black/8 dark:border-[rgba(244,244,242,0.08)]">
                <Info className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                <span>
                  Our Lagos studio artisans verify all typography, alignments, and custom details before hand-packaging.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
