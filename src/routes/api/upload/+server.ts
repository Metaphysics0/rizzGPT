import { json } from "@sveltejs/kit";
import { put } from "@vercel/blob";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request }) => {
  try {
    const form = await request.formData();
    const file = form.get("file") as File;

    if (!file) {
      return json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size (max 50MB for safety)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return json(
        { error: "File too large. Maximum size is 50MB." },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
    ];
    if (!allowedTypes.includes(file.type)) {
      return json(
        { error: "Invalid file type. Only images and videos are allowed." },
        { status: 400 }
      );
    }

    // Generate unique filename to avoid conflicts
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2);
    const extension = file.name.split(".").pop() || "bin";
    const uniqueFilename = `uploads/${timestamp}-${randomId}.${extension}`;

    // Upload directly to Vercel Blob
    const blob = await put(uniqueFilename, file, {
      access: "public",
    });

    return json({
      url: blob.url,
      filename: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Upload error:", error);
    return json(
      {
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 }
    );
  }
}) satisfies RequestHandler;
