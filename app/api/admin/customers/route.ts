import { NextRequest, NextResponse } from "next/server";
import { listOrders } from "@/lib/server/db";
import { verifyAdminRequest, hasEffectivePermission } from "@/lib/server/admin-auth";
import {
  isCustomerSuspended,
  setCustomerSuspended,
  logAudit,
} from "@/lib/server/admin-store";

export const dynamic = "force-dynamic";

export type CustomerSummary = {
  email: string;
  name: string;
  phone: string;
  city: string;
  state: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
  suspended: boolean;
};

export async function GET(request: NextRequest) {
  const auth = verifyAdminRequest(request);
  if (!auth.authorized || !auth.user) {
    return NextResponse.json(
      { success: false, error: auth.error || "Administrative authorization required." },
      { status: 401 }
    );
  }

  if (!hasEffectivePermission(auth.user, "view_orders")) {
    return NextResponse.json(
      { success: false, error: "Forbidden: Insufficient permissions to view customers." },
      { status: 403 }
    );
  }

  try {
    const orders = await listOrders({ limit: 500 });
    const map = new Map<string, CustomerSummary>();

    for (const order of orders) {
      const key = (order.customerEmail || "").toLowerCase().trim();
      if (!key) continue;

      const existing = map.get(key);
      if (!existing) {
        map.set(key, {
          email: key,
          name: order.customerName,
          phone: order.customerPhone,
          city: order.deliveryCity,
          state: order.deliveryState,
          orderCount: 1,
          totalSpent: order.orderStatus !== "Cancelled" ? Number(order.total || 0) : 0,
          lastOrderDate: order.createdAt,
          suspended: isCustomerSuspended(key),
        });
      } else {
        existing.orderCount += 1;
        if (order.orderStatus !== "Cancelled") {
          existing.totalSpent += Number(order.total || 0);
        }
        if (order.createdAt > existing.lastOrderDate) {
          existing.lastOrderDate = order.createdAt;
          existing.name = order.customerName || existing.name;
          existing.phone = order.customerPhone || existing.phone;
          existing.city = order.deliveryCity || existing.city;
          existing.state = order.deliveryState || existing.state;
        }
      }
    }

    const customers = Array.from(map.values()).sort((a, b) =>
      b.lastOrderDate.localeCompare(a.lastOrderDate)
    );

    return NextResponse.json({
      success: true,
      customers,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load customers." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const auth = verifyAdminRequest(request);
  if (!auth.authorized || !auth.user) {
    return NextResponse.json(
      { success: false, error: auth.error || "Administrative authorization required." },
      { status: 401 }
    );
  }

  const canManageCustomers =
    auth.user.role === "super_admin" || auth.user.role === "admin";
  if (!canManageCustomers) {
    return NextResponse.json(
      { success: false, error: "Forbidden: Admin privileges required to manage customer accounts." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Customer email is required." },
        { status: 400 }
      );
    }

    const suspended = Boolean(body.suspended);
    setCustomerSuspended(email, suspended);

    logAudit({
      actorEmail: auth.user.email,
      actorRole: auth.user.role,
      action: suspended ? "CUSTOMER_SUSPENDED" : "CUSTOMER_REACTIVATED",
      target: email,
      details: `${suspended ? "Suspended" : "Reactivated"} customer account ${email}.`,
    });

    return NextResponse.json({
      success: true,
      email,
      suspended,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update customer." },
      { status: 500 }
    );
  }
}
