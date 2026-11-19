import { createClient, SupabaseClient } from "@supabase/supabase-js";
import crypto from "crypto";
import {
  products as defaultProducts,
  categories as defaultCategories,
  Product,
  Category,
  CustomizationSelection,
} from "@/lib/products";

// ============================================================================
// TYPES
// ============================================================================

export type OrderStatus =
  | "Pending"
  | "Payment Confirmed"
  | "Processing"
  | "Customization in Progress"
  | "Ready for Dispatch"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentMethod = "paystack" | "bank_transfer" | "card" | "cash";

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  customization?: CustomizationSelection;
};

export type Order = {
  id: string;
  orderRef: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryNotes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  cancellationReason?: string;
  adminNotes?: string;
  paystackReference?: string;
  createdAt: string;
  updatedAt: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  createdAt: string;
};

export type CustomizationUpload = {
  id: string;
  orderRef?: string;
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  fileType?: string;
  createdAt: string;
};

// ============================================================================
// SUPABASE CLIENT INITIALIZATION (SAFE FALLBACK)
// ============================================================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

const HAS_SUPABASE = Boolean(
  SUPABASE_URL &&
    !SUPABASE_URL.includes("placeholder") &&
    SUPABASE_URL.startsWith("https://") &&
    SUPABASE_KEY &&
    !SUPABASE_KEY.includes("placeholder")
);

let supabaseServerClient: SupabaseClient | null = null;
if (HAS_SUPABASE) {
  try {
    supabaseServerClient = createClient(SUPABASE_URL, SUPABASE_KEY);
  } catch (err) {
    console.warn("Failed to initialize Supabase server client:", err);
  }
}

// ============================================================================
// IN-MEMORY / LOCAL STORE FALLBACK
// ============================================================================

// Initial sample orders for tracking & admin preview
const inMemoryOrders: Order[] = [
  {
    id: "ord-1",
    orderRef: "OLU-108249",
    customerName: "Adebayo Olawale",
    customerEmail: "adebayo@gmail.com",
    customerPhone: "+2348031234567",
    deliveryAddress: "14 Admiralty Way, Lekki Phase 1",
    deliveryCity: "Lekki",
    deliveryState: "Lagos",
    deliveryNotes: "Leave at front desk with security",
    items: [
      {
        productId: "prod-1",
        name: "Personalized Ceramic Mug",
        price: 8000,
        quantity: 1,
        customization: {
          customerName: "Sarah",
          selectedColor: "#FF69B4",
          message: "Happy 30th Birthday! Shine bright always.",
          selectedDesign: "Modern Sans",
        },
      },
    ],
    subtotal: 8000,
    deliveryFee: 3500,
    total: 11500,
    currency: "NGN",
    paymentMethod: "paystack",
    paymentStatus: "paid",
    orderStatus: "Customization in Progress",
    paystackReference: "pstk_ref_108249",
    createdAt: "2026-11-17T09:30:00.000Z",
    updatedAt: "2026-11-17T13:45:00.000Z",
  },
  {
    id: "ord-2",
    orderRef: "OLU-108248",
    customerName: "Chioma Nwachukwu",
    customerEmail: "chioma.n@yahoo.com",
    customerPhone: "+2348029876543",
    deliveryAddress: "22 Gana Street, Maitama",
    deliveryCity: "Maitama",
    deliveryState: "Abuja (FCT)",
    deliveryNotes: "Call when dispatch rider arrives",
    items: [
      {
        productId: "prod-2",
        name: "Luxury Fresh Flower Bouquet",
        price: 20000,
        quantity: 1,
        customization: {
          message: "To my queen, forever and always.",
          selectedColor: "#FF0000",
        },
      },
    ],
    subtotal: 20000,
    deliveryFee: 3500,
    total: 23500,
    currency: "NGN",
    paymentMethod: "paystack",
    paymentStatus: "paid",
    orderStatus: "Payment Confirmed",
    paystackReference: "pstk_ref_108248",
    createdAt: "2026-11-17T11:20:00.000Z",
    updatedAt: "2026-11-17T11:25:00.000Z",
  },
  {
    id: "ord-3",
    orderRef: "OLU-108247",
    customerName: "Funke Adeleke",
    customerEmail: "funke.a@outlook.com",
    customerPhone: "+2348145556677",
    deliveryAddress: "7 Trans Amadi Industrial Layout",
    deliveryCity: "Port Harcourt",
    deliveryState: "Rivers",
    items: [
      {
        productId: "prod-4",
        name: "Custom Embroidered Hoodie",
        price: 25000,
        quantity: 1,
        customization: {
          customerName: "F.A.",
          selectedSize: "L",
          selectedColor: "#171016",
        },
      },
    ],
    subtotal: 25000,
    deliveryFee: 3500,
    total: 28500,
    currency: "NGN",
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    orderStatus: "Ready for Dispatch",
    createdAt: "2026-11-16T15:10:00.000Z",
    updatedAt: "2026-11-17T08:00:00.000Z",
  },
];

const inMemoryMessages: ContactMessage[] = [];
const inMemoryUploads: CustomizationUpload[] = [];

// ============================================================================
// PRODUCTS OPERATIONS
// ============================================================================

export async function getProducts(filters?: {
  category?: string;
  search?: string;
  featured?: boolean;
  customizable?: boolean;
  sort?: string;
  limit?: number;
}): Promise<Product[]> {
  // If Supabase is configured and reachable
  if (supabaseServerClient) {
    try {
      let query = supabaseServerClient.from("products").select("*");
      if (filters?.category) {
        query = query.eq("category_slug", filters.category);
      }
      if (filters?.featured !== undefined) {
        query = query.eq("featured", filters.featured);
      }
      if (filters?.customizable !== undefined) {
        query = query.eq("customizable", filters.customizable);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map(mapDbProductToProduct);
      }
    } catch (err) {
      console.warn("Supabase query failed, falling back to local catalog:", err);
    }
  }

  // Local fallback filtering
  let result = [...defaultProducts];
  if (filters?.category) {
    result = result.filter(
      (p) =>
        p.categorySlug === filters.category ||
        p.category?.toLowerCase() === filters.category?.toLowerCase()
    );
  }
  if (filters?.featured !== undefined) {
    result = result.filter((p) => p.featured === filters.featured);
  }
  if (filters?.customizable !== undefined) {
    result = result.filter((p) => p.customizable === filters.customizable);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }

  if (filters?.sort === "price-low") {
    result.sort((a, b) => a.price - b.price);
  } else if (filters?.sort === "price-high") {
    result.sort((a, b) => b.price - a.price);
  } else if (filters?.sort === "name") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (filters?.limit) {
    result = result.slice(0, filters.limit);
  }

  return result;
}

export async function getProductByIdOrSlug(idOrSlug: string): Promise<Product | null> {
  if (supabaseServerClient) {
    try {
      const { data } = await supabaseServerClient
        .from("products")
        .select("*")
        .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
        .single();
      if (data) return mapDbProductToProduct(data);
    } catch {}
  }

  const found = defaultProducts.find(
    (p) => p.id === idOrSlug || p.slug === idOrSlug
  );
  return found || null;
}

export async function getCategories(): Promise<Category[]> {
  if (supabaseServerClient) {
    try {
      const { data } = await supabaseServerClient.from("categories").select("*");
      if (data && data.length > 0) {
        return data.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description || "",
          productCount: c.product_count || 0,
          image: c.image || undefined,
          icon: c.icon || "🎁",
        }));
      }
    } catch {}
  }
  return defaultCategories;
}

// ============================================================================
// ORDERS OPERATIONS
// ============================================================================

export type CreateOrderInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryNotes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paystackReference?: string;
};

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  // High-entropy cryptographically secure order reference (e.g. OLU-M4X9B2-E81A2F)
  const orderRef = `OLU-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  const now = new Date().toISOString();

  const newOrder: Order = {
    id: `ord_${Date.now()}`,
    orderRef,
    customerName: input.customerName.trim(),
    customerEmail: input.customerEmail.trim().toLowerCase(),
    customerPhone: input.customerPhone.trim(),
    deliveryAddress: input.deliveryAddress.trim(),
    deliveryCity: input.deliveryCity.trim(),
    deliveryState: input.deliveryState.trim(),
    deliveryNotes: input.deliveryNotes?.trim(),
    items: input.items,
    subtotal: input.subtotal,
    deliveryFee: input.deliveryFee,
    total: input.total,
    currency: "NGN",
    paymentMethod: input.paymentMethod,
    paymentStatus: input.paymentMethod === "paystack" ? "pending" : "pending",
    orderStatus: "Pending",
    paystackReference: input.paystackReference,
    createdAt: now,
    updatedAt: now,
  };

  // Try Supabase insert if available with rollback protection
  if (supabaseServerClient) {
    try {
      const { data: dbOrder, error: orderErr } = await supabaseServerClient
        .from("orders")
        .insert({
          order_ref: newOrder.orderRef,
          customer_name: newOrder.customerName,
          customer_email: newOrder.customerEmail,
          customer_phone: newOrder.customerPhone,
          delivery_address: newOrder.deliveryAddress,
          delivery_city: newOrder.deliveryCity,
          delivery_state: newOrder.deliveryState,
          delivery_notes: newOrder.deliveryNotes,
          subtotal: newOrder.subtotal,
          delivery_fee: newOrder.deliveryFee,
          total: newOrder.total,
          currency: newOrder.currency,
          payment_method: newOrder.paymentMethod,
          payment_status: newOrder.paymentStatus,
          order_status: newOrder.orderStatus,
          paystack_reference: newOrder.paystackReference,
        })
        .select()
        .single();

      if (orderErr) {
        console.error("Supabase order insert error:", orderErr);
        throw new Error(`Database order insert failed: ${orderErr.message}`);
      }

      if (dbOrder) {
        newOrder.id = dbOrder.id;

        // Insert order items atomically
        if (newOrder.items && newOrder.items.length > 0) {
          const { error: itemsErr } = await supabaseServerClient
            .from("order_items")
            .insert(
              newOrder.items.map((item) => ({
                order_id: dbOrder.id,
                order_ref: newOrder.orderRef,
                product_id: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                customization: item.customization || {},
              }))
            );

          if (itemsErr) {
            console.error("Order items insert failed, rolling back parent order:", itemsErr);
            await supabaseServerClient.from("orders").delete().eq("id", dbOrder.id);
            throw new Error(`Failed to persist order items: ${itemsErr.message}`);
          }
        }
      }
    } catch (err: any) {
      console.error("Supabase order persistence failure:", err);
      // In production or when DB is required, never report false success
      if (
        process.env.REQUIRE_DB === "true" ||
        process.env.NODE_ENV === "production" ||
        HAS_SUPABASE
      ) {
        throw new Error(
          err.message || "Failed to persist order to database. Transaction rolled back."
        );
      }
      console.warn("Dev fallback: using local memory store for development.");
    }
  }

  // Deduct inventory stock for verified items
  for (const item of newOrder.items) {
    const prod = defaultProducts.find((p) => p.id === item.productId);
    if (prod && typeof prod.stockCount === "number") {
      prod.stockCount = Math.max(0, prod.stockCount - item.quantity);
      if (prod.stockCount === 0) {
        prod.inStock = false;
      }
    }
  }

  // Always keep in local memory store for fast retrieval
  inMemoryOrders.unshift(newOrder);
  return newOrder;
}

export async function getOrderByRef(orderRef: string): Promise<Order | null> {
  const normalizedRef = orderRef.trim().toUpperCase().replace(/^#/, "");

  // Supabase check
  if (supabaseServerClient) {
    try {
      const { data: dbOrder } = await supabaseServerClient
        .from("orders")
        .select("*, order_items(*)")
        .eq("order_ref", normalizedRef)
        .single();

      if (dbOrder) {
        return {
          id: dbOrder.id,
          orderRef: dbOrder.order_ref,
          customerName: dbOrder.customer_name,
          customerEmail: dbOrder.customer_email,
          customerPhone: dbOrder.customer_phone,
          deliveryAddress: dbOrder.delivery_address,
          deliveryCity: dbOrder.delivery_city,
          deliveryState: dbOrder.delivery_state,
          deliveryNotes: dbOrder.delivery_notes,
          subtotal: Number(dbOrder.subtotal),
          deliveryFee: Number(dbOrder.delivery_fee),
          total: Number(dbOrder.total),
          currency: dbOrder.currency || "NGN",
          paymentMethod: dbOrder.payment_method,
          paymentStatus: dbOrder.payment_status,
          orderStatus: dbOrder.order_status,
          paystackReference: dbOrder.paystack_reference,
          createdAt: dbOrder.created_at,
          updatedAt: dbOrder.updated_at,
          items: (dbOrder.order_items || []).map((i: any) => ({
            productId: i.product_id,
            name: i.name,
            price: Number(i.price),
            quantity: i.quantity,
            customization: i.customization,
          })),
        };
      }
    } catch {}
  }

  // Memory fallback
  const found = inMemoryOrders.find(
    (o) => o.orderRef.toUpperCase() === normalizedRef
  );
  return found || null;
}

export async function updateOrderStatus(
  orderRef: string,
  orderStatus?: OrderStatus,
  paymentStatus?: PaymentStatus,
  paystackRef?: string
): Promise<Order | null> {
  const normalizedRef = orderRef.trim().toUpperCase().replace(/^#/, "");
  const now = new Date().toISOString();

  if (supabaseServerClient) {
    try {
      const updates: Record<string, any> = { updated_at: now };
      if (orderStatus) updates.order_status = orderStatus;
      if (paymentStatus) updates.payment_status = paymentStatus;
      if (paystackRef) updates.paystack_reference = paystackRef;

      const { error: updateErr } = await supabaseServerClient
        .from("orders")
        .update(updates)
        .eq("order_ref", normalizedRef);

      if (updateErr) {
        console.error("Supabase order status update error:", updateErr);
        if (process.env.REQUIRE_DB === "true" || process.env.NODE_ENV === "production") {
          throw new Error(`Database order status update failed: ${updateErr.message}`);
        }
      }
    } catch (err: any) {
      if (process.env.REQUIRE_DB === "true" || process.env.NODE_ENV === "production") {
        throw err;
      }
    }
  }

  // Update in memory
  const found = inMemoryOrders.find(
    (o) => o.orderRef.toUpperCase() === normalizedRef
  );
  if (found) {
    if (orderStatus) found.orderStatus = orderStatus;
    if (paymentStatus) found.paymentStatus = paymentStatus;
    if (paystackRef) found.paystackReference = paystackRef;
    found.updatedAt = now;
    return found;
  }
  return null;
}

export type UpdateOrderInput = {
  orderRef: string;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryState?: string;
  deliveryNotes?: string;
  cancellationReason?: string;
  adminNotes?: string;
  items?: OrderItem[];
};

export async function updateOrder(input: UpdateOrderInput): Promise<Order | null> {
  const normalizedRef = input.orderRef.trim().toUpperCase().replace(/^#/, "");
  const now = new Date().toISOString();

  if (supabaseServerClient) {
    try {
      const updates: Record<string, any> = { updated_at: now };
      if (input.orderStatus) updates.order_status = input.orderStatus;
      if (input.paymentStatus) updates.payment_status = input.paymentStatus;
      if (input.customerName) updates.customer_name = input.customerName.trim();
      if (input.customerEmail) updates.customer_email = input.customerEmail.trim();
      if (input.customerPhone) updates.customer_phone = input.customerPhone.trim();
      if (input.deliveryAddress) updates.delivery_address = input.deliveryAddress.trim();
      if (input.deliveryCity) updates.delivery_city = input.deliveryCity.trim();
      if (input.deliveryState) updates.delivery_state = input.deliveryState.trim();
      if (input.deliveryNotes !== undefined) updates.delivery_notes = input.deliveryNotes;
      if (input.cancellationReason !== undefined) updates.cancellation_reason = input.cancellationReason;
      if (input.adminNotes !== undefined) updates.admin_notes = input.adminNotes;

      const { error: updateErr } = await supabaseServerClient
        .from("orders")
        .update(updates)
        .eq("order_ref", normalizedRef);

      if (updateErr) {
        console.error("Supabase order status update error:", updateErr);
        if (process.env.REQUIRE_DB === "true" || process.env.NODE_ENV === "production") {
          throw new Error(`Database order status update failed: ${updateErr.message}`);
        }
      }
    } catch (err: any) {
      if (process.env.REQUIRE_DB === "true" || process.env.NODE_ENV === "production") {
        throw err;
      }
    }
  }

  // Update in memory
  const found = inMemoryOrders.find(
    (o) => o.orderRef.toUpperCase() === normalizedRef
  );
  if (found) {
    if (input.orderStatus) found.orderStatus = input.orderStatus;
    if (input.paymentStatus) found.paymentStatus = input.paymentStatus;
    if (input.customerName) found.customerName = input.customerName.trim();
    if (input.customerEmail) found.customerEmail = input.customerEmail.trim();
    if (input.customerPhone) found.customerPhone = input.customerPhone.trim();
    if (input.deliveryAddress) found.deliveryAddress = input.deliveryAddress.trim();
    if (input.deliveryCity) found.deliveryCity = input.deliveryCity.trim();
    if (input.deliveryState) found.deliveryState = input.deliveryState.trim();
    if (input.deliveryNotes !== undefined) found.deliveryNotes = input.deliveryNotes;
    if (input.cancellationReason !== undefined) found.cancellationReason = input.cancellationReason;
    if (input.adminNotes !== undefined) found.adminNotes = input.adminNotes;
    if (input.items) found.items = input.items;
    found.updatedAt = now;
    return found;
  }
  return null;
}

export async function cancelOrder(
  orderRef: string,
  reason: string = "Cancelled by Administrator"
): Promise<Order | null> {
  return updateOrder({
    orderRef,
    orderStatus: "Cancelled",
    cancellationReason: reason,
  });
}

export async function deleteOrder(orderRef: string): Promise<boolean> {
  const normalizedRef = orderRef.trim().toUpperCase().replace(/^#/, "");

  if (supabaseServerClient) {
    try {
      const { error: deleteErr } = await supabaseServerClient
        .from("orders")
        .delete()
        .eq("order_ref", normalizedRef);

      if (deleteErr) {
        console.error("Supabase order deletion error:", deleteErr);
        if (process.env.REQUIRE_DB === "true" || process.env.NODE_ENV === "production") {
          throw new Error(`Database order deletion failed: ${deleteErr.message}`);
        }
      }
    } catch (err: any) {
      if (process.env.REQUIRE_DB === "true" || process.env.NODE_ENV === "production") {
        throw err;
      }
    }
  }

  const idx = inMemoryOrders.findIndex(
    (o) => o.orderRef.toUpperCase() === normalizedRef
  );
  if (idx !== -1) {
    inMemoryOrders.splice(idx, 1);
    return true;
  }
  return false;
}

export async function listOrders(filters?: {
  status?: string;
  search?: string;
  limit?: number;
}): Promise<Order[]> {
  if (supabaseServerClient) {
    try {
      let query = supabaseServerClient
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });

      if (filters?.status && filters.status !== "All") {
        query = query.eq("order_status", filters.status);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data } = await query;
      if (data && data.length > 0) {
        return data.map((dbOrder) => ({
          id: dbOrder.id,
          orderRef: dbOrder.order_ref,
          customerName: dbOrder.customer_name,
          customerEmail: dbOrder.customer_email,
          customerPhone: dbOrder.customer_phone,
          deliveryAddress: dbOrder.delivery_address,
          deliveryCity: dbOrder.delivery_city,
          deliveryState: dbOrder.delivery_state,
          deliveryNotes: dbOrder.delivery_notes,
          subtotal: Number(dbOrder.subtotal),
          deliveryFee: Number(dbOrder.delivery_fee),
          total: Number(dbOrder.total),
          currency: dbOrder.currency || "NGN",
          paymentMethod: dbOrder.payment_method,
          paymentStatus: dbOrder.payment_status,
          orderStatus: dbOrder.order_status,
          paystackReference: dbOrder.paystack_reference,
          createdAt: dbOrder.created_at,
          updatedAt: dbOrder.updated_at,
          items: (dbOrder.order_items || []).map((i: any) => ({
            productId: i.product_id,
            name: i.name,
            price: Number(i.price),
            quantity: i.quantity,
            customization: i.customization,
          })),
        }));
      }
    } catch {}
  }

  // Memory fallback
  let list = [...inMemoryOrders];
  if (filters?.status && filters.status !== "All") {
    list = list.filter((o) => o.orderStatus === filters.status);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (o) =>
        o.orderRef.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q)
    );
  }
  if (filters?.limit) {
    list = list.slice(0, filters.limit);
  }
  return list;
}

// ============================================================================
// CONTACT MESSAGES
// ============================================================================

export async function saveContactMessage(input: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<ContactMessage> {
  const newMsg: ContactMessage = {
    id: `msg_${Date.now()}`,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim(),
    subject: input.subject.trim(),
    message: input.message.trim(),
    status: "unread",
    createdAt: new Date().toISOString(),
  };

  if (supabaseServerClient) {
    try {
      await supabaseServerClient.from("contact_messages").insert({
        name: newMsg.name,
        email: newMsg.email,
        phone: newMsg.phone,
        subject: newMsg.subject,
        message: newMsg.message,
        status: newMsg.status,
      });
    } catch {}
  }

  inMemoryMessages.unshift(newMsg);
  return newMsg;
}

// ============================================================================
// CUSTOMIZATION UPLOADS
// ============================================================================

export async function saveCustomizationUpload(input: {
  orderRef?: string;
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  fileType?: string;
}): Promise<CustomizationUpload> {
  const newUpload: CustomizationUpload = {
    id: `up_${Date.now()}`,
    orderRef: input.orderRef,
    fileUrl: input.fileUrl,
    fileName: input.fileName,
    fileSize: input.fileSize,
    fileType: input.fileType,
    createdAt: new Date().toISOString(),
  };

  if (supabaseServerClient) {
    try {
      await supabaseServerClient.from("customization_uploads").insert({
        order_ref: newUpload.orderRef,
        file_url: newUpload.fileUrl,
        file_name: newUpload.fileName,
        file_size: newUpload.fileSize,
        file_type: newUpload.fileType,
      });
    } catch {}
  }

  inMemoryUploads.unshift(newUpload);
  return newUpload;
}

// ============================================================================
// DB MAPPER HELPER
// ============================================================================

function mapDbProductToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : undefined,
    primaryImage: row.primary_image || undefined,
    images: Array.isArray(row.images) ? row.images : [],
    description: row.description || "",
    shortDescription: row.short_description || "",
    category: row.category || "",
    categorySlug: row.category_slug || "",
    tags: Array.isArray(row.tags) ? row.tags : [],
    inStock: Boolean(row.in_stock),
    stockCount: Number(row.stock_count || 0),
    rating: Number(row.rating || 5.0),
    reviewCount: Number(row.review_count || 0),
    customizable: Boolean(row.customizable),
    customizationOptions: row.customization_options || undefined,
    featured: Boolean(row.featured),
    newArrival: Boolean(row.new_arrival),
    bestSeller: Boolean(row.best_seller),
    specifications: row.specifications || undefined,
    deliveryInfo: row.delivery_info || undefined,
    isSample: Boolean(row.is_sample),
  };
}
