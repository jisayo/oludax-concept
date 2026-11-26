import { NextRequest, NextResponse } from "next/server";
import {
  authenticateAdminUser,
  verifyAdminRequest,
  revokeAdminToken,
  isReservedStaffEmail,
  TOKEN_LIFETIME_MS,
} from "@/lib/server/admin-auth";

export const dynamic = "force-dynamic";

/**
 * Check if current user has a verified administrative session
 */
export async function GET(request: NextRequest) {
  const auth = verifyAdminRequest(request);
  if (!auth.authorized || !auth.user) {
    return NextResponse.json(
      { authenticated: false, error: auth.error || "Not authenticated." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: `staff-${auth.user.role}`,
      email: auth.user.email,
      name: auth.user.name,
      role: auth.user.role,
      permissions: auth.user.permissions,
    },
  });
}

/**
 * Secure login endpoint with constant-time password validation & rate-limiting
 * Emits strictly HttpOnly session cookie (no token exposure in JSON body).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, checkOnly } = body;

    if (checkOnly && typeof email === "string") {
      return NextResponse.json({
        isStaffEmail: isReservedStaffEmail(email),
      });
    }

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          isStaffEmail: typeof email === "string" ? isReservedStaffEmail(email) : false,
          error: "Email and passkey are required.",
        },
        { status: 400 }
      );
    }

    // Identify client IP
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const result = await authenticateAdminUser(clientIp, email, password);

    if (!result.success || !result.token) {
      return NextResponse.json(
        {
          success: false,
          isStaffEmail: result.isStaffEmail ?? false,
          error: result.error || "Invalid credentials.",
        },
        { status: 401 }
      );
    }

    // Response contains only the verified user payload, NOT the raw token
    const response = NextResponse.json({
      success: true,
      user: result.user,
    });

    // Set secure HttpOnly session cookie
    response.cookies.set("oludax_admin_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: Math.floor(TOKEN_LIFETIME_MS / 1000), // 12 hours in seconds
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Admin auth error:", err);
    return NextResponse.json(
      { success: false, error: "Server authentication error." },
      { status: 500 }
    );
  }
}

/**
 * Logout and clear session cookie + invalidate token
 */
export async function DELETE(request: NextRequest) {
  const cookie = request.cookies.get("oludax_admin_token")?.value;
  if (cookie) {
    revokeAdminToken(cookie);
  }

  const response = NextResponse.json({
    success: true,
    message: "Admin session terminated successfully.",
  });

  response.cookies.set("oludax_admin_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
