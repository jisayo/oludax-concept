import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, hasEffectivePermission } from "@/lib/server/admin-auth";
import {
  listAuditLogs,
  getSystemSettings,
  updateSystemSettings,
  logAudit,
} from "@/lib/server/admin-store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
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
        error: "Forbidden: Only Super Admin can view system audit logs and security settings.",
      },
      { status: 403 }
    );
  }

  return NextResponse.json({
    success: true,
    logs: listAuditLogs(150),
    settings: getSystemSettings(),
  });
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
        error: "Forbidden: Only Super Admin can modify system settings.",
      },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const updated = updateSystemSettings({
      storeName: body.storeName !== undefined ? String(body.storeName).trim() : undefined,
      whatsappNumber:
        body.whatsappNumber !== undefined ? String(body.whatsappNumber).trim() : undefined,
      dispatchHub:
        body.dispatchHub !== undefined ? String(body.dispatchHub).trim() : undefined,
      freeDeliveryThreshold:
        body.freeDeliveryThreshold !== undefined
          ? Number(body.freeDeliveryThreshold)
          : undefined,
      standardShippingFee:
        body.standardShippingFee !== undefined
          ? Number(body.standardShippingFee)
          : undefined,
      acceptingOrders:
        body.acceptingOrders !== undefined ? Boolean(body.acceptingOrders) : undefined,
    });

    logAudit({
      actorEmail: auth.user.email,
      actorRole: auth.user.role,
      action: "SYSTEM_SETTINGS_UPDATED",
      target: "system_settings",
      details: `Updated store settings (Accepting orders: ${updated.acceptingOrders}, Free shipping: ₦${updated.freeDeliveryThreshold.toLocaleString()}).`,
    });

    return NextResponse.json({
      success: true,
      settings: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update settings." },
      { status: 500 }
    );
  }
}
