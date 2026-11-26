import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, hasEffectivePermission } from "@/lib/server/admin-auth";
import {
  listStaffAccounts,
  createStaffAccount,
  updateStaffAccount,
  deleteStaffAccount,
  logAudit,
} from "@/lib/server/admin-store";
import { Permission } from "@/lib/rbac";

export const dynamic = "force-dynamic";

const ALLOWED_STAFF_ROLES = new Set(["admin", "manager", "support"]);

export async function GET(request: NextRequest) {
  const auth = verifyAdminRequest(request);
  if (!auth.authorized || !auth.user) {
    return NextResponse.json(
      { success: false, error: auth.error || "Administrative authorization required." },
      { status: 401 }
    );
  }

  // Super Admin (manage_staff) and Store Admin can view staff information
  const canView =
    hasEffectivePermission(auth.user, "manage_staff") ||
    auth.user.role === "admin";
  if (!canView) {
    return NextResponse.json(
      { success: false, error: "Forbidden: Insufficient permissions to view staff." },
      { status: 403 }
    );
  }

  return NextResponse.json({
    success: true,
    staff: listStaffAccounts(),
  });
}

export async function POST(request: NextRequest) {
  const auth = verifyAdminRequest(request);
  if (!auth.authorized || !auth.user) {
    return NextResponse.json(
      { success: false, error: auth.error || "Administrative authorization required." },
      { status: 401 }
    );
  }

  if (
    auth.user.role !== "super_admin" ||
    !hasEffectivePermission(auth.user, "manage_staff")
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "Forbidden: Only Super Admin can create staff accounts.",
      },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const role = String(body.role || "");
    if (!ALLOWED_STAFF_ROLES.has(role)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid role. Super Admin privileges cannot be assigned directly.",
        },
        { status: 400 }
      );
    }

    if (!body.email || !body.name || !body.password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    const created = createStaffAccount({
      email: String(body.email),
      name: String(body.name),
      role: role as "admin" | "manager" | "support",
      password: String(body.password),
      customGrant: Array.isArray(body.customGrant)
        ? (body.customGrant as Permission[])
        : [],
      customRevoke: Array.isArray(body.customRevoke)
        ? (body.customRevoke as Permission[])
        : [],
    });

    logAudit({
      actorEmail: auth.user.email,
      actorRole: auth.user.role,
      action: "STAFF_CREATED",
      target: created.email,
      details: `Created staff account "${created.name}" with role ${created.role}.`,
    });

    return NextResponse.json({ success: true, staff: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create staff account." },
      { status: 400 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const auth = verifyAdminRequest(request);
  if (!auth.authorized || !auth.user) {
    return NextResponse.json(
      { success: false, error: auth.error || "Administrative authorization required." },
      { status: 401 }
    );
  }

  if (
    auth.user.role !== "super_admin" ||
    !hasEffectivePermission(auth.user, "manage_staff")
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "Forbidden: Only Super Admin can modify roles or permissions.",
      },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Staff ID is required." },
        { status: 400 }
      );
    }

    if (body.role !== undefined && !ALLOWED_STAFF_ROLES.has(String(body.role))) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid role. Cannot promote to Super Admin via this endpoint.",
        },
        { status: 400 }
      );
    }

    const updated = updateStaffAccount({
      id: String(body.id),
      name: body.name !== undefined ? String(body.name) : undefined,
      role: body.role !== undefined ? (body.role as "admin" | "manager" | "support") : undefined,
      active: body.active !== undefined ? Boolean(body.active) : undefined,
      password: body.password ? String(body.password) : undefined,
      customGrant: Array.isArray(body.customGrant)
        ? (body.customGrant as Permission[])
        : undefined,
      customRevoke: Array.isArray(body.customRevoke)
        ? (body.customRevoke as Permission[])
        : undefined,
    });

    logAudit({
      actorEmail: auth.user.email,
      actorRole: auth.user.role,
      action: "STAFF_UPDATED",
      target: updated.email,
      details: `Updated ${updated.email} -> role: ${updated.role}, active: ${updated.active}, grants: [${updated.customGrant.join(", ")}], revokes: [${updated.customRevoke.join(", ")}].`,
    });

    return NextResponse.json({ success: true, staff: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update staff account." },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const auth = verifyAdminRequest(request);
  if (!auth.authorized || !auth.user) {
    return NextResponse.json(
      { success: false, error: auth.error || "Administrative authorization required." },
      { status: 401 }
    );
  }

  if (
    auth.user.role !== "super_admin" ||
    !hasEffectivePermission(auth.user, "manage_staff")
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "Forbidden: Only Super Admin can delete staff accounts.",
      },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Staff ID is required." },
        { status: 400 }
      );
    }

    const deleted = deleteStaffAccount(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Staff account not found." },
        { status: 404 }
      );
    }

    logAudit({
      actorEmail: auth.user.email,
      actorRole: auth.user.role,
      action: "STAFF_DELETED",
      target: id,
      details: `Deleted staff account ${id}.`,
    });

    return NextResponse.json({ success: true, message: "Staff account deleted." });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete staff account." },
      { status: 400 }
    );
  }
}
