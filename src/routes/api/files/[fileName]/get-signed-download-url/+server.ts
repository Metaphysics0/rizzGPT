import { BackblazeStorageService } from "$lib/server/services/backblaze-storage.service";
import { error, isRedirect, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params, locals, setHeaders }) => {
  try {
    if (!locals.user) throw error(401, "Unauthorized");
    if (!params.fileName) throw error(400, "Filename required");

    // Set cache headers for the redirect (since images never change)
    setHeaders({
      "Cache-Control": "public, max-age=86400, immutable", // 24 hours, immutable
      Vary: "Authorization", // Vary by user since URLs are user-scoped
    });

    const filePath = `uploads/${locals.user.id}/${params.fileName}`;
    const signedUrl = await new BackblazeStorageService().getSignedDownloadUrl(
      filePath
    );

    redirect(302, signedUrl);
  } catch (err) {
    if (isRedirect(err)) {
      throw err;
    }
    console.error("File download error:", err);
    throw error(500, "Failed to access file");
  }
};
