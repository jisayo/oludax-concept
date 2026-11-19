import { NextRequest, NextResponse } from "next/server";
import { getOrderByRef } from "@/lib/server/db";
import { verifyAdminRequest } from "@/lib/server/admin-auth";

function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!domain) return "***";
  if (user.length <= 2) return `${user[0]}***@${domain}`;
  return `${user[0]}***${user[user.length - 1]}@${domain}`;
}

function maskPhone(phone: string): string {
  const clean = phone.trim();
  if (clean.length < 7) return "***";
  return `${clean.slice(0, 4)} *** ${clean.slice(-4)}`;
}

function maskName(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1][0]}.`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { ref: string } }
) {
  try {
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

    // If not verified, mask customer PII to prevent data harvesting
    const sanitizedOrder = isVerifiedOwner
      ? order
      : {
          ...order,
          customerName: maskName(order.customerName),
          customerEmail: maskEmail(order.customerEmail),
          customerPhone: maskPhone(order.customerPhone),
          deliveryAddress: `${order.deliveryCity}, ${order.deliveryState} (Specific street hidden for customer privacy)`,
        };

    // Dynamic timeline milestones computed from order status
    const milestones = getTrackingMilestones(order);

    return NextResponse.json({
      success: true,
      verified: Boolean(isVerifiedOwner),
      order: sanitizedOrder,
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
        ? `Payment verified via ${order.paymentMethod.toUpperCase()}. Order sent to production queue.`
        : "Awaiting payment confirmation.",
      time: formatDate(order.createdAt),
      isCompleted: isPaid || status !== "Pending",
      isCurrent: status === "Pending" && !isPaid,
    },
    {
      key: "customization",
      title: "Artisan Customization & Proof Review",
      desc: "Personalization text verified, artwork inspected, and heat-pressed/embroidered by artisans in Lagos.",
      time: order.updatedAt ? formatDate(order.updatedAt) : "In progress",
      isCompleted: [
        "Processing",
        "Ready for Dispatch",
        "Shipped",
        "Delivered",
      ].includes(status),
      isCurrent:
        status === "Customization in Progress" ||
        (isPaid && status === "Payment Confirmed"),
    },
    {
      key: "packaging",
      title: "Quality Inspection & Luxury Ribbon Packaging",
      desc: "Carefully wrapped with satin ribbon, protective padding, and custom gift card attached.",
      time: "Scheduled prior to dispatch",
      isCompleted: ["Ready for Dispatch", "Shipped", "Delivered"].includes(status),
      isCurrent: status === "Processing",
    },
    {
      key: "transit",
      title: "Handed to Courier for Doorstep Transit",
      desc: `Dispatched for delivery to ${order.deliveryCity}, ${order.deliveryState}.`,
      time: "Expected 1-2 business days",
      isCompleted: ["Shipped", "Delivered"].includes(status),
      isCurrent: status === "Ready for Dispatch" || status === "Shipped",
    },
    {
      key: "delivered",
      title: "Delivered to Recipient",
      desc: "Package safely handed to the celebrant/recipient at destination.",
      time: status === "Delivered" ? "Delivered successfully" : "Pending transit",
      isCompleted: status === "Delivered",
      isCurrent: false,
    },
  ];

  return allStages;
}

function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-NG", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}
