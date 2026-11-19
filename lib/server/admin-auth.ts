import { NextRequest } from "next/server";
import crypto from "crypto";
import { Role } from "../rbac";

// Environment-configured admin credentials
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@oludaxconcept.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Oludax@Concept2026!";
const ADMIN_SECRET =
  process.env.ADMIN_SECRET_TOKEN ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "oludax-production-sec-token-98f24a18c642b9";

// Rate limiting in-memory tracker (IP -> { count, lastAttempt })
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_PERIOD_MS = 15 * 60 * 1000; // 15 minutes

export type AdminAuthPayload = {
  email: string;
  role: Role;
  name: string;
  expiresAt: number;
};

/**
 * Constant-time string comparison to defend against timing attacks
 */
function safeCompare(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Constant time dummy compare
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Generate a cryptographically signed authentication token
 */
export function createAdminToken(email: string, role: Role, name: string): string {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const data = JSON.stringify({ email, role, name, expiresAt });
  const encodedData = Buffer.from(data).toString("base64url");
  const signature = crypto
    .createHmac("sha256", ADMIN_SECRET)
    .update(encodedData)
    .digest("base64url");

  return `${encodedData}.${signature}`;
}

/**
 * Verify and decode an admin token
 */
export function verifyAdminToken(token: string | null | undefined): AdminAuthPayload | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encodedData, signature] = parts;
  const expectedSig = crypto
    .createHmac("sha256", ADMIN_SECRET)
    .update(encodedData)
    .digest("base64url");

  if (!safeCompare(signature, expectedSig)) {
    return null;
  }

  try {
    const raw = Buffer.from(encodedData, "base64url").toString("utf-8");
    const payload: AdminAuthPayload = JSON.parse(raw);
    if (payload.expiresAt < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Authenticate incoming HTTP request to admin APIs
 */
export function verifyAdminRequest(request: NextRequest): {
  authorized: boolean;
  user?: AdminAuthPayload;
  error?: string;
} {
  // 1. Check Authorization Bearer header
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    const payload = verifyAdminToken(token);
    if (payload) return { authorized: true, user: payload };
  }

  // 2. Check custom x-admin-token header
  const customHeader = request.headers.get("x-admin-token");
  if (customHeader) {
    const payload = verifyAdminToken(customHeader);
    if (payload) return { authorized: true, user: payload };
  }

  // 3. Check HttpOnly cookie
  const cookie = request.cookies.get("oludax_admin_token")?.value;
  if (cookie) {
    const payload = verifyAdminToken(cookie);
    if (payload) return { authorized: true, user: payload };
  }

  return { authorized: false, error: "Unauthorized: Staff credentials required." };
}

/**
 * Validate administrator login credentials with brute-force protection
 */
export async function authenticateAdminUser(
  clientIp: string,
  email: string,
  password: string
): Promise<{ success: boolean; token?: string; user?: any; error?: string }> {
  // Rate-limiting check
  const now = Date.now();
  const attempt = loginAttempts.get(clientIp);
  if (attempt && attempt.count >= MAX_ATTEMPTS) {
    const remainingMs = attempt.lastAttempt + LOCKOUT_PERIOD_MS - now;
    if (remainingMs > 0) {
      const minutes = Math.ceil(remainingMs / 60000);
      return {
        success: false,
        error: `Too many failed attempts. Try again in ${minutes} minutes.`,
      };
    } else {
      loginAttempts.delete(clientIp);
    }
  }

  let role: Role | null = null;
  let name = "";

  // Check configured admin credentials
  if (
    safeCompare(email.toLowerCase().trim(), ADMIN_EMAIL.toLowerCase().trim()) &&
    safeCompare(password, ADMIN_PASSWORD)
  ) {
    role = "super_admin";
    name = "Precious Oluwatofunmi";
  } else if (
    safeCompare(email.toLowerCase().trim(), (process.env.MANAGER_EMAIL || "manager@oludaxconcept.com").toLowerCase().trim()) &&
    safeCompare(password, process.env.MANAGER_PASSWORD || ADMIN_PASSWORD)
  ) {
    role = "manager";
    name = "Operations Manager";
  } else if (
    safeCompare(email.toLowerCase().trim(), (process.env.ARTISAN_EMAIL || "artisan@oludaxconcept.com").toLowerCase().trim()) &&
    safeCompare(password, process.env.ARTISAN_PASSWORD || ADMIN_PASSWORD)
  ) {
    role = "artisan";
    name = "Bespoke Artisan Lead";
  } else if (
    safeCompare(email.toLowerCase().trim(), (process.env.SUPPORT_EMAIL || "support@oludaxconcept.com").toLowerCase().trim()) &&
    safeCompare(password, process.env.SUPPORT_PASSWORD || ADMIN_PASSWORD)
  ) {
    role = "support";
    name = "Support Officer";
  }

  if (!role) {
    // Record failed attempt
    const current = loginAttempts.get(clientIp) || { count: 0, lastAttempt: now };
    loginAttempts.set(clientIp, { count: current.count + 1, lastAttempt: now });

    // Artificial delay to prevent brute-force timing enumeration
    await new Promise((res) => setTimeout(res, 500));

    return {
      success: false,
      error: "Invalid administrative credentials.",
    };
  }

  // Reset rate limiting on successful login
  loginAttempts.delete(clientIp);

  const token = createAdminToken(email, role, name);

  return {
    success: true,
    token,
    user: {
      id: `staff-${role}`,
      email,
      name,
      role,
    },
  };
}
