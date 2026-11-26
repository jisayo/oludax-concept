import { NextRequest, NextResponse } from "next/server";
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/server/db";
import { verifyAdminRequest, hasEffectivePermission } from "@/lib/server/admin-auth";
import { logAudit } from "@/lib/server/admin-store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = verifyAdminRequest(request);
  if (!auth.authorized || !auth.user) {
    return NextResponse.json(
      { success: false, error: auth.error || "Administrative authorization required." },
      { status: 401 }
    );
  }

  if (!hasEffectivePermission(auth.user, "view_admin_panel")) {
    return NextResponse.json(
      { success: false, error: "Forbidden: Admin panel access required." },
      { status: 403 }
    );
  }

  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return NextResponse.json({
    success: true,
    products,
    categories,
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

  if (!hasEffectivePermission(auth.user, "manage_inventory")) {
    return NextResponse.json(
      { success: false, error: "Forbidden: Insufficient permissions to add products." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    if (!body.name || !body.category || Number(body.price) <= 0) {
      return NextResponse.json(
        { success: false, error: "Product name, category, and valid price are required." },
        { status: 400 }
      );
    }

    const created = await createProduct({
      name: String(body.name),
      price: Number(body.price),
      compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : undefined,
      primaryImage: body.primaryImage ? String(body.primaryImage) : undefined,
      description: body.description ? String(body.description) : undefined,
      shortDescription: body.shortDescription ? String(body.shortDescription) : undefined,
      category: String(body.category),
      categorySlug: body.categorySlug ? String(body.categorySlug) : undefined,
      inStock: body.inStock !== undefined ? Boolean(body.inStock) : true,
      stockCount: body.stockCount !== undefined ? Number(body.stockCount) : 25,
      customizable: body.customizable !== undefined ? Boolean(body.customizable) : true,
      featured: body.featured !== undefined ? Boolean(body.featured) : false,
      designs: Array.isArray(body.designs)
        ? body.designs.map((d: any) => String(d).trim()).filter(Boolean)
        : undefined,
    });

    logAudit({
      actorEmail: auth.user.email,
      actorRole: auth.user.role,
      action: "PRODUCT_CREATED",
      target: created.id,
      details: `Added "${created.name}" (${created.category}) at ₦${created.price.toLocaleString()}.`,
    });

    return NextResponse.json({ success: true, product: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create product." },
      { status: 500 }
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

  if (!hasEffectivePermission(auth.user, "manage_inventory")) {
    return NextResponse.json(
      { success: false, error: "Forbidden: Insufficient permissions to edit products." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required." },
        { status: 400 }
      );
    }

    const updated = await updateProduct({
      id: String(body.id),
      name: body.name !== undefined ? String(body.name) : undefined,
      price: body.price !== undefined ? Number(body.price) : undefined,
      compareAtPrice:
        body.compareAtPrice !== undefined ? Number(body.compareAtPrice) : undefined,
      primaryImage:
        body.primaryImage !== undefined ? String(body.primaryImage) : undefined,
      description:
        body.description !== undefined ? String(body.description) : undefined,
      shortDescription:
        body.shortDescription !== undefined ? String(body.shortDescription) : undefined,
      category: body.category !== undefined ? String(body.category) : undefined,
      categorySlug:
        body.categorySlug !== undefined ? String(body.categorySlug) : undefined,
      inStock: body.inStock !== undefined ? Boolean(body.inStock) : undefined,
      stockCount:
        body.stockCount !== undefined ? Number(body.stockCount) : undefined,
      customizable:
        body.customizable !== undefined ? Boolean(body.customizable) : undefined,
      featured: body.featured !== undefined ? Boolean(body.featured) : undefined,
      designs: Array.isArray(body.designs)
        ? body.designs.map((d: any) => String(d).trim()).filter(Boolean)
        : undefined,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Product not found." },
        { status: 404 }
      );
    }

    logAudit({
      actorEmail: auth.user.email,
      actorRole: auth.user.role,
      action: "PRODUCT_UPDATED",
      target: updated.id,
      details: `Updated "${updated.name}" (Price: ₦${updated.price.toLocaleString()}, Stock: ${updated.inStock ? updated.stockCount : 0}).`,
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update product." },
      { status: 500 }
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

  if (!hasEffectivePermission(auth.user, "manage_inventory")) {
    return NextResponse.json(
      { success: false, error: "Forbidden: Insufficient permissions to delete products." },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required." },
        { status: 400 }
      );
    }

    const deleted = await deleteProduct(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Product not found." },
        { status: 404 }
      );
    }

    logAudit({
      actorEmail: auth.user.email,
      actorRole: auth.user.role,
      action: "PRODUCT_DELETED",
      target: id,
      details: `Permanently removed product ${id} from catalog.`,
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted from catalog.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete product." },
      { status: 500 }
    );
  }
}
