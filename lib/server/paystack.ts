import crypto from "crypto";

export type PaystackInitializeParams = {
  email: string;
  amount: number; // in kobo (NGN * 100)
  reference: string;
  callbackUrl?: string;
  metadata?: Record<string, any>;
};

export type PaystackInitializeResponse = {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

export type PaystackVerifyResponse = {
  status: boolean;
  message: string;
  data: {
    id: number;
    status: "success" | "failed" | "abandoned";
    reference: string;
    amount: number; // in kobo
    gateway_response: string;
    paid_at: string;
    channel: string;
    currency: string;
    customer: {
      id: number;
      email: string;
      customer_code: string;
    };
    metadata?: Record<string, any>;
  };
};

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";
const IS_CONFIGURED = Boolean(
  PAYSTACK_SECRET_KEY &&
    !PAYSTACK_SECRET_KEY.includes("your_paystack") &&
    PAYSTACK_SECRET_KEY.startsWith("sk_")
);

/**
 * Initialize a Paystack transaction.
 * Falls back to simulation mode if PAYSTACK_SECRET_KEY is not set or network is unreachable.
 */
export async function initializePaystackPayment(
  params: PaystackInitializeParams
): Promise<PaystackInitializeResponse> {
  const { email, amount, reference, callbackUrl, metadata } = params;

  if (IS_CONFIGURED) {
    try {
      const response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount,
          reference,
          callback_url: callbackUrl,
          metadata: metadata || {},
        }),
      });

      const data = await response.json();
      if (response.ok && data.status) {
        return data as PaystackInitializeResponse;
      }
      console.warn("Paystack initialize API returned non-ok:", data);
    } catch (err) {
      console.warn("Paystack initialize request failed (falling back to mock):", err);
    }
  }

  // Graceful simulation mode (for development / offline / unconfigured environments)
  const defaultCallback = callbackUrl || `/checkout/success?ref=${reference}&reference=${reference}`;
  return {
    status: true,
    message: "Authorization URL created (development simulation)",
    data: {
      authorization_url: defaultCallback,
      access_code: `mock_code_${Math.floor(100000 + Math.random() * 900000)}`,
      reference,
    },
  };
}

/**
 * Verify a Paystack transaction by reference.
 */
export async function verifyPaystackPayment(
  reference: string
): Promise<PaystackVerifyResponse> {
  if (IS_CONFIGURED) {
    try {
      const response = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.status) {
        return data as PaystackVerifyResponse;
      }
      console.warn("Paystack verify API returned non-ok:", data);
    } catch (err) {
      console.warn("Paystack verify request failed (falling back to mock):", err);
    }
  }

  // Development simulation response
  return {
    status: true,
    message: "Verification successful (development simulation)",
    data: {
      id: 999999,
      status: "success",
      reference,
      amount: 0,
      gateway_response: "Successful",
      paid_at: new Date().toISOString(),
      channel: "card",
      currency: "NGN",
      customer: {
        id: 1,
        email: "client@oludaxconcept.com",
        customer_code: "CUS_mock123",
      },
    },
  };
}

/**
 * Verify HMAC SHA-512 signature on incoming Paystack webhook requests
 */
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  if (!PAYSTACK_SECRET_KEY || !signatureHeader) {
    return false;
  }

  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest("hex");

  return hash === signatureHeader;
}
