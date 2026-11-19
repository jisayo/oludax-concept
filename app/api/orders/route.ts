import { NextRequest, NextResponse } from "next/server";
import { createOrder, listOrders, CreateOrderInput } from "@/lib/server/db";
import { products, extractPriceFromVariant } from "@/lib/products";
import { verifyAdminRequest } from "@/lib/server/admin-auth";

export const dynamic = "force-dynamic";

const FREE_SHIPPING_THRESHOLD = 50000; // ₦50,000 threshold for free delivery
const STANDARD_DELIVERY_FEE = 3500; // ₦3,500 standard delivery

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      deliveryCity,
      deliveryState,
      deliveryNotes,
      items,
      paymentMethod = "paystack",
    } = body;

    // Field Validations
    if (!customerName || typeof customerName !== "string" || !customerName.trim()) {
      return NextResponse.json(
        { success: false, error: "Recipient / customer name is required." },
        { status: 400 }
      );
    }

    if (
      !customerEmail ||
      typeof customerEmail !== "string" ||
      !customerEmail.includes("@")
    ) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!customerPhone || typeof customerPhone !== "string" || !customerPhone.trim()) {
      return NextResponse.json(
        { success: false, error: "Phone number is required for courier dispatch." },
        { status: 400 }
      );
    }

    if (
      !deliveryAddress ||
      typeof deliveryAddress !== "string" ||
      !deliveryAddress.trim()
    ) {
      return NextResponse.json(
        { success: false, error: "Street delivery address is required." },
        { status: 400 }
      );
    }

    if (!deliveryCity || typeof deliveryCity !== "string" || !deliveryCity.trim()) {
      return NextResponse.json(
        { success: false, error: "Delivery city/town is required." },
        { status: 400 }
      );
    }

    if (!deliveryState || typeof deliveryState !== "string" || !deliveryState.trim()) {
      return NextResponse.json(
        { success: false, error: "Delivery state is required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Order must contain at least one item." },
        { status: 400 }
      );
    }

    // Server-enforced price and inventory validation (Customer cannot dictate prices)
    let computedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const rawQty = parseInt(item.quantity || item.qty || 1, 10);
      if (isNaN(rawQty) || rawQty <= 0) {
        return NextResponse.json(
          { success: false, error: `Invalid quantity for item "${item.name || 'unnamed'}".` },
          { status: 400 }
        );
      }
      const quantity = Math.min(100, Math.max(1, rawQty));

      // Match genuine product in official catalog
      const matchedProduct =
        products.find((p) => p.id === (item.productId || item.id)) ||
        products.find(
          (p) =>
            p.name.toLowerCase().trim() ===
            (item.name || "").toLowerCase().trim()
        );

      if (!matchedProduct) {
        return NextResponse.json(
          {
            success: false,
            error: `Unrecognized product "${item.name || item.productId}". Only verified items can be ordered.`,
          },
          { status: 400 }
        );
      }

      // Check stock availability & quantity limits
      if (matchedProduct.inStock === false || (matchedProduct.stockCount !== undefined && matchedProduct.stockCount <= 0)) {
        return NextResponse.json(
          {
            success: false,
            error: `"${matchedProduct.name}" is currently out of stock.`,
          },
          { status: 400 }
        );
      }

      if (
        matchedProduct.stockCount !== undefined &&
        matchedProduct.stockCount < quantity
      ) {
        return NextResponse.json(
          {
            success: false,
            error: `Only ${matchedProduct.stockCount} units available for "${matchedProduct.name}". Requested: ${quantity}.`,
          },
          { status: 400 }
        );
      }

      // Calculate authoritative server price (including design variants)
      let verifiedUnitPrice = matchedProduct.price;
      if (item.customization?.designPreference) {
        verifiedUnitPrice = extractPriceFromVariant(
          item.customization.designPreference,
          matchedProduct.price
        );
      }

      computedSubtotal += verifiedUnitPrice * quantity;

      validatedItems.push({
        productId: matchedProduct.id,
        name: matchedProduct.name,
        price: verifiedUnitPrice,
        quantity,
        customization: item.customization || undefined,
      });
    }

    // Determine delivery fee (free nationwide shipping over ₦50,000)
    const deliveryFee =
      computedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
    const total = computedSubtotal + deliveryFee;

    const orderInput: CreateOrderInput = {
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      customerPhone: customerPhone.trim(),
      deliveryAddress: deliveryAddress.trim(),
      deliveryCity: deliveryCity.trim(),
      deliveryState: deliveryState.trim(),
      deliveryNotes: deliveryNotes?.trim() || undefined,
      items: validatedItems,
      subtotal: computedSubtotal,
      deliveryFee,
      total,
      paymentMethod,
    };

    const order = await createOrder(orderInput);

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        order,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Order creation error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process order." },
      { status: 500 }
    );
  }
}

/**
 * Restricted order listing: Requires staff authorization
 */
export async function GET(request: NextRequest) {
  const auth = verifyAdminRequest(request);
  if (!auth.authorized) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized: Administrative privileges required to list all orders.",
      },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const limit = searchParams.has("limit")
      ? parseInt(searchParams.get("limit")!, 10)
      : 50;

    const orders = await listOrders({ search, limit });

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to retrieve orders." },
      { status: 500 }
    );
  }
}
