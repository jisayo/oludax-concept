import { NextRequest, NextResponse } from "next/server";
import {
  listOrders,
  updateOrder,
  cancelOrder,
  deleteOrder,
  getOrderByRef,
  OrderStatus,
  PaymentStatus,
} from "@/lib/server/db";

export const dynamic = "force-dynamic";

const VALID_ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Payment Confirmed",
  "Processing",
  "Customization in Progress",
  "Ready for Dispatch",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "All";
    const search = searchParams.get("search") || undefined;
    const limit = searchParams.has("limit")
      ? parseInt(searchParams.get("limit")!, 10)
      : 50;

    const orders = await listOrders({ status, search, limit });

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch orders." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderRef,
      action,
      orderStatus,
      paymentStatus,
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      deliveryCity,
      deliveryState,
      deliveryNotes,
      cancellationReason,
      adminNotes,
      items,
    } = body;

    if (!orderRef) {
      return NextResponse.json(
        { success: false, error: "Order reference is required." },
        { status: 400 }
      );
    }

    if (action === "cancel") {
      const reason = cancellationReason || "Order cancelled by store administrator";
      const cancelled = await cancelOrder(orderRef, reason);
      if (!cancelled) {
        return NextResponse.json(
          { success: false, error: `Order #${orderRef} was not found.` },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        message: `Order #${orderRef} has been cancelled successfully.`,
        order: cancelled,
      });
    }

    if (orderStatus && !VALID_ORDER_STATUSES.includes(orderStatus)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid order status. Allowed: ${VALID_ORDER_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const updated = await updateOrder({
      orderRef,
      orderStatus: orderStatus as OrderStatus | undefined,
      paymentStatus: paymentStatus as PaymentStatus | undefined,
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      deliveryCity,
      deliveryState,
      deliveryNotes,
      cancellationReason,
      adminNotes,
      items,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Order #${orderRef} was not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Order #${orderRef} updated successfully.`,
      order: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update order details." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderRef = searchParams.get("ref");

    if (!orderRef) {
      return NextResponse.json(
        { success: false, error: "Order reference is required." },
        { status: 400 }
      );
    }

    const deleted = await deleteOrder(orderRef);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: `Order #${orderRef} was not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Order #${orderRef} has been permanently deleted.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete order." },
      { status: 500 }
    );
  }
}
