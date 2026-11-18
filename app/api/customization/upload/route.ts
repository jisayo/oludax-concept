import { NextRequest, NextResponse } from "next/server";
import { saveCustomizationUpload } from "@/lib/server/db";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
];

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let fileName = "";
    let fileType = "";
    let fileSize = 0;
    let fileUrl = "";
    let orderRef: string | undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      orderRef = (formData.get("orderRef") as string) || undefined;

      if (!file) {
        return NextResponse.json(
          { success: false, error: "No file was attached in the request." },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, error: "File size exceeds 10MB limit." },
          { status: 400 }
        );
      }

      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            success: false,
            error: "Unsupported file format. Please upload PNG, JPG, WEBP, SVG or PDF.",
          },
          { status: 400 }
        );
      }

      fileName = file.name;
      fileType = file.type;
      fileSize = file.size;

      // In local/fallback mode, generate a placeholder upload reference
      // In production with Supabase Storage, write to 'customizations' bucket
      fileUrl = `/uploads/customizations/${Date.now()}-${fileName.replace(/\s+/g, "_")}`;
    } else {
      // JSON payload fallback
      const body = await request.json();
      fileName = body.fileName || "custom_artwork.png";
      fileType = body.fileType || "image/png";
      fileUrl = body.dataUrl || body.fileUrl || "";
      orderRef = body.orderRef;

      if (!fileUrl) {
        return NextResponse.json(
          { success: false, error: "Image data URL is required." },
          { status: 400 }
        );
      }
    }

    const saved = await saveCustomizationUpload({
      orderRef,
      fileUrl,
      fileName,
      fileSize,
      fileType,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Artwork uploaded successfully",
        data: saved,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process upload." },
      { status: 500 }
    );
  }
}
