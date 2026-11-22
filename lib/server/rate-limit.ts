import { NextRequest, NextResponse } from "next/server";

/**
 * Sliding Window In-Memory Rate Limiter for Next.js API Routes
 * Defends against card testing, brute force, endpoint flooding, and spam.
 */

type RateLimitConfig = {
  windowMs: number; // Time window in milliseconds (e.g. 60_000 for 1 minute)
  max: number; // Max allowed requests per window
};

type ClientRecord = {
  timestamps: number[];
};

export class RateLimiter {
  private clients = new Map<string, ClientRecord>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(private config: RateLimitConfig) {
    // Periodically clean up expired entries every 5 minutes to prevent memory leaks
    if (typeof setInterval !== "undefined") {
      this.cleanupInterval = setInterval(() => {
        const now = Date.now();
        const threshold = now - this.config.windowMs;
        for (const [ip, record] of this.clients.entries()) {
          const fresh = record.timestamps.filter((t) => t > threshold);
          if (fresh.length === 0) {
            this.clients.delete(ip);
          } else {
            record.timestamps = fresh;
          }
        }
      }, 5 * 60 * 1000);

      // Unref timer so it doesn't hold the Node.js event loop open
      if (this.cleanupInterval?.unref) {
        this.cleanupInterval.unref();
      }
    }
  }

  public check(ip: string): {
    success: boolean;
    limit: number;
    remaining: number;
    resetMs: number;
  } {
    const now = Date.now();
    const threshold = now - this.config.windowMs;

    let record = this.clients.get(ip);
    if (!record) {
      record = { timestamps: [] };
      this.clients.set(ip, record);
    }

    // Keep only timestamps within the current sliding window
    record.timestamps = record.timestamps.filter((t) => t > threshold);

    if (record.timestamps.length >= this.config.max) {
      const oldest = record.timestamps[0];
      const resetMs = oldest ? oldest + this.config.windowMs - now : this.config.windowMs;
      return {
        success: false,
        limit: this.config.max,
        remaining: 0,
        resetMs: Math.max(0, resetMs),
      };
    }

    // Record this attempt
    record.timestamps.push(now);

    return {
      success: true,
      limit: this.config.max,
      remaining: this.config.max - record.timestamps.length,
      resetMs: this.config.windowMs,
    };
  }
}

/**
 * Extract real client IP from incoming NextRequest headers
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Standard rate limiter instances tailored to specific route risk levels
 */

// 1. Payment Initialization: High Risk (Card-testing bot defense) - max 10 requests per 5 minutes per IP
export const paymentRateLimiter = new RateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 10,
});

// 2. Contact Message Submissions: Spam defense - max 5 submissions per 10 minutes per IP
export const contactRateLimiter = new RateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 5,
});

// 3. Customization File Uploads: Storage flood defense - max 10 file uploads per 5 minutes per IP
export const uploadRateLimiter = new RateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 10,
});

// 4. Order Creation: max 12 order creations per 10 minutes per IP
export const orderCreationRateLimiter = new RateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 12,
});

// 5. Order Tracking / Reference Lookup: Brute-force scraping defense - max 30 searches per 5 minutes per IP
export const trackingRateLimiter = new RateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 30,
});

/**
 * Helper to emit a standardized HTTP 429 Too Many Requests response
 */
export function rateLimitExceededResponse(resetMs: number) {
  const retryAfterSeconds = Math.ceil(resetMs / 1000);
  return NextResponse.json(
    {
      success: false,
      error: `Too many requests. Please wait ${retryAfterSeconds} seconds before trying again.`,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
      },
    }
  );
}
