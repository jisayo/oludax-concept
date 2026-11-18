import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/server/paystack";
import { updateOrderStatus } from "@/lib/server/db";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    // Check webhook HMAC signature
    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Invalid Paystack webhook signature." },
        { status: 401 }
      );
    }

    const event = JSON.parse(rawBody);

    // Handle charge.success
    if (event.event === "charge.success") {
      const data = event.data;
      const reference = data.reference;
      const orderRef = data.metadata?.orderRef || reference;

      if (orderRef) {
        await updateOrderStatus(
          orderRef,
          "Payment Confirmed",
          "paid",
          reference
        );
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return NextResponse.json(
      { error: "Webhook error", message: err.message },
      { status: 500 }
    );
  }
}
