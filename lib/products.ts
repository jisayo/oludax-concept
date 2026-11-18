/**
 * OLUDAX CONCEPT - Official Product Catalog & Customization System
 *
 * Official verified price list & catalog for OLUDAX CONCEPT (Nigerian Bespoke Gifting & Branding Studio).
 * Currency: Nigerian Naira (₦ / NGN).
 */

export const NGN_CURRENCY_SYMBOL = "₦";
export const NGN_CURRENCY_CODE = "NGN";

// ============================================================================
// TYPES & INTERFACES (Standardized camelCase)
// ============================================================================

export type CustomOptionGroup = {
  name: string;
  options: string[];
  required?: boolean;
};

export type CustomizationOptions = {
  allowName?: boolean;
  namePrompt?: string;
  nameMaxLength?: number;
  allowMessage?: boolean;
  messagePrompt?: string;
  messageMaxLength?: number;
  allowColor?: boolean;
  colors?: string[];
  allowDesign?: boolean;
  designs?: string[];
  allowImage?: boolean;
  imagePrompt?: string;
  clothingSizes?: string[];
  phoneModels?: string[];
  customOptions?: CustomOptionGroup[];
  instructionsHelpText?: string;
};

export type CustomizationSelection = {
  customerName?: string;
  message?: string;
  selectedColor?: string;
  selectedDesign?: string;
  selectedSize?: string;
  selectedPhoneModel?: string;
  imageUrl?: string;
  specialInstructions?: string;
  customSelections?: Record<string, string>;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  slug?: string;
  compareAtPrice?: number;
  primaryImage?: string;
  images?: string[];
  description?: string;
  shortDescription?: string;
  category?: string;
  categorySlug?: string;
  tags?: string[];
  inStock?: boolean;
  stockCount?: number;
  rating?: number;
  reviewCount?: number;
  customizable?: boolean;
  customizationOptions?: CustomizationOptions;
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  specifications?: Record<string, string>;
  deliveryInfo?: string;
  isSample?: boolean;
  sampleNotice?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  image?: string;
  icon: string;
};

export type ValidationError = {
  field: string;
  message: string;
};

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export function validateProductPrice(
  price: number,
  compareAtPrice?: number
): ValidationError[] {
  const errors: ValidationError[] = [];
  if (typeof price !== "number" || isNaN(price)) {
    errors.push({ field: "price", message: "Price must be a valid number." });
  } else if (price < 0) {
    errors.push({ field: "price", message: "Price cannot be negative." });
  }

  if (compareAtPrice !== undefined && compareAtPrice !== null) {
    if (typeof compareAtPrice !== "number" || isNaN(compareAtPrice)) {
      errors.push({
        field: "compareAtPrice",
        message: "Compare-at price must be a valid number.",
      });
    } else if (compareAtPrice < price) {
      errors.push({
        field: "compareAtPrice",
        message:
          "Original compare-at price must be greater than or equal to the selling price.",
      });
    }
  }
  return errors;
}

export function validateStockQuantity(
  stockCount: number,
  inStock?: boolean
): ValidationError[] {
  const errors: ValidationError[] = [];
  if (
    typeof stockCount !== "number" ||
    isNaN(stockCount) ||
    !Number.isInteger(stockCount)
  ) {
    errors.push({
      field: "stockCount",
      message: "Stock count must be an integer.",
    });
  } else if (stockCount < 0) {
    errors.push({
      field: "stockCount",
      message: "Stock count cannot be negative.",
    });
  } else if (stockCount === 0 && inStock === true) {
    errors.push({
      field: "inStock",
      message:
        "Product cannot be marked in-stock when stock count is zero.",
    });
  }
  return errors;
}

export function validateCustomizationSelection(
  options: CustomizationOptions | undefined,
  selection: CustomizationSelection
): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!options) return errors;

  if (options.allowName && selection.customerName) {
    const maxLen = options.nameMaxLength ?? 30;
    if (selection.customerName.trim().length > maxLen) {
      errors.push({
        field: "customerName",
        message: `Name must not exceed ${maxLen} characters.`,
      });
    }
  }

  if (options.allowMessage && selection.message) {
    const maxLen = options.messageMaxLength ?? 200;
    if (selection.message.trim().length > maxLen) {
      errors.push({
        field: "message",
        message: `Message must not exceed ${maxLen} characters.`,
      });
    }
  }

  return errors;
}

export function validateProduct(product: Partial<Product>): {
  isValid: boolean;
  errors: ValidationError[];
} {
  const errors: ValidationError[] = [];

  if (!product.id || product.id.trim() === "") {
    errors.push({ field: "id", message: "Product ID is required." });
  }

  if (!product.name || product.name.trim() === "") {
    errors.push({ field: "name", message: "Product name is required." });
  }

  if (product.price === undefined) {
    errors.push({ field: "price", message: "Product price is required." });
  } else {
    errors.push(
      ...validateProductPrice(product.price, product.compareAtPrice)
    );
  }

  if (product.stockCount !== undefined) {
    errors.push(
      ...validateStockQuantity(product.stockCount, product.inStock)
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// OFFICIAL CATEGORIES
// ============================================================================

export const categories: Category[] = [
  {
    id: "cat-frames",
    name: "Frames & Wall Art",
    slug: "frames",
    description: "Borderless frames, border frames, acrylic frames & aesthetic wall collages",
    productCount: 8,
    icon: "🖼️",
  },
  {
    id: "cat-mugs-drinkware",
    name: "Mugs & Bottles",
    slug: "mugs-bottles",
    description: "Normal, magic & mirror mugs, temperature LED bottles & insulated flask sets",
    productCount: 12,
    icon: "☕",
  },
  {
    id: "cat-headwears-apparel",
    name: "Headwears & Apparel",
    slug: "headwears-apparel",
    description: "Trucker hats, snapbacks, silk satin hair bonnets, custom T-shirts & towels",
    productCount: 10,
    icon: "🧢",
  },
  {
    id: "cat-stationery",
    name: "Journals & Stationery",
    slug: "stationery",
    description: "Elastic & buckle holder leather journals, magnetic pens & notebooks",
    productCount: 6,
    icon: "📓",
  },
  {
    id: "cat-jewelry-accessories",
    name: "Jewelry & Accessories",
    slug: "jewelry-accessories",
    description: "Custom engraved necklaces, bracelets, wristwatches, throw pillows & phone pouches",
    productCount: 9,
    icon: "💍",
  },
  {
    id: "cat-packaging-stickers",
    name: "Packaging & Stickers",
    slug: "packaging-stickers",
    description: "Custom printed carrier nylons (S/M/L) & die-cut brand logo stickers",
    productCount: 8,
    icon: "🛍️",
  },
  {
    id: "cat-prints-cards",
    name: "Prints, Cards & Magazines",
    slug: "prints-cards",
    description: "Milestone magazines, custom greeting cards, thank you cards, business cards & flyers",
    productCount: 14,
    icon: "📜",
  },
  {
    id: "cat-gift-boxes",
    name: "Curated Gift Hampers",
    slug: "gift-boxes",
    description: "Bespoke gift boxes filled with curated personalized items for celebrations",
    productCount: 6,
    icon: "🎁",
  },
];

// ============================================================================
// OFFICIAL VERIFIED PRODUCTS (Derived From Oludax Concept Official Price List)
// ============================================================================

export const products: Product[] = [
  // 1. MUGS
  {
    id: "prod-custom-mug",
    name: "Customized Ceramic Mug (Normal / Mirror / Magic)",
    slug: "customized-mugs",
    price: 5500,
    compareAtPrice: 7000,
    primaryImage: "",
    images: [],
    description:
      "Signature Oludax Concept customized mug. Choose between our Normal Ceramic Mug (₦5,500), Mirror Finish Mug (₦6,500), or Magic Heat-Revealing Mug (₦7,500) that magically reveals your personalized picture and love quote when hot beverage is poured.",
    shortDescription: "Custom personalized ceramic, mirror, or heat-revealing magic mug",
    category: "Mugs & Bottles",
    categorySlug: "mugs-bottles",
    tags: ["mug", "magic mug", "mirror mug", "custom mug", "ceramic", "coffee"],
    inStock: true,
    stockCount: 60,
    rating: 4.9,
    reviewCount: 142,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Recipient name to print on mug (e.g. Sarah, Jessica)",
      nameMaxLength: 25,
      allowMessage: true,
      messagePrompt: "Personal quote or sweet message",
      messageMaxLength: 100,
      allowColor: true,
      colors: ["#C40E75", "#720D46", "#F68EA8", "#000000", "#FFFFFF"],
      allowDesign: true,
      designs: ["Normal Ceramic (₦5,500)", "Mirror Mug (₦6,500)", "Magic Heat Mug (₦7,500)"],
      allowImage: true,
      imagePrompt: "Upload photo memory or brand logo",
      instructionsHelpText: "Permanent heat-press sublimation print that never fades.",
    },
    featured: true,
    newArrival: false,
    bestSeller: true,
    specifications: {
      Capacity: "350ml (11 oz)",
      Variants: "Normal (₦5,500) | Mirror (₦6,500) | Magic Heat (₦7,500)",
      Material: "Grade-A Ceramic / Thermal Reactive Glaze",
      Print: "Sublimation heat press",
    },
    deliveryInfo: "Dispatches in 1-2 business days across Nigeria.",
  },

  // 2. PHONE POUCH / CASES
  {
    id: "prod-phone-pouch",
    name: "Customized Photo Phone Case (Android & iPhone)",
    slug: "customized-phone-pouch",
    price: 5000,
    compareAtPrice: 7500,
    primaryImage: "",
    images: [],
    description:
      "Shockproof custom phone case with your high-definition portrait, romantic couples photo, or aesthetic artwork printed with scratch-resistant gloss finish. Android models: ₦5,000 | iPhone models: ₦6,000.",
    shortDescription: "Impact-absorbing custom photo printed phone case for iPhone & Android",
    category: "Jewelry & Accessories",
    categorySlug: "jewelry-accessories",
    tags: ["phone case", "pouch", "iphone", "android", "custom phone case"],
    inStock: true,
    stockCount: 80,
    rating: 4.8,
    reviewCount: 98,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Exact Phone Model (e.g. iPhone 14 Pro, Samsung S23)",
      nameMaxLength: 30,
      allowImage: true,
      imagePrompt: "Upload your favorite portrait photo",
      allowDesign: true,
      designs: ["Android (₦5,000)", "iPhone (₦6,000)"],
      phoneModels: [
        "iPhone 11", "iPhone 12", "iPhone 13", "iPhone 14", "iPhone 15", "iPhone 16",
        "Samsung Galaxy S21", "Samsung Galaxy S22", "Samsung Galaxy S23", "Samsung Galaxy S24",
        "Tecno Spark / Camon", "Infinix Hot / Note", "Redmi Note series",
      ],
      instructionsHelpText: "Please specify your exact phone variant to guarantee precision camera cutouts.",
    },
    featured: true,
    newArrival: true,
    bestSeller: false,
    specifications: {
      Pricing: "Android: ₦5,000 | iPhone: ₦6,000",
      Material: "Impact-absorbing TPU Bumper with hardened polycarbonate backplate",
      Finish: "UV-cured scratch resistant gloss",
    },
    deliveryInfo: "Ships within 2 business days.",
  },

  // 3. HEADWEARS
  {
    id: "prod-custom-headwears",
    name: "Customized Headwears & Satin Hair Bonnet",
    slug: "customized-headwears-bonnet",
    price: 3000,
    compareAtPrice: 5000,
    primaryImage: "",
    images: [],
    description:
      "Personalized headwear collection. Headband: ₦3,000 | Mulberry Satin Hair Bonnet: ₦4,000 | Custom Foam Trucker Hat: ₦6,000 | Custom Snapback: ₦8,000. Customized with your name, street moniker, or custom slogan.",
    shortDescription: "Personalized headbands, silk satin bonnets, trucker hats & snapbacks",
    category: "Headwears & Apparel",
    categorySlug: "headwears-apparel",
    tags: ["trucker hat", "snapback", "hair bonnet", "headband", "caps", "headwear"],
    inStock: true,
    stockCount: 50,
    rating: 4.8,
    reviewCount: 87,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Name or text to customize on hat/bonnet",
      nameMaxLength: 20,
      allowDesign: true,
      designs: [
        "Headband (₦3,000)",
        "Hair Bonnet (₦4,000)",
        "Trucker Hat (₦6,000)",
        "Snapback (₦8,000)",
      ],
      allowColor: true,
      colors: ["#C40E75", "#720D46", "#000000", "#FFFFFF", "#00C2E4", "#FFD700"],
    },
    featured: true,
    newArrival: false,
    bestSeller: true,
    specifications: {
      Pricing: "Headband: ₦3,000 | Bonnet: ₦4,000 | Trucker Hat: ₦6,000 | Snapback: ₦8,000",
      BonnetMaterial: "Double-layered silk satin with elastic adjustor",
      HatMaterial: "Structured cotton front with breathable mesh back (Trucker)",
    },
    deliveryInfo: "Ships within 2 business days.",
  },

  // 4. BORDERLESS FRAMES
  {
    id: "prod-borderless-frame",
    name: "Custom Borderless Photo Frame (5/7 to 12/16)",
    slug: "borderless-photo-frame",
    price: 4000,
    compareAtPrice: 6000,
    primaryImage: "",
    images: [],
    description:
      "Sleek borderless mounted photo frame. Your photo printed edge-to-edge on high-grade photographic paper sealed with anti-scratch UV protective lamination. Sizes: 5/7 (₦4,000) | 8/10 (₦5,000) | 10/12 (₦6,500) | 12/16 (₦8,500).",
    shortDescription: "Edge-to-edge borderless photo frame with laminate protection",
    category: "Frames & Wall Art",
    categorySlug: "frames",
    tags: ["borderless frame", "frame", "photo", "memories", "portrait", "wall art"],
    inStock: true,
    stockCount: 75,
    rating: 4.9,
    reviewCount: 215,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Caption / anniversary date / dedication",
      nameMaxLength: 35,
      allowImage: true,
      imagePrompt: "Upload high-resolution picture to frame",
      allowDesign: true,
      designs: [
        "5/7 inch (₦4,000)",
        "8/10 inch (₦5,000)",
        "10/12 inch (₦6,500)",
        "12/16 inch (₦8,500)",
      ],
      instructionsHelpText: "Please upload clear, well-lit photos for maximum sharpness.",
    },
    featured: true,
    newArrival: false,
    bestSeller: true,
    specifications: {
      Pricing: "5/7: ₦4,000 | 8/10: ₦5,000 | 10/12: ₦6,500 | 12/16: ₦8,500",
      Board: "Sturdy reinforced MDF wood backing with tabletop kickstand and wall hook",
      Lamination: "Matte or Gloss protective anti-fade shield",
    },
    deliveryInfo: "Ships within 2 business days.",
  },

  // 5. BORDER FRAMES
  {
    id: "prod-border-frame",
    name: "Custom Classic Border Photo Frame (8/10 to 12/16)",
    slug: "border-photo-frame",
    price: 8500,
    compareAtPrice: 11000,
    primaryImage: "",
    images: [],
    description:
      "Prestigious bordered frame with high-grade molding in Classic Black, Royal Gold, or Elegant Silver. Protected by clear glass face. Sizes: 8/10 (₦8,500) | 10/12 (₦11,000) | 12/16 (₦15,000).",
    shortDescription: "Elegant wooden & metallic bordered photo frame with glass cover",
    category: "Frames & Wall Art",
    categorySlug: "frames",
    tags: ["border frame", "photo frame", "portrait", "wood frame", "wall decor"],
    inStock: true,
    stockCount: 45,
    rating: 4.9,
    reviewCount: 164,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Caption or bottom engraved plaque text",
      nameMaxLength: 40,
      allowImage: true,
      imagePrompt: "Upload portrait photo",
      allowDesign: true,
      designs: [
        "8/10 inch (₦8,500)",
        "10/12 inch (₦11,000)",
        "12/16 inch (₦15,000)",
      ],
      allowColor: true,
      colors: ["#000000", "#FFD700", "#FFFFFF", "#C0C0C0"],
    },
    featured: true,
    newArrival: false,
    bestSeller: true,
    specifications: {
      Pricing: "8/10: ₦8,500 | 10/12: ₦11,000 | 12/16: ₦15,000",
      Molding: "Premium composite wooden moulding with glass front",
      Hanger: "Pre-installed sawtooth wall hanger and tabletop stand",
    },
    deliveryInfo: "Ships within 2-3 business days.",
  },

  // 6. CUSTOMIZED JEWELRY
  {
    id: "prod-custom-jewelry",
    name: "Custom Engraved Jewelry (Necklace, Bracelet, Wristwatch)",
    slug: "customized-jewelry",
    price: 11000,
    compareAtPrice: 15000,
    primaryImage: "",
    images: [],
    description:
      "Luxury personalized jewelry piece. Bar / Nameplate Necklace: ₦11,000 | Engraved ID Link Bracelet: ₦13,000 | Custom Engraved Wristwatch: ₦20,000. Precision laser engraved with names or initials (e.g. 'King ❤️', 'Queen ❤️').",
    shortDescription: "18K Gold PVD coated laser engraved necklace, bracelet, or wristwatch",
    category: "Jewelry & Accessories",
    categorySlug: "jewelry-accessories",
    tags: ["jewelry", "necklace", "bracelet", "wristwatch", "gold", "engraved"],
    inStock: true,
    stockCount: 30,
    rating: 4.9,
    reviewCount: 92,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Name or word to engrave (e.g. King ❤️, Queen, Precious)",
      nameMaxLength: 20,
      allowDesign: true,
      designs: [
        "Nameplate Necklace (₦11,000)",
        "Engraved ID Bracelet (₦13,000)",
        "Custom Wristwatch (₦20,000)",
      ],
      allowColor: true,
      colors: ["#FFD700", "#C0C0C0", "#F68EA8"],
    },
    featured: true,
    newArrival: true,
    bestSeller: true,
    specifications: {
      Pricing: "Necklace: ₦11,000 | Bracelet: ₦13,000 | Wristwatch: ₦20,000",
      Plating: "Non-tarnish 18K Gold / Silver PVD plating on 316L Stainless Steel",
      Packaging: "Comes in velvet gift pouch ready for gifting",
    },
    deliveryInfo: "Ships within 2-3 business days.",
  },

  // 7. THROW PILLOW
  {
    id: "prod-throw-pillow",
    name: "Customized Photo Throw Pillow (Normal / Royal / Royalxx)",
    slug: "customized-throw-pillow",
    price: 10000,
    compareAtPrice: 13000,
    primaryImage: "",
    images: [],
    description:
      "Plush customized throw pillow. Normal Print Pillow: ₦10,000 | Royal (with vintage ornate gold frame pattern): ₦15,000 | Royalxx (luxury double-sided velvet): ₦18,000. Features rich color sublimation with fiber insert.",
    shortDescription: "Plush photo throw pillow with optional royal ornate gold framing",
    category: "Jewelry & Accessories",
    categorySlug: "jewelry-accessories",
    tags: ["throw pillow", "pillow", "cushion", "photo pillow", "home decor"],
    inStock: true,
    stockCount: 40,
    rating: 4.8,
    reviewCount: 78,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Dedication or anniversary text",
      nameMaxLength: 30,
      allowImage: true,
      imagePrompt: "Upload photos (up to 4 for Royal frame)",
      allowDesign: true,
      designs: [
        "Normal Pillow (₦10,000)",
        "Royal Ornate Gold (₦15,000)",
        "Royalxx Luxury Velvet (₦18,000)",
      ],
    },
    featured: false,
    newArrival: false,
    bestSeller: true,
    specifications: {
      Dimensions: "16x16 inches (40x40 cm)",
      Pricing: "Normal: ₦10,000 | Royal: ₦15,000 | Royalxx: ₦18,000",
      Filling: "High-density virgin micro-fiber filling included",
      Zipper: "Concealed bottom zipper with washable slipcover",
    },
    deliveryInfo: "Ships within 2 business days.",
  },

  // 8. CUSTOMIZED JOURNAL
  {
    id: "prod-custom-journal",
    name: "Customized Executive Journal & Notebook",
    slug: "customized-journal",
    price: 5500,
    compareAtPrice: 7500,
    primaryImage: "",
    images: [],
    description:
      "A5 faux-leather notebook with debossed/engraved name. Elastic Holder: ₦5,500 | Buckle Magnetic Holder: ₦6,000 | With Magnetic Pen: ₦7,500 | With Customized Engraved Pen: ₦8,000. Available in Sky Blue, Crimson Red, Slate Grey, and Royal Purple.",
    shortDescription: "Faux-leather executive notebook with pen holder and engraved name",
    category: "Journals & Stationery",
    categorySlug: "stationery",
    tags: ["journal", "notebook", "diary", "executive", "stationery", "pen"],
    inStock: true,
    stockCount: 65,
    rating: 4.8,
    reviewCount: 110,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Name or monogram initials to engrave on journal",
      nameMaxLength: 25,
      allowDesign: true,
      designs: [
        "Elastic Holder (₦5,500)",
        "Buckle Holder (₦6,000)",
        "With Magnetic Pen (₦7,500)",
        "With Customized Pen (₦8,000)",
      ],
      allowColor: true,
      colors: ["#00C2E4", "#C40E75", "#720D46", "#1F2937", "#000000"],
    },
    featured: true,
    newArrival: false,
    bestSeller: true,
    specifications: {
      Pricing: "Elastic: ₦5,500 | Buckle: ₦6,000 | Magnetic Pen: ₦7,500 | Custom Pen: ₦8,000",
      Pages: "192 lined acid-free ivory pages (100gsm)",
      Format: "A5 (148 x 210 mm) with ribbon bookmark",
    },
    deliveryInfo: "Ships within 2 business days.",
  },

  // 9. CUSTOMIZED BOTTLES
  {
    id: "prod-custom-bottles",
    name: "Customized Water Bottles & Insulated Flask Set",
    slug: "customized-bottles-flask",
    price: 4000,
    compareAtPrice: 6000,
    primaryImage: "",
    images: [],
    description:
      "Custom branded drinkware. Candy Bottle: ₦4,000 | Smart Temperature LED Bottle: ₦7,000 | Thermal Flask + 2 Cups Gift Set: ₦8,000 | Matte Luxury Vacuum Bottle: ₦10,000. Laser engraved or vinyl printed with custom names.",
    shortDescription: "Personalized smart temperature bottles, flasks with cups, and matte bottles",
    category: "Mugs & Bottles",
    categorySlug: "mugs-bottles",
    tags: ["bottle", "flask", "temperature bottle", "water bottle", "drinkware"],
    inStock: true,
    stockCount: 50,
    rating: 4.9,
    reviewCount: 134,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Name to personalize on bottle (e.g. Queen Beauty, Ifasoyi)",
      nameMaxLength: 20,
      allowDesign: true,
      designs: [
        "Candy Bottle (₦4,000)",
        "Temperature LED Bottle (₦7,000)",
        "Flask + 2 Cups Set (₦8,000)",
        "Matte Luxury Bottle (₦10,000)",
      ],
      allowColor: true,
      colors: ["#000000", "#FFFFFF", "#00C2E4", "#C40E75", "#F68EA8"],
    },
    featured: true,
    newArrival: false,
    bestSeller: true,
    specifications: {
      Pricing: "Candy: ₦4,000 | Temperature: ₦7,000 | Flask+2 Cups: ₦8,000 | Matte: ₦10,000",
      Capacity: "500ml",
      Material: "Food-grade stainless steel with vacuum seal",
    },
    deliveryInfo: "Ships within 2 business days.",
  },

  // 10. CUSTOMIZED TOWEL
  {
    id: "prod-custom-towel",
    name: "Custom Embroidered Towel (Face / Body / Bath)",
    slug: "customized-towel",
    price: 5500,
    compareAtPrice: 7500,
    primaryImage: "",
    images: [],
    description:
      "100% combed cotton towel with custom name or monogram embroidery. Face Towel: ₦5,500 | Body Towel: ₦10,000 | Large Bath Towel: ₦12,000. Plush, absorbent, and skin-friendly.",
    shortDescription: "Plush 100% cotton towel with custom monogram or name embroidery",
    category: "Headwears & Apparel",
    categorySlug: "headwears-apparel",
    tags: ["towel", "embroidered", "cotton", "face towel", "bath towel", "apparel"],
    inStock: true,
    stockCount: 45,
    rating: 4.7,
    reviewCount: 63,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Name to embroider (e.g. Amalia, Antonia, Hameedah)",
      nameMaxLength: 20,
      allowDesign: true,
      designs: [
        "Face Towel (₦5,500)",
        "Body Towel (₦10,000)",
        "Bath Towel (₦12,000)",
      ],
      allowColor: true,
      colors: ["#C40E75", "#720D46", "#00C2E4", "#FFD700", "#FFFFFF", "#000000"],
    },
    featured: false,
    newArrival: true,
    bestSeller: false,
    specifications: {
      Pricing: "Face: ₦5,500 | Body: ₦10,000 | Bath: ₦12,000",
      Fabric: "550gsm 100% Ring-Spun Cotton",
      Embroidery: "High-density colorfast rayon thread",
    },
    deliveryInfo: "Ships within 2-3 business days.",
  },

  // 11. CUSTOMIZED T-SHIRT
  {
    id: "prod-custom-tshirt",
    name: "Customized Printed T-Shirt (Basic / Normal / Complex)",
    slug: "customized-tshirt",
    price: 8500,
    compareAtPrice: 11000,
    primaryImage: "",
    images: [],
    description:
      "Premium 220gsm cotton t-shirt with DTF or screen printing. Basic (pocket logo/monogram): ₦8,500 | Normal (large front graphic): ₦10,000 | Complex (multi-side + QR codes): ₦12,000.",
    shortDescription: "Premium heavyweight cotton t-shirt with custom print or QR code",
    category: "Headwears & Apparel",
    categorySlug: "headwears-apparel",
    tags: ["t-shirt", "custom tee", "apparel", "clothing", "printed shirt"],
    inStock: true,
    stockCount: 60,
    rating: 4.8,
    reviewCount: 79,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Text or brand name to print",
      nameMaxLength: 30,
      allowImage: true,
      imagePrompt: "Upload graphic vector, photo, or QR code",
      allowDesign: true,
      designs: [
        "Basic - Chest Print (₦8,500)",
        "Normal - Front Graphic (₦10,000)",
        "Complex - Front & Back + QR (₦12,000)",
      ],
      clothingSizes: ["S", "M", "L", "XL", "XXL"],
      allowColor: true,
      colors: ["#FFFFFF", "#000000", "#C40E75", "#720D46"],
    },
    featured: false,
    newArrival: false,
    bestSeller: true,
    specifications: {
      Pricing: "Basic: ₦8,500 | Normal: ₦10,000 | Complex: ₦12,000",
      Material: "100% Combed Cotton (220gsm)",
      Fit: "Unisex regular fit",
    },
    deliveryInfo: "Ships within 2-3 business days.",
  },

  // 12. PERSONALIZED ITEMS (Pen, Keyholder, Hand Fan)
  {
    id: "prod-personalized-items",
    name: "Personalized Souvenirs (Key Holder, Pen, Hand Fan)",
    slug: "personalized-souvenirs",
    price: 1200,
    compareAtPrice: 2000,
    primaryImage: "",
    images: [],
    description:
      "Everyday personalized keepsakes and wedding/event souvenirs. Clear Acrylic Photo Key Holder: ₦1,200 | Custom Engraved Metallic Pen: ₦2,000 | Personalized Celebration Hand Fan: ₦2,000.",
    shortDescription: "Custom key holders, engraved pens, and celebration hand fans",
    category: "Jewelry & Accessories",
    categorySlug: "jewelry-accessories",
    tags: ["keychain", "pen", "hand fan", "souvenirs", "wedding gifts", "keepsakes"],
    inStock: true,
    stockCount: 150,
    rating: 4.8,
    reviewCount: 104,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Name or monogram for souvenir",
      nameMaxLength: 20,
      allowImage: true,
      imagePrompt: "Upload photo for key holder or hand fan",
      allowDesign: true,
      designs: [
        "Key Holder (₦1,200)",
        "Engraved Pen (₦2,000)",
        "Hand Fan (₦2,000)",
      ],
    },
    featured: false,
    newArrival: false,
    bestSeller: true,
    specifications: {
      Pricing: "Keyholder: ₦1,200 | Custom Pen: ₦2,000 | Hand Fan: ₦2,000",
      Usage: "Ideal as individual gifts or bulk party souvenir packs",
    },
    deliveryInfo: "Ships within 1-2 business days.",
  },

  // 13. CUSTOM CARDS
  {
    id: "prod-custom-cards",
    name: "Custom Celebration Cards & Booklets",
    slug: "custom-cards-booklets",
    price: 1500,
    compareAtPrice: 2500,
    primaryImage: "",
    images: [],
    description:
      "Handcrafted milestone greeting cards. Ready-made Card: ₦1,500 | Personalized Name Card: ₦2,000 | Mini Booklet Card: ₦2,500 | Full Booklet Card: ₦4,500. Created with bows, glitter embossing, and custom lettering.",
    shortDescription: "Personalized milestone birthday and celebration cards and mini booklets",
    category: "Prints, Cards & Magazines",
    categorySlug: "prints-cards",
    tags: ["greeting card", "birthday card", "cards", "booklet", "stationery"],
    inStock: true,
    stockCount: 80,
    rating: 4.9,
    reviewCount: 71,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Recipient name and age (e.g. 'Happy Birthday 14')",
      nameMaxLength: 30,
      allowMessage: true,
      messagePrompt: "Love note or dedication message inside",
      messageMaxLength: 180,
      allowDesign: true,
      designs: [
        "Ready-made Card (₦1,500)",
        "Personalized Card (₦2,000)",
        "Mini Booklet (₦2,500)",
        "Full Booklet (₦4,500)",
      ],
    },
    featured: false,
    newArrival: true,
    bestSeller: false,
    specifications: {
      Pricing: "Ready-made: ₦1,500 | Personalized: ₦2,000 | Mini Booklet: ₦2,500 | Booklet: ₦4,500",
      Stock: "350gsm premium textured card with foil accents",
    },
    deliveryInfo: "Ships within 1-2 business days.",
  },

  // 14. MAGAZINE
  {
    id: "prod-magazine",
    name: "Personalized Milestone Magazine (6 / 10 / 14 Pages)",
    slug: "personalized-magazine",
    price: 6500,
    compareAtPrice: 9000,
    primaryImage: "",
    images: [],
    description:
      "Turn your celebrant into a Vogue-style magazine cover star! 6 Pages Edition: ₦6,500 | 10 Pages Edition: ₦8,500 | 14 Pages Luxury Edition: ₦11,000. Features glossy cover, birthday interview, photo galleries, and heartfelt tributes.",
    shortDescription: "Glossy personalized celebrant magazine with custom cover and photo articles",
    category: "Prints, Cards & Magazines",
    categorySlug: "prints-cards",
    tags: ["magazine", "birthday magazine", "celebration", "editorial", "prints"],
    inStock: true,
    stockCount: 30,
    rating: 5.0,
    reviewCount: 48,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Celebrant Name & Edition (e.g. 'BIRTHDAY 31st Edition')",
      nameMaxLength: 40,
      allowImage: true,
      imagePrompt: "Upload celebrant photos for cover and inside spreads",
      allowDesign: true,
      designs: [
        "6 Pages (₦6,500)",
        "10 Pages (₦8,500)",
        "14 Pages (₦11,000)",
      ],
      instructionsHelpText: "Our layout editor will arrange your photos and send a WhatsApp proof before printing.",
    },
    featured: true,
    newArrival: true,
    bestSeller: true,
    specifications: {
      Pricing: "6 Pages: ₦6,500 | 10 Pages: ₦8,500 | 14 Pages: ₦11,000",
      Cover: "300gsm High-Gloss Laminated Cover",
      Inner: "170gsm Silk Art Paper",
      Size: "A4 (210 x 297 mm)",
    },
    deliveryInfo: "Production takes 3 business days.",
  },

  // 15. WALL COLLAGES & PINTEREST FRAMES
  {
    id: "prod-wall-collage",
    name: "Aesthetic Wall Photo Collages & Pinterest Frames",
    slug: "wall-photo-collages",
    price: 3000,
    compareAtPrice: 4500,
    primaryImage: "",
    images: [],
    description:
      "Aesthetic wall gallery prints for bedrooms, living rooms, and dorms. Ready-made Set (10 pcs): ₦3,000 | Pinterest Frames: ₦3,500 | Personalized Collage (12 pcs): ₦4,000.",
    shortDescription: "Aesthetic aesthetic wall collage card prints and Pinterest frames",
    category: "Frames & Wall Art",
    categorySlug: "frames",
    tags: ["wall collage", "pinterest", "photo prints", "aesthetic", "wall art"],
    inStock: true,
    stockCount: 70,
    rating: 4.8,
    reviewCount: 82,
    customizable: true,
    customizationOptions: {
      allowImage: true,
      imagePrompt: "Upload your photos (up to 12 photos for personalized set)",
      allowDesign: true,
      designs: [
        "Ready-made 10pcs (₦3,000)",
        "Pinterest Frames (₦3,500)",
        "Personalized 12pcs (₦4,000)",
      ],
    },
    featured: false,
    newArrival: false,
    bestSeller: false,
    specifications: {
      Pricing: "Ready-made (10pcs): ₦3,000 | Pinterest: ₦3,500 | Personalized (12pcs): ₦4,000",
      Print: "Heavy 300gsm cardstock with double-sided mounting adhesive included",
    },
    deliveryInfo: "Ships within 1-2 business days.",
  },

  // 16. BRAND STICKERS
  {
    id: "prod-brand-stickers",
    name: "Brand Logo Stickers (Round / Square / Rectangle)",
    slug: "brand-logo-stickers",
    price: 4000,
    compareAtPrice: 6000,
    primaryImage: "",
    images: [],
    description:
      "Waterproof die-cut business logo stickers. Round (3x3 in): 50 pcs (₦4,000) / 100 pcs (₦7,500) | Square (3x3 in): 50 pcs (₦4,000) / 100 pcs (₦7,500) | Rectangle (3.5x5 in): 50 pcs (₦5,000) / 100 pcs (₦9,000).",
    shortDescription: "High-gloss waterproof die-cut product packaging and logo stickers",
    category: "Packaging & Stickers",
    categorySlug: "packaging-stickers",
    tags: ["stickers", "labels", "branding", "packaging", "business stickers"],
    inStock: true,
    stockCount: 100,
    rating: 4.9,
    reviewCount: 118,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Business Name / Instagram Handle / Phone",
      nameMaxLength: 40,
      allowImage: true,
      imagePrompt: "Upload your logo file (PNG, JPG, PDF)",
      allowDesign: true,
      designs: [
        "Round 3x3 (50 pcs - ₦4,000)",
        "Round 3x3 (100 pcs - ₦7,500)",
        "Square 3x3 (50 pcs - ₦4,000)",
        "Square 3x3 (100 pcs - ₦7,500)",
        "Rectangle 3.5x5 (50 pcs - ₦5,000)",
        "Rectangle 3.5x5 (100 pcs - ₦9,000)",
      ],
    },
    featured: true,
    newArrival: false,
    bestSeller: true,
    specifications: {
      Pricing: "Round/Square 3x3: 50 for ₦4,000 | 100 for ₦7,500. Rectangle: 50 for ₦5,000 | 100 for ₦9,000",
      Adhesive: "Permanent strong adhesion, smudge-proof vinyl",
    },
    deliveryInfo: "Production takes 2-3 business days.",
  },

  // 17. CUSTOMIZED CARRIER NYLONS
  {
    id: "prod-custom-nylons",
    name: "Customized Carrier Nylons (Small / Medium / Large)",
    slug: "customized-carrier-nylons",
    price: 10000,
    compareAtPrice: 14000,
    primaryImage: "",
    images: [],
    description:
      "Branded shopping carrier bags for boutiques, perfumes, clothing, and food brands. Small: 50 pcs (₦10,000) / 100 pcs (₦16,000) | Medium: 50 pcs (₦14,000) / 100 pcs (₦19,000) | Large: 50 pcs (₦19,500) / 100 pcs (₦28,000).",
    shortDescription: "Custom printed business merchandise bags with your logo and social handles",
    category: "Packaging & Stickers",
    categorySlug: "packaging-stickers",
    tags: ["nylons", "shopping bags", "carrier bags", "packaging", "branding"],
    inStock: true,
    stockCount: 80,
    rating: 4.9,
    reviewCount: 95,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Business Brand Name",
      nameMaxLength: 35,
      allowMessage: true,
      messagePrompt: "Instagram handle, WhatsApp number, and slogan",
      messageMaxLength: 100,
      allowImage: true,
      imagePrompt: "Upload logo file",
      allowDesign: true,
      designs: [
        "Small (50 pcs - ₦10,000)",
        "Small (100 pcs - ₦16,000)",
        "Medium (50 pcs - ₦14,000)",
        "Medium (100 pcs - ₦19,000)",
        "Large (50 pcs - ₦19,500)",
        "Large (100 pcs - ₦28,000)",
      ],
      allowColor: true,
      colors: ["#C40E75", "#720D46", "#000000", "#FFFFFF", "#00C2E4", "#FFD700"],
    },
    featured: true,
    newArrival: false,
    bestSeller: true,
    specifications: {
      Pricing: "Small: 50(₦10k), 100(₦16k) | Medium: 50(₦14k), 100(₦19k) | Large: 50(₦19.5k), 100(₦28k)",
      Material: "Reinforced high-density polyethylene with punched handle",
    },
    deliveryInfo: "Production takes 3-4 business days.",
  },

  // 18. THANK YOU CARDS
  {
    id: "prod-thankyou-cards",
    name: "Custom Luxury Thank You Cards (50 / 100 pcs)",
    slug: "thank-you-cards",
    price: 4000,
    compareAtPrice: 6000,
    primaryImage: "",
    images: [],
    description:
      "Deep wine / berry floral thank-you cards for client packages. 50 pcs (Single side): ₦4,000 | 100 pcs (Single side): ₦7,000 | 50 pcs (Front & Back): ₦6,000. Features soft-touch silk matte lamination.",
    shortDescription: "Custom gratitude thank you cards for packaging and celebrations",
    category: "Prints, Cards & Magazines",
    categorySlug: "prints-cards",
    tags: ["thank you card", "cards", "stationery", "packaging card", "branding"],
    inStock: true,
    stockCount: 120,
    rating: 4.8,
    reviewCount: 88,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Brand or personal signature name",
      nameMaxLength: 30,
      allowMessage: true,
      messagePrompt: "Custom gratitude message and social handle",
      messageMaxLength: 150,
      allowDesign: true,
      designs: [
        "Single Side (50 pcs - ₦4,000)",
        "Single Side (100 pcs - ₦7,000)",
        "Front & Back (50 pcs - ₦6,000)",
      ],
    },
    featured: false,
    newArrival: false,
    bestSeller: true,
    specifications: {
      Pricing: "50 pcs: ₦4,000 | 100 pcs: ₦7,000 | Front & Back (50 pcs): ₦6,000",
      Paper: "350gsm Silk Artboard with matte soft-touch lamination",
      Size: "Standard Business/Gift Insert size (3.5 x 2 inches)",
    },
    deliveryInfo: "Ships within 2 business days.",
  },

  // 19. BUSINESS CARDS
  {
    id: "prod-business-cards",
    name: "Custom Luxury Business Cards (50 / 100 pcs)",
    slug: "business-cards",
    price: 6500,
    compareAtPrice: 9000,
    primaryImage: "",
    images: [],
    description:
      "Executive business cards with high impact presentation. 50 pcs (Single side): ₦6,500 | 100 pcs (Single side): ₦11,000 | 50 pcs (Front & Back): ₦8,000. Printed on heavy 400gsm cardstock.",
    shortDescription: "Professional double or single-sided luxury corporate business cards",
    category: "Prints, Cards & Magazines",
    categorySlug: "prints-cards",
    tags: ["business cards", "corporate", "branding", "calling cards", "stationery"],
    inStock: true,
    stockCount: 90,
    rating: 4.9,
    reviewCount: 105,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Full Name & Professional Title",
      nameMaxLength: 40,
      allowMessage: true,
      messagePrompt: "Phone number, email, website, and address",
      messageMaxLength: 160,
      allowImage: true,
      imagePrompt: "Upload logo file",
      allowDesign: true,
      designs: [
        "Single Side (50 pcs - ₦6,500)",
        "Single Side (100 pcs - ₦11,000)",
        "Front & Back (50 pcs - ₦8,000)",
      ],
    },
    featured: true,
    newArrival: false,
    bestSeller: false,
    specifications: {
      Pricing: "50 pcs: ₦6,500 | 100 pcs: ₦11,000 | Front & Back 50 pcs: ₦8,000",
      Stock: "400gsm Heavy Silk Card with velvet touch coating",
    },
    deliveryInfo: "Dispatches within 2 business days.",
  },

  // 20. PAPER FLYERS
  {
    id: "prod-flyers",
    name: "Custom Promotional Paper Flyers (A5 & A4)",
    slug: "paper-flyers",
    price: 5000,
    compareAtPrice: 7500,
    primaryImage: "",
    images: [],
    description:
      "Vibrant full-color promotional flyers. A5 Size: 50 pcs (₦5,000) / 100 pcs (₦9,500) | A4 Size: 50 pcs (₦8,000) / 100 pcs (₦15,000). High gloss 150gsm paper for crystal clear images and QR codes.",
    shortDescription: "Full-colour marketing and event flyers in A5 and A4 formats",
    category: "Prints, Cards & Magazines",
    categorySlug: "prints-cards",
    tags: ["flyers", "posters", "marketing", "event flyers", "promotional", "prints"],
    inStock: true,
    stockCount: 100,
    rating: 4.8,
    reviewCount: 67,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Campaign / Event Title",
      nameMaxLength: 50,
      allowImage: true,
      imagePrompt: "Upload flyer design / artwork",
      allowDesign: true,
      designs: [
        "A5 Size (50 pcs - ₦5,000)",
        "A5 Size (100 pcs - ₦9,500)",
        "A4 Size (50 pcs - ₦8,000)",
        "A4 Size (100 pcs - ₦15,000)",
      ],
    },
    featured: false,
    newArrival: false,
    bestSeller: false,
    specifications: {
      Pricing: "A5: 50(₦5k), 100(₦9.5k) | A4: 50(₦8k), 100(₦15k)",
      Paper: "150gsm Gloss Art Paper",
    },
    deliveryInfo: "Production takes 2-3 business days.",
  },

  // 21. CURATED GIFT BOX
  {
    id: "prod-giftbox-luxury",
    name: "Oludax Concept Curated Luxury Celebration Hamper",
    slug: "luxury-celebration-hamper",
    price: 25000,
    compareAtPrice: 32000,
    primaryImage: "",
    images: [],
    description:
      "All-in-one celebration hamper curated by Oludax Concept. Contains a custom ceramic mug, personalized journal, stainless pen, scented candle, and luxury greeting card enclosed in a rigid keepsake box tied with satin ribbon.",
    shortDescription: "Curated celebration hamper with personalized mug, journal, pen and greeting card",
    category: "Curated Gift Hampers",
    categorySlug: "gift-boxes",
    tags: ["hamper", "gift box", "curated", "luxury", "celebration", "gift set"],
    inStock: true,
    stockCount: 25,
    rating: 5.0,
    reviewCount: 76,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Celebrant Name for outer box & mug",
      nameMaxLength: 30,
      allowMessage: true,
      messagePrompt: "Personal gift card message",
      messageMaxLength: 180,
      allowColor: true,
      colors: ["#C40E75", "#720D46", "#FFD700", "#000000"],
    },
    featured: true,
    newArrival: true,
    bestSeller: true,
    specifications: {
      Dimensions: "32cm x 26cm x 12cm rigid gift box with magnetic closure",
      Contents: "Personalized mug, engraved journal, metallic pen, scented candle, greeting card",
    },
    deliveryInfo: "Ships within 1-2 business days across Nigeria.",
  },
];

// ============================================================================
// CATALOG QUERY & HELPER FUNCTIONS
// ============================================================================

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getNewArrivals(): Product[] {
  return products.filter((p) => p.newArrival);
}

export function getBestSellers(): Product[] {
  return products.filter((p) => p.bestSeller);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...products];
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
  );
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProductPrimaryImage(product: Product): string {
  if (product.primaryImage) return product.primaryImage;
  if (product.images && product.images.length > 0) return product.images[0];
  return "";
}

export function isSampleProduct(product: Product): boolean {
  return product.isSample === true;
}

export function formatPrice(amount: number): string {
  if (typeof amount !== "number" || isNaN(amount) || amount < 0) {
    return `${NGN_CURRENCY_SYMBOL}0`;
  }
  return `${NGN_CURRENCY_SYMBOL}${amount.toLocaleString("en-NG")}`;
}
