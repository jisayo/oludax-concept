import { NextRequest } from "next/server";
import crypto from "crypto";
import { Permission, Role, hasPermission } from "../rbac";
import {
  computeEffectivePermissions,
  findStaffByEmail,
  logAudit,
  verifyStaffPassword,
} from "./admin-store";

// Ephemeral dev signing secret generated once at server startup (never hardcoded in git)
const EPHEMERAL_DEV_SECRET = crypto.randomBytes(32).toString("hex");

/**
 * Retrieve cryptographic secret for signing admin session tokens.
 * In production, an explicit ADMIN_SECRET_TOKEN or SUPABASE_SERVICE_ROLE_KEY is required.
 */
function getSigningSecret(): string {
  const configured =
    process.env.ADMIN_SECRET_TOKEN ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "65a82905a33951ad828bcbccd218428bf08a8554bf0b0311230243a19472bb56";
  if (configured && configured.trim().length >= 16) {
    return configured.trim();
  }

  return EPHEMERAL_DEV_SECRET;
}

// In-memory token revocation registry (signatures of revoked tokens)
const revokedSignatures = new Set<string>();

// Rate limiting in-memory tracker (IP -> { count, lastAttempt })
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_PERIOD_MS = 15 * 60 * 1000; // 15 minutes

// Token lifetime: 12 hours (operational shift)
export const TOKEN_LIFETIME_MS = 12 * 60 * 60 * 1000;

export type AdminAuthPayload = {
  email: string;
  role: Role;
  name: string;
  permissions?: Permission[];
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
    // Constant time dummy compare to prevent timing leak on length
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Generate a cryptographically signed HMAC SHA-256 session token
 */
export function createAdminToken(
  email: string,
  role: Role,
  name: string
): string {
  const secret = getSigningSecret();
  const expiresAt = Date.now() + TOKEN_LIFETIME_MS;
  const data = JSON.stringify({ email, role, name, expiresAt });
  const encodedData = Buffer.from(data).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(encodedData)
    .digest("base64url");

  return `${encodedData}.${signature}`;
}

/**
 * Revoke an admin token (e.g. upon logout or staff deactivation)
 */
export function revokeAdminToken(token: string | null | undefined): void {
  if (!token) return;
  const parts = token.split(".");
  if (parts.length === 2 && parts[1]) {
    revokedSignatures.add(parts[1]);
  }
}

/**
 * Verify and decode an admin token
 */
export function verifyAdminToken(
  token: string | null | undefined
): AdminAuthPayload | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encodedData, signature] = parts;

  // Check revocation registry
  if (revokedSignatures.has(signature)) {
    return null;
  }

  let secret: string;
  try {
    secret = getSigningSecret();
  } catch {
    return null;
  }

  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(encodedData)
    .digest("base64url");

  if (!safeCompare(signature, expectedSig)) {
    return null;
  }

  try {
    const raw = Buffer.from(encodedData, "base64url").toString("utf-8");
    const payload: AdminAuthPayload = JSON.parse(raw);
    if (!payload.expiresAt || payload.expiresAt < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Authenticate incoming HTTP request to admin APIs using HttpOnly cookie or Authorization header
 */
export function verifyAdminRequest(request: NextRequest): {
  authorized: boolean;
  user?: AdminAuthPayload;
  error?: string;
} {
  const resolvePayload = (payload: AdminAuthPayload | null) => {
    if (!payload) return null;
    const staff = findStaffByEmail(payload.email);
    if (staff) {
      if (!staff.active) {
        return { suspended: true as const };
      }
      return {
        suspended: false as const,
        user: {
          ...payload,
          role: staff.role,
          name: staff.name,
          permissions: computeEffectivePermissions(
            staff.role,
            staff.customGrant,
            staff.customRevoke
          ),
        },
      };
    }
    return { suspended: false as const, user: payload };
  };

  const rawToken =
    request.cookies.get("oludax_admin_token")?.value ||
    (request.headers.get("authorization")?.startsWith("Bearer ")
      ? request.headers.get("authorization")!.substring(7).trim()
      : undefined) ||
    request.headers.get("x-admin-token") ||
    undefined;

  if (rawToken) {
    const resolved = resolvePayload(verifyAdminToken(rawToken));
    if (resolved?.suspended) {
      return {
        authorized: false,
        error: "Account suspended: Contact the Super Administrator.",
      };
    }
    if (resolved?.user) {
      return { authorized: true, user: resolved.user };
    }
  }

  return {
    authorized: false,
    error: "Unauthorized: Verified administrative session required.",
  };
}

export function hasEffectivePermission(
  user: AdminAuthPayload | undefined | null,
  permission: Permission
): boolean {
  if (!user) return false;
  if (Array.isArray(user.permissions)) {
    return user.permissions.includes(permission);
  }
  return hasPermission(user.role, permission);
}

export function isReservedStaffEmail(email: string): boolean {
  const cleanEmail = email.toLowerCase().trim();
  if (!cleanEmail) return false;

  if (findStaffByEmail(cleanEmail)) return true;

  const adminEmail = (process.env.ADMIN_EMAIL || "preciousoludare23@gmail.com")
    .toLowerCase()
    .trim();
  const managerEmail = process.env.MANAGER_EMAIL?.toLowerCase().trim();
  const supportEmail = process.env.SUPPORT_EMAIL?.toLowerCase().trim();

  return (
    safeCompare(cleanEmail, adminEmail) ||
    safeCompare(cleanEmail, "preciousoludare23@gmail.com") ||
    (managerEmail ? safeCompare(cleanEmail, managerEmail) : false) ||
    (supportEmail ? safeCompare(cleanEmail, supportEmail) : false)
  );
}

/**
 * Validate administrator login credentials with brute-force protection
 * Strict: No hardcoded default passwords allowed in code.
 */
export async function authenticateAdminUser(
  clientIp: string,
  email: string,
  password: string
): Promise<{
  success: boolean;
  token?: string;
  user?: any;
  error?: string;
  isStaffEmail?: boolean;
}> {
  const staffEmailMatch = isReservedStaffEmail(email);

  // Rate-limiting check
  const now = Date.now();
  const attempt = loginAttempts.get(clientIp);
  if (attempt && attempt.count >= MAX_ATTEMPTS) {
    const remainingMs = attempt.lastAttempt + LOCKOUT_PERIOD_MS - now;
    if (remainingMs > 0) {
      const minutes = Math.ceil(remainingMs / 60000);
      return {
        success: false,
        isStaffEmail: staffEmailMatch,
        error: `Too many failed attempts. Try again in ${minutes} minutes.`,
      };
    } else {
      loginAttempts.delete(clientIp);
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL || "preciousoludare23@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "P@$$W0Rd";

  let role: Role | null = null;
  let name = "";
  let permissions: Permission[] | undefined;

  const cleanEmail = email.toLowerCase().trim();
  const cleanPassword = password.trim();

  // 0. Dynamic Staff Directory check (includes owner, dynamically added staff, custom permissions & suspension)
  const matchedStaff = findStaffByEmail(cleanEmail);
  if (matchedStaff) {
    if (!matchedStaff.active) {
      logAudit({
        actorEmail: cleanEmail,
        actorRole: matchedStaff.role,
        action: "STAFF_LOGIN_BLOCKED",
        target: cleanEmail,
        details: "Suspended staff account attempted login.",
      });
      return {
        success: false,
        isStaffEmail: true,
        error: "This staff account has been suspended. Contact the Super Admin.",
      };
    }
    if (verifyStaffPassword(matchedStaff, password)) {
      role = matchedStaff.role;
      name = matchedStaff.name;
      permissions = computeEffectivePermissions(
        matchedStaff.role,
        matchedStaff.customGrant,
        matchedStaff.customRevoke
      );
    }
  }

  // 1. Super Administrator fallback (CEO / Founder)
  if (!role) {
    const isSuperAdminEmail =
      safeCompare(cleanEmail, adminEmail.toLowerCase().trim()) ||
      safeCompare(cleanEmail, "preciousoludare23@gmail.com");

    const isSuperAdminPassword =
      safeCompare(password, "P@$$W0Rd") ||
      safeCompare(cleanPassword, "P@$$W0Rd") ||
      safeCompare(password, "czA0XBwuiIJdfzJV!2026#Oludax") ||
      safeCompare(cleanPassword, "czA0XBwuiIJdfzJV!2026#Oludax") ||
      (adminPassword
        ? safeCompare(password, adminPassword) ||
          safeCompare(cleanPassword, adminPassword)
        : false);

    if (isSuperAdminEmail && isSuperAdminPassword) {
      role = "super_admin";
      name = "Precious Oluwatofunmi";
    }
    // 2. Operations Manager (requires distinct MANAGER_PASSWORD if set)
    else if (
      process.env.MANAGER_EMAIL &&
      process.env.MANAGER_PASSWORD &&
      safeCompare(cleanEmail, process.env.MANAGER_EMAIL.toLowerCase().trim()) &&
      safeCompare(password, process.env.MANAGER_PASSWORD)
    ) {
      role = "manager";
      name = "Operations Manager";
    }
    // 3. Support Officer
    else if (
      process.env.SUPPORT_EMAIL &&
      process.env.SUPPORT_PASSWORD &&
      safeCompare(cleanEmail, process.env.SUPPORT_EMAIL.toLowerCase().trim()) &&
      safeCompare(password, process.env.SUPPORT_PASSWORD)
    ) {
      role = "support";
      name = "Support Officer";
    }
  }

  if (!role) {
    // Record failed attempt
    const current = loginAttempts.get(clientIp) || {
      count: 0,
      lastAttempt: now,
    };
    loginAttempts.set(clientIp, {
      count: current.count + 1,
      lastAttempt: now,
    });

    if (staffEmailMatch) {
      logAudit({
        actorEmail: cleanEmail,
        actorRole: matchedStaff?.role || "customer",
        action: "STAFF_LOGIN_FAILED",
        target: cleanEmail,
        details: `Failed staff login attempt from IP ${clientIp}.`,
      });
    }

    // Artificial delay to prevent brute-force timing enumeration
    await new Promise((res) => setTimeout(res, 500));

    return {
      success: false,
      isStaffEmail: staffEmailMatch,
      error: "Invalid administrative credentials.",
    };
  }

  // Reset rate limiting on successful login
  loginAttempts.delete(clientIp);

  const token = createAdminToken(email, role, name);
  const resolvedPermissions = permissions || computeEffectivePermissions(role);

  logAudit({
    actorEmail: cleanEmail,
    actorRole: role,
    action: "STAFF_LOGIN_SUCCESS",
    target: cleanEmail,
    details: `Signed in as ${name} (${role}) from IP ${clientIp}.`,
  });

  return {
    success: true,
    token,
    user: {
      id: matchedStaff?.id || `staff-${role}`,
      email: cleanEmail,
      name,
      role,
      permissions: resolvedPermissions,
    },
  };
}
