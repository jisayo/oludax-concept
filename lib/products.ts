/**
 * OLUDAX CONCEPT - Product Catalog & Customization System
 *
 * IMPORTANT NOTICE:
 * All product records, pricing, inventory counts, ratings, and review metrics
 * in this file are SAMPLE / DEMO data intended strictly for layout, development,
 * and staging previews. They do not represent verified OLUDAX CONCEPT business data.
 */

export const SAMPLE_CATALOG_NOTICE =
  "Sample data for demonstration only. All products, prices, ratings, and inventory counts are placeholder values and do not represent verified OLUDAX CONCEPT business records.";

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

  if (
    options.allowColor &&
    selection.selectedColor &&
    options.colors &&
    options.colors.length > 0
  ) {
    if (!options.colors.includes(selection.selectedColor)) {
      errors.push({
        field: "selectedColor",
        message: `Selected colour "${selection.selectedColor}" is not in the allowed options.`,
      });
    }
  }

  if (
    options.allowDesign &&
    selection.selectedDesign &&
    options.designs &&
    options.designs.length > 0
  ) {
    if (!options.designs.includes(selection.selectedDesign)) {
      errors.push({
        field: "selectedDesign",
        message: `Selected design "${selection.selectedDesign}" is not in the allowed options.`,
      });
    }
  }

  if (
    options.clothingSizes &&
    options.clothingSizes.length > 0 &&
    selection.selectedSize
  ) {
    if (!options.clothingSizes.includes(selection.selectedSize)) {
      errors.push({
        field: "selectedSize",
        message: `Selected size "${selection.selectedSize}" is not in the allowed clothing sizes.`,
      });
    }
  }

  if (
    options.phoneModels &&
    options.phoneModels.length > 0 &&
    selection.selectedPhoneModel
  ) {
    if (!options.phoneModels.includes(selection.selectedPhoneModel)) {
      errors.push({
        field: "selectedPhoneModel",
        message: `Selected model "${selection.selectedPhoneModel}" is not in the allowed phone models.`,
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
// CATEGORIES (Sample Data)
// ============================================================================

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Personalized Gifts",
    slug: "personalized-gifts",
    description: "Unique gifts with a personal touch",
    productCount: 12,
    icon: "🎁",
  },
  {
    id: "cat-2",
    name: "Gift Boxes",
    slug: "gift-boxes",
    description: "Beautifully curated gift box sets",
    productCount: 8,
    icon: "📦",
  },
  {
    id: "cat-3",
    name: "Flowers",
    slug: "flowers",
    description: "Fresh flower bouquets and arrangements",
    productCount: 10,
    icon: "💐",
  },
  {
    id: "cat-4",
    name: "Customized Mugs",
    slug: "customized-mugs",
    description: "Mugs with your own design or text",
    productCount: 15,
    icon: "☕",
  },
  {
    id: "cat-5",
    name: "Apparel",
    slug: "apparel",
    description: "Custom printed clothing items",
    productCount: 9,
    icon: "👕",
  },
  {
    id: "cat-6",
    name: "Accessories",
    slug: "accessories",
    description: "Personalized accessories and jewelry",
    productCount: 11,
    icon: "💍",
  },
  {
    id: "cat-7",
    name: "Birthday Gifts",
    slug: "birthday-gifts",
    description: "Perfect gifts for birthday celebrations",
    productCount: 14,
    icon: "🎂",
  },
  {
    id: "cat-8",
    name: "Anniversary Gifts",
    slug: "anniversary-gifts",
    description: "Celebrate love with special gifts",
    productCount: 7,
    icon: "💕",
  },
  {
    id: "cat-9",
    name: "Corporate Gifts",
    slug: "corporate-gifts",
    description: "Professional gifts for business occasions",
    productCount: 6,
    icon: "💼",
  },
  {
    id: "cat-10",
    name: "Celebration Packages",
    slug: "celebration-packages",
    description: "Complete celebration setup packages",
    productCount: 5,
    icon: "🎉",
  },
];

// ============================================================================
// SAMPLE PRODUCTS (Clearly Identified Placeholder Data)
// ============================================================================

export const products: Product[] = [
  {
    id: "prod-1",
    name: "Personalized Ceramic Mug",
    slug: "personalized-mug",
    price: 8000,
    compareAtPrice: 10000,
    primaryImage: "/images/products/sample-mug.jpg",
    images: [
      "/images/products/sample-mug.jpg",
      "/images/products/sample-mug-side.jpg",
      "/images/products/sample-mug-box.jpg",
    ],
    description:
      "A high-quality ceramic mug, customizable with your name, favourite quote or design. Perfect for daily use or as a thoughtful gift. Each mug is carefully printed using heat-press technology for lasting colour and durability.",
    shortDescription: "Custom ceramic mug with your name or artwork",
    category: "Customized Mugs",
    categorySlug: "customized-mugs",
    tags: ["mug", "personalized", "gift", "custom", "ceramic"],
    inStock: true,
    stockCount: 50,
    rating: 4.8,
    reviewCount: 124,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Enter name or initials",
      nameMaxLength: 25,
      allowMessage: true,
      messagePrompt: "Personal quote or message",
      messageMaxLength: 100,
      allowColor: true,
      colors: ["#F42E91", "#171016", "#FFFFFF", "#FF75B5", "#6B21A8"],
      allowDesign: true,
      designs: ["Classic Script", "Modern Sans", "Floral Frame", "Minimalist Monogram", "Crown Crest"],
      allowImage: true,
      imagePrompt: "Upload reference photo or logo",
      instructionsHelpText: "Final design placement will be reviewed before heat pressing.",
    },
    featured: true,
    newArrival: false,
    bestSeller: true,
    specifications: {
      Material: "Premium Ceramic",
      Capacity: "350ml (11 oz)",
      "Print Method": "Heat Press / Sublimation",
      "Dishwasher Safe": "Yes (top rack recommended)",
      Finish: "Glossy White Base",
    },
    deliveryInfo: "Ships within 2-3 business days after customization approval.",
    isSample: true,
    sampleNotice: "Sample demo item for interface staging. Pricing, ratings, and stock counts are demonstration placeholders.",
  },
  {
    id: "prod-2",
    name: "Luxury Fresh Flower Bouquet",
    slug: "luxury-flower-bouquet",
    price: 20000,
    compareAtPrice: 25000,
    primaryImage: "/images/products/sample-flowers.jpg",
    images: [
      "/images/products/sample-flowers.jpg",
      "/images/products/sample-flowers-wrap.jpg",
    ],
    description:
      "A stunning arrangement of fresh, hand-picked seasonal flowers wrapped in premium tissue and kraft paper. Lovingly assembled with a complimentary gift card for your heartfelt message.",
    shortDescription: "Hand-picked fresh floral bouquet with ribbon wrapping",
    category: "Flowers",
    categorySlug: "flowers",
    tags: ["flowers", "bouquet", "luxury", "fresh", "roses"],
    inStock: true,
    stockCount: 20,
    rating: 4.9,
    reviewCount: 89,
    customizable: true,
    customizationOptions: {
      allowMessage: true,
      messagePrompt: "Gift card note for the recipient",
      messageMaxLength: 180,
      allowColor: true,
      colors: ["#F42E91", "#FF0000", "#FFFFFF", "#FFD700", "#FF69B4"],
      instructionsHelpText: "Let us know your preferred ribbon shade or delivery notes.",
    },
    featured: true,
    newArrival: true,
    bestSeller: true,
    specifications: {
      "Flower Stems": "12-15 fresh seasonal stems",
      Wrapping: "Double-layered premium kraft with satin ribbon",
      Freshness: "5-7 days with recommended water care",
      Includes: "Care instructions card and floral nutrient pack",
    },
    deliveryInfo: "Same-day delivery available for orders confirmed before 12:00 PM.",
    isSample: true,
    sampleNotice: "Sample demo item for interface staging. Pricing, ratings, and stock counts are demonstration placeholders.",
  },
  {
    id: "prod-3",
    name: "Custom Curated Gift Box",
    slug: "custom-gift-box",
    price: 15000,
    compareAtPrice: 18000,
    primaryImage: "/images/products/sample-giftbox.jpg",
    images: [
      "/images/products/sample-giftbox.jpg",
      "/images/products/sample-giftbox-open.jpg",
    ],
    description:
      "A beautifully presented rigid gift box filled with hand-selected treats, scented items, and custom keepsakes. Tied with an elegant silk ribbon and custom gift tag.",
    shortDescription: "Curated gift box filled with treats and bespoke items",
    category: "Gift Boxes",
    categorySlug: "gift-boxes",
    tags: ["gift box", "curated", "personalized", "luxury", "hampers"],
    inStock: true,
    stockCount: 30,
    rating: 4.7,
    reviewCount: 67,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Recipient name for outer box lid",
      nameMaxLength: 30,
      allowMessage: true,
      messagePrompt: "Personal greeting card note",
      messageMaxLength: 200,
      allowDesign: true,
      designs: ["Classic Elegance", "Celebration Confetti", "Modern Minimalist", "Romantic Pastel"],
      instructionsHelpText: "Indicate dietary restrictions or special packaging requests.",
    },
    featured: true,
    newArrival: false,
    bestSeller: true,
    specifications: {
      Dimensions: "30cm x 25cm x 12cm",
      "Box Type": "Rigid board with magnetic snap closure",
      Contents: "4-6 curated lifestyle and treat items",
      Finishing: "Satin bow with embossed gift tag",
    },
    deliveryInfo: "Ships within 1-2 business days across Nigeria.",
    isSample: true,
    sampleNotice: "Sample demo item for interface staging. Pricing, ratings, and stock counts are demonstration placeholders.",
  },
  {
    id: "prod-4",
    name: "Plush Companion Teddy Bear",
    slug: "cute-teddy-bear",
    price: 12000,
    compareAtPrice: 14000,
    primaryImage: "/images/products/sample-teddy.jpg",
    images: ["/images/products/sample-teddy.jpg"],
    description:
      "An ultra-soft cuddly companion teddy bear with a satin bow. Ideal on its own or paired with flowers and a personalized message ribbon.",
    shortDescription: "Ultra-soft plush teddy bear with decorative ribbon",
    category: "Personalized Gifts",
    categorySlug: "personalized-gifts",
    tags: ["teddy", "plush", "soft toy", "gift", "companion"],
    inStock: true,
    stockCount: 40,
    rating: 4.6,
    reviewCount: 53,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Name to print on ribbon tag",
      nameMaxLength: 20,
      allowMessage: true,
      messagePrompt: "Short message for bear tag",
      messageMaxLength: 60,
      allowColor: true,
      colors: ["#F42E91", "#8B4513", "#FFFFFF", "#FFB6C1", "#DEB887"],
    },
    featured: false,
    newArrival: true,
    bestSeller: true,
    specifications: {
      Height: "30cm sitting height",
      Material: "Hypoallergenic plush with polyester filling",
      Safety: "Tested for all ages with securely stitched eyes",
    },
    deliveryInfo: "Ships within 1-2 business days.",
    isSample: true,
    sampleNotice: "Sample demo item for interface staging. Pricing, ratings, and stock counts are demonstration placeholders.",
  },
  {
    id: "prod-5",
    name: "Custom Embroidered Hoodie",
    slug: "custom-hoodie",
    price: 25000,
    compareAtPrice: 30000,
    primaryImage: "/images/products/sample-hoodie.jpg",
    images: [
      "/images/products/sample-hoodie.jpg",
      "/images/products/sample-hoodie-back.jpg",
    ],
    description:
      "Heavyweight cotton fleece hoodie tailored for comfort and durability. Add custom chest embroidery, back print, or your personalized initials.",
    shortDescription: "Heavyweight fleece hoodie with custom print or embroidery",
    category: "Apparel",
    categorySlug: "apparel",
    tags: ["hoodie", "custom", "apparel", "clothing", "embroidered"],
    inStock: true,
    stockCount: 25,
    rating: 4.5,
    reviewCount: 38,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Name or text to embroider/print",
      nameMaxLength: 25,
      allowColor: true,
      colors: ["#171016", "#FFFFFF", "#F42E91", "#1F2937", "#7C3AED"],
      allowDesign: true,
      designs: ["Center Chest", "Left Chest Minimal", "Full Back Graphic", "Sleeve Monogram"],
      allowImage: true,
      imagePrompt: "Upload logo or graphic vector/image",
      clothingSizes: ["S", "M", "L", "XL", "XXL"],
      instructionsHelpText: "Specify embroidery thread color or font preference.",
    },
    featured: true,
    newArrival: true,
    bestSeller: false,
    specifications: {
      Fabric: "320gsm 80% Cotton, 20% Polyester fleece",
      Fit: "Unisex regular fit",
      Pocket: "Front kangaroo pouch",
      Care: "Machine wash cold inside-out, tumble dry low",
    },
    deliveryInfo: "Ships within 3-5 business days after artwork approval.",
    isSample: true,
    sampleNotice: "Sample demo item for interface staging. Pricing, ratings, and stock counts are demonstration placeholders.",
  },
  {
    id: "prod-6",
    name: "Organic Canvas Tote Bag",
    slug: "personalized-tote-bag",
    price: 10000,
    compareAtPrice: 12000,
    primaryImage: "/images/products/sample-tote.jpg",
    images: ["/images/products/sample-tote.jpg"],
    description:
      "Eco-friendly 100% organic cotton canvas tote. Durable, spacious, and customized with your preferred graphic, phrase, or personalized monogram.",
    shortDescription: "Reinforced organic canvas tote bag with custom print",
    category: "Accessories",
    categorySlug: "accessories",
    tags: ["tote", "bag", "custom", "eco-friendly", "canvas"],
    inStock: true,
    stockCount: 60,
    rating: 4.4,
    reviewCount: 42,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Monogram or custom headline",
      nameMaxLength: 24,
      allowImage: true,
      imagePrompt: "Upload illustration or custom artwork",
      allowColor: true,
      colors: ["#FFFFFF", "#F5F5DC", "#171016", "#F42E91"],
    },
    featured: false,
    newArrival: false,
    bestSeller: false,
    specifications: {
      Material: "100% Certified Organic Cotton Canvas (12 oz)",
      Dimensions: "38cm x 42cm with 25cm drop handles",
      Capacity: "Approx. 15 Litres",
    },
    deliveryInfo: "Ships within 2-3 business days.",
    isSample: true,
    sampleNotice: "Sample demo item for interface staging. Pricing, ratings, and stock counts are demonstration placeholders.",
  },
  {
    id: "prod-7",
    name: "Celebration Package - Gold Tier",
    slug: "celebration-package-gold",
    price: 45000,
    compareAtPrice: 55000,
    primaryImage: "/images/products/sample-celebration.jpg",
    images: ["/images/products/sample-celebration.jpg"],
    description:
      "All-in-one celebration bundle containing a custom backdrop banner, balloon garland components, cake topper, and commemorative keepsake box.",
    shortDescription: "Complete celebration party kit with personalized banner",
    category: "Celebration Packages",
    categorySlug: "celebration-packages",
    tags: ["celebration", "party", "package", "birthday", "anniversary"],
    inStock: true,
    stockCount: 10,
    rating: 4.9,
    reviewCount: 31,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Celebrant name / Couple names",
      nameMaxLength: 35,
      allowMessage: true,
      messagePrompt: "Banner subtitle (e.g. 'Happy 30th Birthday')",
      messageMaxLength: 80,
      allowColor: true,
      colors: ["#FFD700", "#F42E91", "#C0C0C0", "#FF69B4"],
      allowDesign: true,
      designs: ["Birthday Milestone", "Anniversary Elegance", "Graduation Salute", "Bridal Glow"],
    },
    featured: true,
    newArrival: true,
    bestSeller: false,
    specifications: {
      Includes: "Personalized banner (1.5m), 24 latex balloons, acrylic cake topper, confetti",
      Setup: "Step-by-step assembly guide included",
    },
    deliveryInfo: "Order at least 4 business days before your scheduled celebration.",
    isSample: true,
    sampleNotice: "Sample demo item for interface staging. Pricing, ratings, and stock counts are demonstration placeholders.",
  },
  {
    id: "prod-8",
    name: "Custom Protective Phone Case",
    slug: "custom-phone-case",
    price: 7000,
    compareAtPrice: 9000,
    primaryImage: "/images/products/sample-phonecase.jpg",
    images: ["/images/products/sample-phonecase.jpg"],
    description:
      "Shockproof polycarbonate phone case with raised camera bevel and UV-cured scratch-resistant printing. Personalize with your picture, initials, or monogram art.",
    shortDescription: "Impact-absorbing custom printed phone case",
    category: "Accessories",
    categorySlug: "accessories",
    tags: ["phone case", "custom", "accessories", "tech", "iphone", "samsung"],
    inStock: true,
    stockCount: 70,
    rating: 4.3,
    reviewCount: 56,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Initials or name on case",
      nameMaxLength: 18,
      allowImage: true,
      imagePrompt: "Upload high-resolution photo for print",
      allowDesign: true,
      designs: ["Full Photo Wrap", "Typography Minimal", "Marble Pattern", "Couples Portrait"],
      phoneModels: [
        "iPhone 13",
        "iPhone 13 Pro",
        "iPhone 14",
        "iPhone 14 Pro",
        "iPhone 15",
        "iPhone 15 Pro",
        "Samsung Galaxy S22",
        "Samsung Galaxy S23",
        "Samsung Galaxy S24",
      ],
      instructionsHelpText: "Please confirm your exact phone model to guarantee port alignment.",
    },
    featured: false,
    newArrival: true,
    bestSeller: false,
    specifications: {
      Material: "Dual-layer TPU bumper + Polycarbonate hard back",
      DropProtection: "Tested for drops up to 1.5 metres",
      WirelessCharging: "Compatible with Qi chargers",
    },
    deliveryInfo: "Ships within 2-3 business days.",
    isSample: true,
    sampleNotice: "Sample demo item for interface staging. Pricing, ratings, and stock counts are demonstration placeholders.",
  },
  {
    id: "prod-9",
    name: "Executive Corporate Gift Set",
    slug: "corporate-gift-set",
    price: 35000,
    compareAtPrice: 40000,
    primaryImage: "/images/products/sample-corporate.jpg",
    images: ["/images/products/sample-corporate.jpg"],
    description:
      "Prestigious executive gift set featuring an A5 faux-leather notebook, matte metal ballpoint pen, stainless business card case, and thermal coaster.",
    shortDescription: "Branded executive desk accessory and notebook set",
    category: "Corporate Gifts",
    categorySlug: "corporate-gifts",
    tags: ["corporate", "business", "professional", "branded", "executive"],
    inStock: true,
    stockCount: 15,
    rating: 4.7,
    reviewCount: 22,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Executive name or title to engrave",
      nameMaxLength: 30,
      allowMessage: true,
      messagePrompt: "Corporate message on inside card",
      messageMaxLength: 150,
      allowImage: true,
      imagePrompt: "Upload company logo vector or PNG",
      allowDesign: true,
      designs: ["Laser Engraved", "Gold Foil Embossed", "Silver Foil Embossed", "Debossed"],
      instructionsHelpText: "Contact sales team for orders above 20 sets.",
    },
    featured: true,
    newArrival: false,
    bestSeller: false,
    specifications: {
      Includes: "A5 Hardcover Notebook (192 pages), Metal Pen, Card Case, Luxury Gift Box",
      Branding: "Laser engraving or foil stamping available",
    },
    deliveryInfo: "Ships within 3-5 business days.",
    isSample: true,
    sampleNotice: "Sample demo item for interface staging. Pricing, ratings, and stock counts are demonstration placeholders.",
  },
  {
    id: "prod-10",
    name: "Rose Gold Name Bracelet",
    slug: "rose-gold-bracelet",
    price: 15000,
    compareAtPrice: 18000,
    primaryImage: "/images/products/sample-bracelet.jpg",
    images: ["/images/products/sample-bracelet.jpg"],
    description:
      "Tarnish-resistant stainless steel bracelet finished in high-polish 18K rose gold plating. Features a dainty name bar with precision laser engraving.",
    shortDescription: "18K rose gold plated bar bracelet with custom engraving",
    category: "Accessories",
    categorySlug: "accessories",
    tags: ["bracelet", "jewelry", "rose gold", "engraved", "accessories"],
    inStock: true,
    stockCount: 35,
    rating: 4.8,
    reviewCount: 44,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Name to engrave on bar plate",
      nameMaxLength: 12,
      allowMessage: true,
      messagePrompt: "Secret message on back of bar (optional)",
      messageMaxLength: 15,
    },
    featured: false,
    newArrival: true,
    bestSeller: true,
    specifications: {
      Metal: "316L Surgical-Grade Stainless Steel",
      Plating: "18K Rose Gold PVD vacuum coating (hypoallergenic)",
      ChainLength: "16cm + 4cm extension link",
    },
    deliveryInfo: "Ships within 2-3 business days in a velvet gift pouch.",
    isSample: true,
    sampleNotice: "Sample demo item for interface staging. Pricing, ratings, and stock counts are demonstration placeholders.",
  },
  {
    id: "prod-11",
    name: "Custom Screen-Printed T-Shirt",
    slug: "custom-t-shirt",
    price: 12000,
    compareAtPrice: 15000,
    primaryImage: "/images/products/sample-tshirt.jpg",
    images: ["/images/products/sample-tshirt.jpg"],
    description:
      "100% combed cotton jersey t-shirt with soft-touch feel and reinforced double-needle seams. Suitable for single bespoke prints or event batches.",
    shortDescription: "Combed cotton crewneck t-shirt with custom print",
    category: "Apparel",
    categorySlug: "apparel",
    tags: ["t-shirt", "custom", "apparel", "printed", "cotton"],
    inStock: true,
    stockCount: 45,
    rating: 4.5,
    reviewCount: 61,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Name or custom text line",
      nameMaxLength: 25,
      allowColor: true,
      colors: ["#FFFFFF", "#171016", "#F42E91", "#1F2937", "#DC2626"],
      allowDesign: true,
      designs: ["Center Chest", "Pocket Crest", "Large Back Graphic"],
      allowImage: true,
      imagePrompt: "Upload graphic illustration or photo",
      clothingSizes: ["S", "M", "L", "XL", "XXL"],
    },
    featured: false,
    newArrival: false,
    bestSeller: false,
    specifications: {
      Fabric: "100% Combed Ringspun Cotton (180 GSM)",
      Collar: "Seamless rib-knit collar with taped neck and shoulders",
      Care: "Machine wash warm inside out, non-chlorine bleach only",
    },
    deliveryInfo: "Ships within 3-5 business days.",
    isSample: true,
    sampleNotice: "Sample demo item for interface staging. Pricing, ratings, and stock counts are demonstration placeholders.",
  },
  {
    id: "prod-12",
    name: "Deluxe Birthday Celebration Hamper",
    slug: "birthday-hamper-deluxe",
    price: 30000,
    compareAtPrice: 38000,
    primaryImage: "/images/products/sample-hamper.jpg",
    images: ["/images/products/sample-hamper.jpg"],
    description:
      "Richly appointed birthday celebration hamper with personalized ceramic mug, artisanal scented candle, gourmet chocolates, and personalized birthday card.",
    shortDescription: "Curated celebration hamper with treats and keepsake mug",
    category: "Birthday Gifts",
    categorySlug: "birthday-gifts",
    tags: ["birthday", "hamper", "gift set", "celebration", "luxury"],
    inStock: true,
    stockCount: 12,
    rating: 4.9,
    reviewCount: 73,
    customizable: true,
    customizationOptions: {
      allowName: true,
      namePrompt: "Birthday celebrant name for mug & tag",
      nameMaxLength: 25,
      allowMessage: true,
      messagePrompt: "Birthday greeting card text",
      messageMaxLength: 180,
      allowColor: true,
      colors: ["#F42E91", "#FFD700", "#FF69B4", "#6B21A8"],
    },
    featured: true,
    newArrival: false,
    bestSeller: true,
    specifications: {
      HamperBasket: "Handwoven natural wicker basket with fabric lining",
      Contents: "Personalized 350ml mug, soy candle (200g), assorted chocolates (180g), greeting card",
      SafetyNote: "Chocolates may contain dairy, soy, and nut traces",
    },
    deliveryInfo: "Ships within 1-2 business days across Nigeria.",
    isSample: true,
    sampleNotice: "Sample demo item for interface staging. Pricing, ratings, and stock counts are demonstration placeholders.",
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
  return `${NGN_CURRENCY_SYMBOL}${Math.round(amount).toLocaleString("en-NG")}`;
}
