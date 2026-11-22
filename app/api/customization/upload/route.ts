import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  saveCustomizationUpload,
  getSupabaseServerClient,
  getOrderByRef,
} from "@/lib/server/db";
import {
  getClientIp,
  uploadRateLimiter,
  rateLimitExceededResponse,
} from "@/lib/server/rate-limit";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

type AllowedType = {
  mime: string;
  ext: string;
};

/**
 * Inspect binary magic bytes to determine true file format.
 * Prevents disguised executable scripts or renamed malicious files.
 */
function detectFileTypeFromBuffer(buffer: Buffer): AllowedType | null {
  if (buffer.length < 8) return null;

  // 1. PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { mime: "image/png", ext: "png" };
  }

  // 2. JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mime: "image/jpeg", ext: "jpg" };
  }

  // 3. WEBP: RIFF .... WEBP
  if (
    buffer.length >= 12 &&
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { mime: "image/webp", ext: "webp" };
  }

  // 4. PDF: %PDF (25 50 44 46)
  if (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  ) {
    return { mime: "application/pdf", ext: "pdf" };
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rl = uploadRateLimiter.check(clientIp);
    if (!rl.success) {
      return rateLimitExceededResponse(rl.resetMs);
    }

    const contentType = request.headers.get("content-type") || "";

    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid request format. Artwork files must be uploaded as multipart/form-data.",
        },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const orderRefRaw = formData.get("orderRef") as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file was attached in the request." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File size exceeds the 10MB limit." },
        { status: 400 }
      );
    }

    // Verify order reference if provided
    let verifiedOrderRef: string | undefined;
    if (orderRefRaw && orderRefRaw.trim()) {
      const order = await getOrderByRef(orderRefRaw.trim());
      if (!order) {
        return NextResponse.json(
          {
            success: false,
            error: `Specified order #${orderRefRaw} does not exist.`,
          },
          { status: 400 }
        );
      }
      verifiedOrderRef = order.orderRef;
    }

    // Read file bytes into Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Verify true binary signature (Magic Bytes)
    const detected = detectFileTypeFromBuffer(buffer);
    if (!detected) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Unsupported or disguised file format. Only genuine PNG, JPG, WEBP, and PDF files are accepted for production.",
        },
        { status: 400 }
      );
    }

    // Security: Disallow SVG to prevent script/stored-XSS attacks
    if (file.name.toLowerCase().endsWith(".svg") || file.type === "image/svg+xml") {
      return NextResponse.json(
        {
          success: false,
          error:
            "SVG files with executable XML scripts are not permitted for security. Please upload PNG, JPG, or PDF.",
        },
        { status: 400 }
      );
    }

    // Generate non-predictable, unique storage key
    const uniqueId = crypto.randomUUID();
    const safeStorageKey = `art_${Date.now()}_${uniqueId}.${detected.ext}`;
    let fileUrl = "";

    const supabase = getSupabaseServerClient();

    if (supabase) {
      try {
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from("customizations")
          .upload(safeStorageKey, buffer, {
            contentType: detected.mime,
            upsert: false,
          });

        if (uploadErr) {
          console.error("Supabase storage upload error:", uploadErr);
          if (
            process.env.REQUIRE_DB === "true" ||
            process.env.NODE_ENV === "production"
          ) {
            throw new Error(
              `Storage persistence failed: ${uploadErr.message}`
            );
          }
        }

        if (uploadData?.path) {
          // Retrieve public or signed URL from Supabase Storage
          const { data: publicData } = supabase.storage
            .from("customizations")
            .getPublicUrl(uploadData.path);

          fileUrl = publicData?.publicUrl || `/storage/customizations/${uploadData.path}`;
        }
      } catch (storageErr: any) {
        if (
          process.env.REQUIRE_DB === "true" ||
          process.env.NODE_ENV === "production"
        ) {
          throw storageErr;
        }
      }
    }

    // Fallback URL if running in local dev without cloud storage bucket
    if (!fileUrl) {
      fileUrl = `/uploads/customizations/${safeStorageKey}`;
    }

    // Persist upload metadata record
    const saved = await saveCustomizationUpload({
      orderRef: verifiedOrderRef,
      fileUrl,
      fileName: file.name.slice(0, 100),
      fileSize: file.size,
      fileType: detected.mime,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Artwork uploaded and verified successfully.",
        data: {
          id: saved.id,
          orderRef: saved.orderRef,
          fileUrl: saved.fileUrl,
          fileName: saved.fileName,
          fileSize: saved.fileSize,
          fileType: saved.fileType,
          createdAt: saved.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Customization upload error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process upload." },
      { status: 500 }
    );
  }
}
