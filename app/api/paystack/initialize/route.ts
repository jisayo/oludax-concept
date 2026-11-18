import { NextRequest, NextResponse } from "next/server";
import { initializePaystackPayment } from "@/lib/server/paystack";
import { getOrderByRef } from "@/lib/server/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderRef, email, amount, callbackUrl } = body;

    if (!orderRef || !email) {
      return NextResponse.json(
        { success: false, error: "Order reference and customer email are required." },
        { status: 400 }
      );
    }

    // Verify order exists if orderRef is provided
    let calculatedAmount = amount;
    const existingOrder = await getOrderByRef(orderRef);
    if (existingOrder) {
      calculatedAmount = existingOrder.total;
    }

    if (!calculatedAmount || calculatedAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid payment amount." },
        { status: 400 }
      );
    }

    // Paystack takes amount in KOBO (1 NGN = 100 Kobo)
    const amountInKobo = Math.round(calculatedAmount * 100);
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const fallbackCallback = `${protocol}://${host}/checkout/success?ref=${orderRef}`;

    const paystackResult = await initializePaystackPayment({
      email,
      amount: amountInKobo,
      reference: orderRef,
      callbackUrl: callbackUrl || fallbackCallback,
      metadata: {
        orderRef,
        customerEmail: email,
      },
    });

    if (!paystackResult.status) {
      return NextResponse.json(
        { success: false, error: paystackResult.message || "Failed to initialize payment gateway." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      authorizationUrl: paystackResult.data.authorization_url,
      reference: paystackResult.data.reference,
      accessCode: paystackResult.data.access_code,
    });
  } catch (err: any) {
    console.error("Paystack init error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal payment initialization error." },
      { status: 500 }
    );
  }
}
