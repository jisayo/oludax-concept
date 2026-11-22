import { NextRequest, NextResponse } from "next/server";
import { saveContactMessage } from "@/lib/server/db";
import {
  getClientIp,
  contactRateLimiter,
  rateLimitExceededResponse,
} from "@/lib/server/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rl = contactRateLimiter.check(clientIp);
    if (!rl.success) {
      return rateLimitExceededResponse(rl.resetMs);
    }

    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Your name is required." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "Please enter your message or inquiry." },
        { status: 400 }
      );
    }

    const saved = await saveContactMessage({
      name,
      email,
      phone,
      subject: subject || "Custom Gift Inquiry",
      message,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Our team has received your inquiry.",
        data: saved,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to submit message." },
      { status: 500 }
    );
  }
}
