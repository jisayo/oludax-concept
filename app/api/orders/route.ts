import { NextRequest, NextResponse } from "next/server";
import { createOrder, listOrders, CreateOrderInput } from "@/lib/server/db";

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

    // Calculate subtotal from validated item entries
    let computedSubtotal = 0;
    const validatedItems = items.map((item: any, idx: number) => {
      const quantity = Math.max(1, parseInt(item.quantity || item.qty || 1, 10));
      const price = Math.max(0, parseFloat(item.price || 0));
      computedSubtotal += price * quantity;

      return {
        productId: item.productId || item.id || `item-${idx + 1}`,
        name: item.name || "Bespoke Gift Item",
        price,
        quantity,
        customization: item.customization || undefined,
      };
    });

    // Determine delivery fee (free nationwide shipping over ₦50,000)
    const deliveryFee =
      computedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
    const total = computedSubtotal + deliveryFee;

    const orderInput: CreateOrderInput = {
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      deliveryCity,
      deliveryState,
      deliveryNotes,
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const search = searchParams.get("search") || email || undefined;
    const limit = searchParams.has("limit")
      ? parseInt(searchParams.get("limit")!, 10)
      : 20;

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
