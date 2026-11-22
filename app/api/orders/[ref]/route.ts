import { NextRequest, NextResponse } from "next/server";
import { getOrderByRef } from "@/lib/server/db";
import { verifyAdminRequest } from "@/lib/server/admin-auth";
import {
  getClientIp,
  trackingRateLimiter,
  rateLimitExceededResponse,
} from "@/lib/server/rate-limit";

function maskEmail(email?: string | null): string {
  if (!email || typeof email !== "string" || !email.includes("@")) return "***";
  const [user, domain] = email.split("@");
  if (!domain) return "***";
  if (user.length <= 2) return `${user[0]}***@${domain}`;
  return `${user[0]}***${user[user.length - 1]}@${domain}`;
}

function maskPhone(phone?: string | null): string {
  if (!phone || typeof phone !== "string") return "***";
  const clean = phone.trim();
  if (clean.length < 7) return "***";
  return `${clean.slice(0, 4)} *** ${clean.slice(-4)}`;
}

function maskName(name?: string | null): string {
  if (!name || typeof name !== "string") return "Customer";
  const parts = name.trim().split(" ");
  if (parts.length <= 1) return parts[0] || "Customer";
  return `${parts[0]} ${parts[1]?.[0] || ""}.`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { ref: string } }
) {
  try {
    const clientIp = getClientIp(request);
    const rl = trackingRateLimiter.check(clientIp);
    if (!rl.success) {
      return rateLimitExceededResponse(rl.resetMs);
    }

    const { ref } = params;
    if (!ref) {
      return NextResponse.json(
        { success: false, error: "Order reference is required." },
        { status: 400 }
      );
    }

    const order = await getOrderByRef(ref);
    if (!order) {
      return NextResponse.json(
        { success: false, error: `Order #${ref} could not be found.` },
        { status: 404 }
      );
    }

    // Verify ownership via query params (email or phone) or admin session
    const { searchParams } = new URL(request.url);
    const providedEmail = searchParams.get("email")?.trim().toLowerCase();
    const providedPhone = searchParams.get("phone")?.trim();
    const isAdmin = verifyAdminRequest(request).authorized;

    const isVerifiedOwner =
      isAdmin ||
      (providedEmail && providedEmail === order.customerEmail.toLowerCase()) ||
      (providedPhone &&
        providedPhone.replace(/\D/g, "") ===
          order.customerPhone.replace(/\D/g, ""));

    // Dynamic timeline milestones computed from order status
    const milestones = getTrackingMilestones(order);

    // If verified owner or admin, return full order details
    if (isVerifiedOwner) {
      return NextResponse.json({
        success: true,
        verified: true,
        order,
        milestones,
      });
    }

    // Strict privacy model: unverified tracking returns non-sensitive status & progress only
    const publicSafeOrder = {
      id: order.id,
      orderRef: order.orderRef,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      customerName: maskName(order.customerName),
      customerEmail: maskEmail(order.customerEmail),
      customerPhone: maskPhone(order.customerPhone),
      deliveryCity: order.deliveryCity,
      deliveryState: order.deliveryState,
      deliveryAddress: `${order.deliveryCity}, ${order.deliveryState} (Specific street hidden for privacy)`,
      // Sanitize items: hide personal love notes / custom inscription text from unverified viewers
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
      })),
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      total: order.total,
      currency: order.currency,
    };

    return NextResponse.json({
      success: true,
      verified: false,
      order: publicSafeOrder,
      milestones,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch order details." },
      { status: 500 }
    );
  }
}

function getTrackingMilestones(order: any) {
  const status = order.orderStatus;
  const isPaid = order.paymentStatus === "paid";

  const allStages = [
    {
      key: "payment",
      title: "Order Placed & Payment Confirmed",
      desc: isPaid
        ? `Payment verified via ${order.paymentMethod?.toUpperCase() || 'OFFICIAL'}. Order sent to production queue.`
        : "Awaiting payment confirmation.",
      time: formatDate(order.createdAt),
      isCompleted: isPaid || status !== "Pending",
      isCurrent: status === "Pending" && !isPaid,
    },
    {
      key: "processing",
      title: "Artisanal Production & Customization",
      desc:
        status === "Customization in Progress"
          ? "Our artisans are currently engraving, printing, and assembling your bespoke pieces."
          : "Personalization queue scheduled.",
      time: status !== "Pending" ? "In Studio" : "Pending",
      isCompleted: [
        "Processing",
        "Customization in Progress",
        "Ready for Dispatch",
        "Shipped",
        "Delivered",
      ].includes(status),
      isCurrent:
        status === "Processing" || status === "Customization in Progress",
    },
    {
      key: "quality_dispatch",
      title: "Luxury Ribbon Packaging & Courier Handoff",
      desc:
        status === "Ready for Dispatch" || status === "Shipped"
          ? "Package sealed with signature Oludax luxury boxing and handed to our logistics partner."
          : "Quality control inspection upon production completion.",
      time:
        status === "Ready for Dispatch" ||
        status === "Shipped" ||
        status === "Delivered"
          ? "Dispatched"
          : "Awaiting QA",
      isCompleted: ["Ready for Dispatch", "Shipped", "Delivered"].includes(
        status
      ),
      isCurrent: status === "Ready for Dispatch",
    },
    {
      key: "delivery",
      title: "Doorstep Delivery & Celebration Handover",
      desc:
        status === "Delivered"
          ? `Package safely received at destination (${order.deliveryCity}, ${order.deliveryState}). Thank you for choosing Oludax!`
          : `En route to destination (${order.deliveryCity}, ${order.deliveryState}).`,
      time: status === "Delivered" ? "Delivered" : "Estimated 2-4 business days",
      isCompleted: status === "Delivered",
      isCurrent: status === "Shipped",
    },
  ];

  return allStages;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-NG", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Recent";
  }
}
