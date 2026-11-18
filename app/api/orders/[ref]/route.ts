import { NextRequest, NextResponse } from "next/server";
import { getOrderByRef } from "@/lib/server/db";

export async function GET(
  _request: NextRequest,
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

    // Dynamic timeline milestones computed from order status
    const milestones = getTrackingMilestones(order);

    return NextResponse.json({
      success: true,
      order,
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
