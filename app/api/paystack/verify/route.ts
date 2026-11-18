import { NextRequest, NextResponse } from "next/server";
import { verifyPaystackPayment } from "@/lib/server/paystack";
import { updateOrderStatus, getOrderByRef } from "@/lib/server/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference") || searchParams.get("ref");

    if (!reference) {
      return NextResponse.json(
        { success: false, error: "Payment reference is required." },
        { status: 400 }
      );
    }

    const verification = await verifyPaystackPayment(reference);

    if (verification.status && verification.data?.status === "success") {
      // Find and update the order
      const order = await updateOrderStatus(
        reference,
        "Payment Confirmed",
        "paid",
        reference
      );

      return NextResponse.json({
        success: true,
        verified: true,
        message: "Payment successfully verified.",
        order,
        data: verification.data,
      });
    }

    return NextResponse.json(
      {
        success: false,
        verified: false,
        message: verification.message || "Payment verification incomplete or failed.",
      },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("Paystack verification error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Verification processing error." },
      { status: 500 }
    );
  }
}
