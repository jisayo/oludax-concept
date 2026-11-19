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
import { verifyAdminRequest } from "@/lib/server/admin-auth";
import { hasPermission } from "@/lib/rbac";

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
  // Enforce administrative authentication
  const auth = verifyAdminRequest(request);
  if (!auth.authorized || !auth.user) {
    return NextResponse.json(
      { success: false, error: auth.error || "Administrative authorization required." },
      { status: 401 }
    );
  }

  // Enforce role-based permission
  if (!hasPermission(auth.user.role, "view_orders")) {
    return NextResponse.json(
      { success: false, error: "Forbidden: Insufficient permissions to view orders." },
      { status: 403 }
    );
  }

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
  // Enforce administrative authentication
  const auth = verifyAdminRequest(request);
  if (!auth.authorized || !auth.user) {
    return NextResponse.json(
      { success: false, error: auth.error || "Administrative authorization required." },
      { status: 401 }
    );
  }

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

    // Role-based authorization for order cancellation
    if (action === "cancel") {
      if (!hasPermission(auth.user.role, "cancel_order")) {
        return NextResponse.json(
          {
            success: false,
            error: "Forbidden: Your role does not possess permissions to cancel orders.",
          },
          { status: 403 }
        );
      }

      const reason =
        cancellationReason ||
        `Order cancelled by staff (${auth.user.name} - ${auth.user.role})`;
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

    // Role-based authorization for status changes
    if (orderStatus) {
      if (!hasPermission(auth.user.role, "edit_order_status")) {
        return NextResponse.json(
          {
            success: false,
            error: "Forbidden: Your role cannot update order progress statuses.",
          },
          { status: 403 }
        );
      }

      if (!VALID_ORDER_STATUSES.includes(orderStatus)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid order status. Allowed: ${VALID_ORDER_STATUSES.join(", ")}`,
          },
          { status: 400 }
        );
      }
    }

    // Role-based authorization for customer details changes
    const isModifyingDetails = Boolean(
      customerName ||
      customerEmail ||
      customerPhone ||
      deliveryAddress ||
      deliveryCity ||
      deliveryState ||
      deliveryNotes ||
      adminNotes
    );

    if (isModifyingDetails && !hasPermission(auth.user.role, "edit_order_details")) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: Your role cannot edit customer delivery details.",
        },
        { status: 403 }
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
  // Enforce administrative authentication
  const auth = verifyAdminRequest(request);
  if (!auth.authorized || !auth.user) {
    return NextResponse.json(
      { success: false, error: auth.error || "Administrative authorization required." },
      { status: 401 }
    );
  }

  // Strictly enforce delete_order permission (super_admin only)
  if (!hasPermission(auth.user.role, "delete_order")) {
    return NextResponse.json(
      {
        success: false,
        error: "Forbidden: Only Super Administrators can permanently delete order records.",
      },
      { status: 403 }
    );
  }

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
