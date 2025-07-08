import { BlobStorageService } from "$lib/server/services/blob-storage.service";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request }) => {
  try {
    const form = await request.formData();
    const file = form.get("file") as File;

    if (!file) {
      return json({ error: "No file provided" }, { status: 400 });
    }
    const result = await new BlobStorageService().uploadFile(file);

    return json(result);
  } catch (error) {
    console.error("Upload endpoint error:", error);
    return json(
      {
        error: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 }
    );
  }
}) satisfies RequestHandler;
