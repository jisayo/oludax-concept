import { NextRequest, NextResponse } from "next/server";
import { getProductByIdOrSlug } from "@/lib/server/db";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID or slug is required" },
        { status: 400 }
      );
    }

    const product = await getProductByIdOrSlug(id);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}
