import { NextRequest, NextResponse } from "next/server";
import { authenticateAdminUser, verifyAdminRequest } from "@/lib/server/admin-auth";

export const dynamic = "force-dynamic";

/**
 * Check if current user is an authorized admin
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
    },
  });
}

/**
 * Secure login endpoint with constant-time password validation & rate-limiting
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and passkey are required." },
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
        { success: false, error: result.error || "Invalid credentials." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      token: result.token,
      user: result.user,
    });

    // Set secure HttpOnly session cookie
    response.cookies.set("oludax_admin_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
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
 * Logout and clear session cookie
 */
export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out." });
  response.cookies.delete("oludax_admin_token");
  return response;
}
